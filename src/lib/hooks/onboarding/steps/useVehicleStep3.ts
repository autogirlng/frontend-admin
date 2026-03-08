"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";

type VehiclePhoto = {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
};

type FileState = {
  file?: File;
  preview: string;
  publicId?: string;
  isUploading: boolean;
  isUploaded: boolean;
};

type VehicleDetails = {
  id: string;
  photos: VehiclePhoto[] | null;
};

type UpdatePhotosPayload = {
  photos: VehiclePhoto[];
};

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

async function uploadToCloudinary(
  file: File,
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  );

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

export function useVehiclePhotos(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const [photos, setPhotos] = useState<FileState[]>([]);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [originalPayload, setOriginalPayload] =
    useState<UpdatePhotosPayload | null>(null);

  const { data: vehicleDetails, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicleDetails", vehicleId],
    queryFn: async () => {
      const res = await apiClient.get<VehicleDetails>(`/vehicles/${vehicleId}`);
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  useEffect(() => {
    if (vehicleDetails && !originalPayload) {
      const existingPhotosRaw = vehicleDetails.photos || [];

      const existingPhotos: FileState[] = existingPhotosRaw.map((p) => ({
        preview: p.cloudinaryUrl,
        publicId: p.cloudinaryPublicId,
        isUploading: false,
        isUploaded: true,
      }));
      setPhotos(existingPhotos);

      const primary = existingPhotosRaw.find((p) => p.isPrimary);
      const initialPrimaryId =
        primary?.cloudinaryPublicId || existingPhotos[0]?.publicId || null;
      setPrimaryPhotoId(initialPrimaryId);

      setOriginalPayload({
        photos: existingPhotos.map((p) => ({
          cloudinaryUrl: p.preview,
          cloudinaryPublicId: p.publicId!,
          isPrimary: p.publicId === initialPrimaryId,
        })),
      });
    }
  }, [vehicleDetails, originalPayload]);

  const { mutate: updateVehiclePhotos } = useMutation({
    mutationFn: (payload: UpdatePhotosPayload) => {
      return apiClient.patch(
        `/vehicles/photos?vehicleId=${vehicleId}`,
        payload,
      );
    },
    onSuccess: () => {
      toast.success("Photos saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      router.push(`/dashboard/onboarding/pricing?id=${vehicleId}`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save photos.");
      setIsSubmitting(false);
    },
  });

  const onFilesDrop = (acceptedFiles: File[]) => {
    const newFileStates: FileState[] = acceptedFiles.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      isUploaded: false,
    }));

    setPhotos((prev) => [...prev, ...newFileStates]);

    newFileStates.forEach((fileState) => {
      uploadToCloudinary(fileState.file!)
        .then((result) => {
          setPhotos((prev) =>
            prev.map((p) =>
              p.preview === fileState.preview
                ? {
                    ...p,
                    preview: result.url,
                    publicId: result.publicId,
                    isUploading: false,
                    isUploaded: true,
                    file: undefined,
                  }
                : p,
            ),
          );

          setPrimaryPhotoId((prev) => prev || result.publicId);
        })
        .catch((err) => {
          toast.error(`Failed to upload ${fileState.file!.name}`);
          setPhotos((prev) =>
            prev.filter((p) => p.preview !== fileState.preview),
          );
        });
    });
  };

  const onRemovePhoto = async (publicIdToRemove: string) => {
    const remainingPhotos = photos.filter(
      (p) => p.publicId !== publicIdToRemove,
    );
    setPhotos(remainingPhotos);

    if (primaryPhotoId === publicIdToRemove) {
      setPrimaryPhotoId(remainingPhotos[0]?.publicId || null);
    }

    try {
      const res = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: publicIdToRemove }),
      });

      if (!res.ok) {
        console.error("Failed to delete from Cloudinary API");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const onSetPrimary = (publicIdToSet: string) => {
    setPrimaryPhotoId(publicIdToSet);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const stillUploading = photos.some((p) => p.isUploading);
    if (stillUploading) {
      toast.warn("Please wait for all uploads to complete.");
      return;
    }

    if (photos.length === 0) {
      toast.error("Please upload at least one photo.");
      return;
    }

    if (!primaryPhotoId) {
      toast.error("Please set a primary photo.");
      return;
    }

    const payload: UpdatePhotosPayload = {
      photos: photos.map((p) => ({
        cloudinaryUrl: p.preview,
        cloudinaryPublicId: p.publicId!,
        isPrimary: p.publicId === primaryPhotoId,
      })),
    };

    if (
      originalPayload &&
      JSON.stringify(originalPayload) === JSON.stringify(payload)
    ) {
      toast.info("No changes detected. Proceeding to next step.");
      router.push(`/dashboard/onboarding/pricing?id=${vehicleId}`);
      return;
    }

    setIsSubmitting(true);
    updateVehiclePhotos(payload);
  };

  return {
    photos,
    primaryPhotoId,
    isLoading: isLoadingVehicle,
    isLoadingSession: sessionStatus === "loading",
    isSubmitting,
    onFilesDrop,
    onRemovePhoto,
    onSetPrimary,
    handleSubmit,
  };
}

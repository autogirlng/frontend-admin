// lib/hooks/onboarding/steps/useVehicleStep3.ts
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";

// --- Type Definitions ---

// The structure of a photo object in your API
type VehiclePhoto = {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
};

// The state for a file being managed
type FileState = {
  file?: File; // The raw file, present for new uploads
  preview: string; // The URL.createObjectURL or existing cloudinaryUrl
  publicId?: string; // The Cloudinary ID
  isUploading: boolean; // Show spinner?
  isUploaded: boolean; // Is it on Cloudinary?
};

// GET /vehicles/{id} (structure of relevant photo fields)
type VehicleDetails = {
  id: string;
  photos: VehiclePhoto[] | null;
};

// PATCH /vehicles/photos payload
type UpdatePhotosPayload = {
  photos: VehiclePhoto[];
};

// --- Cloudinary Upload Function ---
// This runs on the client, independent of our backend
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

async function uploadToCloudinary(
  file: File
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
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

// --- The Hook ---
export function useVehiclePhotos(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  // This state holds all photos (existing and new)
  const [photos, setPhotos] = useState<FileState[]>([]);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching: Get existing photos ---
  const { data: vehicleDetails, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicleDetails", vehicleId],
    queryFn: async () => {
      const res = await apiClient.get<VehicleDetails>(`/vehicles/${vehicleId}`);
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  // --- Prefill: Load existing photos into state ---
  useEffect(() => {
    if (vehicleDetails?.photos) {
      const existingPhotos: FileState[] = vehicleDetails.photos.map((p) => ({
        preview: p.cloudinaryUrl,
        publicId: p.cloudinaryPublicId,
        isUploading: false,
        isUploaded: true,
      }));
      setPhotos(existingPhotos);

      const primary = vehicleDetails.photos.find((p) => p.isPrimary);
      setPrimaryPhotoId(
        primary?.cloudinaryPublicId || existingPhotos[0]?.publicId || null
      );
    }
  }, [vehicleDetails]);

  // --- Mutation: Save to our backend ---
  const { mutate: updateVehiclePhotos } = useMutation({
    mutationFn: (payload: UpdatePhotosPayload) => {
      return apiClient.patch(
        `/vehicles/photos?vehicleId=${vehicleId}`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Photos saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      router.push(`/dashboard/onboarding/pricing?id=${vehicleId}`); // Go to next step
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save photos.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // --- Core Upload Handler ---
  const onFilesDrop = (acceptedFiles: File[]) => {
    // 1. Create temporary preview states
    const newFileStates: FileState[] = acceptedFiles.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      isUploaded: false,
    }));

    // Add new files to the list
    setPhotos((prev) => [...prev, ...newFileStates]);

    // 2. Start uploading each file
    newFileStates.forEach((fileState) => {
      uploadToCloudinary(fileState.file!)
        .then((result) => {
          // 3. Update the file's state with Cloudinary data
          setPhotos((prev) =>
            prev.map((p) =>
              p.preview === fileState.preview // Find by preview URL
                ? {
                    ...p,
                    preview: result.url, // Update preview to permanent URL
                    publicId: result.publicId,
                    isUploading: false,
                    isUploaded: true,
                    file: undefined, // Clear raw file from memory
                  }
                : p
            )
          );

          // If this is the very first photo, make it primary
          setPrimaryPhotoId((prev) => prev || result.publicId);
        })
        .catch((err) => {
          toast.error(`Failed to upload ${fileState.file!.name}`);
          // Remove the failed upload from state
          setPhotos((prev) =>
            prev.filter((p) => p.preview !== fileState.preview)
          );
        });
    });
  };

  // --- Other Handlers ---
  const onRemovePhoto = (publicIdToRemove: string) => {
    // TODO: Add call to Cloudinary 'delete' API if you want
    setPhotos((prev) => prev.filter((p) => p.publicId !== publicIdToRemove));

    // If we removed the primary photo, set a new primary
    if (primaryPhotoId === publicIdToRemove) {
      setPrimaryPhotoId(photos[0]?.publicId || null);
    }
  };

  const onSetPrimary = (publicIdToSet: string) => {
    setPrimaryPhotoId(publicIdToSet);
  };

  // --- Submit Handler ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if any files are still uploading
    const stillUploading = photos.some((p) => p.isUploading);
    if (stillUploading) {
      toast.warn("Please wait for all uploads to complete.");
      setIsSubmitting(false);
      return;
    }

    if (photos.length === 0) {
      toast.error("Please upload at least one photo.");
      setIsSubmitting(false);
      return;
    }

    if (!primaryPhotoId) {
      toast.error("Please set a primary photo.");
      setIsSubmitting(false);
      return;
    }

    // Format the payload for our backend
    const payload: UpdatePhotosPayload = {
      photos: photos.map((p) => ({
        cloudinaryUrl: p.preview, // This is now the permanent URL
        cloudinaryPublicId: p.publicId!,
        isPrimary: p.publicId === primaryPhotoId,
      })),
    };

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

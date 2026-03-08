"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";

type VehicleDocument = {
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
};

export type DocumentUploadState = {
  documentType: string;
  cloudinaryUrl: string | null;
  cloudinaryPublicId: string | null;
  fileName: string | null;
  status: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
};

type VehicleDetails = {
  id: string;
  documents: VehicleDocument[] | null;
};

type UpdateDocumentsPayload = {
  documents: VehicleDocument[];
};

export const documentList = [
  {
    type: "VEHICLE_REGISTRATION",
    label: "Vehicle Registration",
    isCompulsory: true,
  },
  {
    type: "INSURANCE_CERTIFICATE",
    label: "Insurance Certificate",
    isCompulsory: true,
  },
  {
    type: "PROOF_OF_OWNERSHIP",
    label: "Proof of Ownership",
    isCompulsory: false,
  },
  {
    type: "INSPECTION_REPORT",
    label: "Inspection Report",
    isCompulsory: false,
  },
  {
    type: "MAINTENANCE_HISTORY",
    label: "Maintenance History",
    isCompulsory: false,
  },
  {
    type: "AUTHORIZATION_LETTER",
    label: "Authorization Letter",
    isCompulsory: false,
  },
];

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function uploadToCloudinary(
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
    const errorData = await response.json();
    throw new Error(errorData.error.message || "Cloudinary upload failed");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

export function useVehicleDocuments(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const [docStates, setDocStates] = useState<
    Record<string, DocumentUploadState>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [originalPayload, setOriginalPayload] =
    useState<UpdateDocumentsPayload | null>(null);

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
      const initialState: Record<string, DocumentUploadState> = {};
      const initialPayloadDocs: VehicleDocument[] = [];

      documentList.forEach((doc) => {
        const existingDoc = vehicleDetails?.documents?.find(
          (d) => d.documentType === doc.type,
        );

        if (existingDoc) {
          initialState[doc.type] = {
            documentType: doc.type,
            cloudinaryUrl: existingDoc.cloudinaryUrl,
            cloudinaryPublicId: existingDoc.cloudinaryPublicId,
            fileName: "Uploaded Document",
            status: "success",
          };

          initialPayloadDocs.push({
            documentType: doc.type,
            cloudinaryUrl: existingDoc.cloudinaryUrl,
            cloudinaryPublicId: existingDoc.cloudinaryPublicId,
          });
        } else {
          initialState[doc.type] = {
            documentType: doc.type,
            cloudinaryUrl: null,
            cloudinaryPublicId: null,
            fileName: null,
            status: "idle",
          };
        }
      });

      setDocStates(initialState);

      setOriginalPayload({ documents: initialPayloadDocs });
    }
  }, [vehicleDetails, originalPayload]);

  const { mutate: updateVehicleDocuments } = useMutation({
    mutationFn: (payload: UpdateDocumentsPayload) => {
      return apiClient.patch(
        `/vehicles/documents?vehicleId=${vehicleId}`,
        payload,
      );
    },
    onSuccess: () => {
      toast.success("Documents saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      router.push(`/dashboard/onboarding/photos?id=${vehicleId}`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save documents.");
      setIsSubmitting(false);
    },
  });

  const updateDocumentState = (
    docType: string,
    newState: Partial<DocumentUploadState>,
  ) => {
    const currentState = docStates[docType];

    if (
      newState.status === "idle" &&
      currentState?.cloudinaryPublicId &&
      !newState.cloudinaryPublicId
    ) {
      fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: currentState.cloudinaryPublicId }),
      }).catch((err) =>
        console.error("Failed to delete document from Cloudinary", err),
      );
    }

    setDocStates((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        ...newState,
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const missingDocs: string[] = [];
    let hasActiveUploads = false;

    documentList.forEach((doc) => {
      const state = docStates[doc.type];

      if (state?.status === "uploading") {
        hasActiveUploads = true;
      }

      if (doc.isCompulsory) {
        if (!state || state.status !== "success") {
          missingDocs.push(doc.label);
          updateDocumentState(doc.type, {
            status: "error",
            errorMessage: "This document is required.",
          });
        }
      }
    });

    if (hasActiveUploads) {
      toast.warn("Please wait for all uploads to complete.");
      return;
    }

    if (missingDocs.length > 0) {
      toast.error(`Missing compulsory documents: ${missingDocs.join(", ")}`);
      return;
    }

    const payload: UpdateDocumentsPayload = {
      documents: Object.values(docStates)
        .filter(
          (state) => state.status === "success" && state.cloudinaryPublicId,
        )
        .map((state) => ({
          documentType: state.documentType,
          cloudinaryUrl: state.cloudinaryUrl!,
          cloudinaryPublicId: state.cloudinaryPublicId!,
        })),
    };

    const sortDocs = (docs: VehicleDocument[]) =>
      [...docs].sort((a, b) => a.documentType.localeCompare(b.documentType));

    if (
      originalPayload &&
      JSON.stringify(sortDocs(originalPayload.documents)) ===
        JSON.stringify(sortDocs(payload.documents))
    ) {
      toast.info("No changes detected. Proceeding to next step.");
      router.push(`/dashboard/onboarding/photos?id=${vehicleId}`);
      return;
    }

    setIsSubmitting(true);
    updateVehicleDocuments(payload);
  };

  return {
    docStates,
    isLoading: isLoadingVehicle,
    isLoadingSession: sessionStatus === "loading",
    isSubmitting,
    updateDocumentState,
    handleSubmit,
  };
}

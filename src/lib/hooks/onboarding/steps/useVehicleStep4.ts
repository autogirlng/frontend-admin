// lib/hooks/onboarding/steps/useVehicleStep4.ts
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";

// --- Type Definitions ---

// The structure of a document object in your API
type VehicleDocument = {
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
};

// The state for *each* file upload card
export type DocumentUploadState = {
  documentType: string;
  cloudinaryUrl: string | null;
  cloudinaryPublicId: string | null;
  fileName: string | null;
  status: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
};

// GET /vehicles/{id} (structure of relevant document fields)
type VehicleDetails = {
  id: string;
  documents: VehicleDocument[] | null;
};

// PATCH /vehicles/documents payload
type UpdateDocumentsPayload = {
  documents: VehicleDocument[]; // ✅ FIX: This should be an array
};

// The list of documents required (from your component)
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

// --- Cloudinary Upload Function (Same as Step 3) ---
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function uploadToCloudinary(
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
    const errorData = await response.json();
    throw new Error(errorData.error.message || "Cloudinary upload failed");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

// --- The Hook ---
export function useVehicleDocuments(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  // State is a map of documentType -> DocumentUploadState
  const [docStates, setDocStates] = useState<
    Record<string, DocumentUploadState>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching: Get existing documents ---
  const { data: vehicleDetails, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicleDetails", vehicleId], // Re-uses Step 3's query if fresh
    queryFn: async () => {
      const res = await apiClient.get<VehicleDetails>(`/vehicles/${vehicleId}`);
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  // --- Prefill: Load existing documents into state ---
  useEffect(() => {
    // Initialize state from the static list
    const initialState: Record<string, DocumentUploadState> = {};
    documentList.forEach((doc) => {
      // Find this doc in the *already fetched* vehicle data
      const existingDoc = vehicleDetails?.documents?.find(
        (d) => d.documentType === doc.type
      );

      if (existingDoc) {
        initialState[doc.type] = {
          documentType: doc.type,
          cloudinaryUrl: existingDoc.cloudinaryUrl,
          cloudinaryPublicId: existingDoc.cloudinaryPublicId,
          fileName: "Uploaded Document", // We don't have the original filename
          status: "success",
        };
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
  }, [vehicleDetails]);

  // --- Mutation: Save to our backend ---
  const { mutate: updateVehicleDocuments } = useMutation({
    mutationFn: (payload: UpdateDocumentsPayload) => {
      return apiClient.patch(
        `/vehicles/documents?vehicleId=${vehicleId}`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Documents saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      router.push(`/dashboard/onboarding/photos?id=${vehicleId}`); // Go to next step
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save documents.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // --- Handler for a single card to update its state ---
  const updateDocumentState = (
    docType: string,
    newState: Partial<DocumentUploadState>
  ) => {
    setDocStates((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        ...newState,
      },
    }));
  };

  // --- Submit Handler ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Validation
    const missingDocs: string[] = [];
    documentList.forEach((doc) => {
      if (doc.isCompulsory) {
        const state = docStates[doc.type];
        if (!state || state.status !== "success") {
          missingDocs.push(doc.label);
          // Set error state for the card
          updateDocumentState(doc.type, {
            status: "error",
            errorMessage: "This document is required.",
          });
        }
      }
    });

    if (missingDocs.length > 0) {
      toast.error(`Missing compulsory documents: ${missingDocs.join(", ")}`);
      setIsSubmitting(false);
      return;
    }

    // 2. Format Payload
    const payload: UpdateDocumentsPayload = {
      documents: Object.values(docStates)
        .filter((state) => state.status === "success") // Only send uploaded docs
        .map((state) => ({
          documentType: state.documentType,
          cloudinaryUrl: state.cloudinaryUrl!,
          cloudinaryPublicId: state.cloudinaryPublicId!,
        })),
    };

    // 3. Submit
    updateVehicleDocuments(payload);
  };

  return {
    docStates,
    isLoading: isLoadingVehicle,
    isLoadingSession: sessionStatus === "loading",
    isSubmitting,
    updateDocumentState, // Pass this to the cards
    handleSubmit,
  };
}

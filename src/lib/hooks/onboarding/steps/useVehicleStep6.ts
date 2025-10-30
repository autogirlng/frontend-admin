// lib/hooks/onboarding/steps/useVehicleStep6.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";

// --- Type Definitions ---
// A comprehensive type for the GET /vehicles/{id} response
// based on all data from previous steps.

type VehiclePhoto = {
  cloudinaryUrl: string;
  isPrimary: boolean;
};
type VehicleDocument = {
  documentType: string;
  cloudinaryUrl: string; // We just need to know it exists
};
type VehicleFeature = {
  id: string;
  name: string;
};
type VehiclePrice = {
  bookingTypeId: string; // We won't have the name, just the ID
  price: number;
};
type VehicleDiscount = {
  discountDurationId: string; // We won't have the name, just the ID
  percentage: number;
};

// This is the full object from GET /vehicles/{id}
export type FullVehicleDetails = {
  id: string;
  name: string;
  city: string;
  address: string;
  yearOfRelease: number;
  status: string;

  // Step 1
  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;

  // Step 2
  licensePlateNumber: string | null;
  stateOfRegistration: string | null;
  vehicleColorId: string | null;
  numberOfSeats: number | null;
  description: string | null;
  features: VehicleFeature[] | null;

  // Step 3
  photos: VehiclePhoto[] | null;

  // Step 4
  documents: VehicleDocument[] | null;

  // Step 5
  maxTripDurationUnit: string | null;
  maxTripDurationValue: number | null;
  advanceNoticeUnit: string | null;
  advanceNoticeValue: number | null;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  supportedBookingTypeIds: string[] | null; // API seems to send just IDs
  outOfBoundsAreaIds: string[] | null;
  outskirtFee: number | null;
  extremeFee: number | null;
  pricing: VehiclePrice[] | null;
  discounts: VehicleDiscount[] | null;
  extraHourlyRate: number | null;
};

// --- The Hook ---
export function useVehicleStep6(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  // --- Data Fetching: Get ALL vehicle data ---
  const {
    data: vehicleData,
    isLoading: isLoadingVehicle,
    error: vehicleError,
  } = useQuery({
    queryKey: ["vehicleDetails", vehicleId], // This query key should be consistent
    queryFn: async () => {
      const res = await apiClient.get<FullVehicleDetails>(
        `/vehicles/${vehicleId}`
      );
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  // --- Mutation: Submit for Review ---
  const { mutate: submitForReview, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      // POST request with NO payload
      return apiClient.post(
        `/vehicles/submit-review?id=${vehicleId}`,
        null // Send null as the body
      );
    },
    onSuccess: () => {
      toast.success("Vehicle submitted for review successfully!");

      // Invalidate queries to refetch on the dashboard
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] }); // Invalidate any vehicle list

      // Redirect to the dashboard
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit for review.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to submit this vehicle for review?")
    ) {
      submitForReview();
    }
  };

  return {
    vehicleData,
    isLoading: isLoadingVehicle || sessionStatus === "loading",
    isSubmitting,
    vehicleError,
    handleSubmit,
  };
}

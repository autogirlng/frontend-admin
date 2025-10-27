"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Step1Data } from "@/components/dashboard/onboarding/types/form";

// Payload for the PATCH request (Step 1 fields)
type UpdateVehiclePayload = {
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: number;
  hasInsurance: boolean;
  hasTracker: boolean;
};

// Input type for the hook's 'mutate' function
type MutationInput = Step1Data & {
  latitude: number;
  longitude: number;
  id: string; // The ID of the vehicle to update
};

export function useUpdateVehicleStep1() {
  return useMutation<
    { id: string }, // Expected response
    unknown,
    MutationInput // Input type
  >({
    mutationFn: async (data: MutationInput) => {
      // Map the form data to the API payload
      const payload: UpdateVehiclePayload = {
        name: data.vehicleListingName,
        city: data.locationCityId,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        vehicleTypeId: data.vehicleTypeId,
        vehicleMakeId: data.vehicleMakeId,
        vehicleModelId: data.vehicleModelId,
        yearOfRelease: Number(data.yearOfRelease),
        hasInsurance: data.hasInsurance === "yes",
        hasTracker: data.hasTracker === "yes",
      };

      // Make the PATCH request with the ID as a query param
      const res = (await apiClient.patch(
        `/vehicles?id=${data.id}`,
        payload
      )) as { id: string };

      return res;
    },
  });
}

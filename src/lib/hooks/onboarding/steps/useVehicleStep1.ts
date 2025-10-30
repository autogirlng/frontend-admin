// app/hooks/useVehicleStep1.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // assuming your apiClient file path
import type { Step1Data } from "@/components/dashboard/onboarding/types/form";

// Define the payload structure. Note the new fields.
// This type isn't strictly necessary inside the hook but clarifies the API contract.
type CreateVehiclePayload = {
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
  isVehicleUpgraded: boolean;
  upgradedYear: number;
};

// Define the payload for the new endpoint
type CreateVehicleForHostPayload = CreateVehiclePayload & {
  hostId: string;
};

// Define the input type for the mutation function
type MutationInput = Step1Data & {
  latitude: number;
  longitude: number;
  hostId?: string; // ✅ Optional hostId
};

export function useVehicleStep1() {
  return useMutation<
    { id: string }, // Expected return type
    unknown,
    MutationInput // ✅ Updated input type
  >({
    mutationFn: async (data: MutationInput) => {
      // Base payload with all fields
      const payload: any = {
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
        isVehicleUpgraded: data.isVehicleUpgraded === "yes",
        // Send 0 or null if not upgraded, assuming API expects a number.
        // Adjust default (e.g., to null) if API allows.
        upgradedYear:
          data.isVehicleUpgraded === "yes" ? Number(data.upgradedYear) : 0,
      };

      let endpoint = "/vehicles";

      // ✅ Conditional endpoint and payload logic
      if (data.hostId) {
        endpoint = "/vehicles/onboard-for-host";
        payload.hostId = data.hostId;
      }

      const res = (await apiClient.post(endpoint, payload)) as {
        id: string;
      };

      console.log(`Full API Response from ${endpoint}:`, res);

      return res;
    },
  });
}

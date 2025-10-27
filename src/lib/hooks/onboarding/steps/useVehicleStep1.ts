// app/hooks/useVehicleStep1.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // assuming your apiClient file path
import type { Step1Data } from "@/components/dashboard/onboarding/types/form";
// import { useRouter } from "next/navigation"; // Not used

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
};

export function useVehicleStep1() {
  return useMutation<
    { id: string }, // This is the expected return type
    unknown,
    Step1Data & { latitude: number; longitude: number }
  >({
    mutationFn: async (
      data: Step1Data & { latitude: number; longitude: number }
    ) => {
      const payload: CreateVehiclePayload = {
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

      // ✅ FIX: Use type assertion 'as' to tell TypeScript
      // that the response will match the expected type.
      const res = (await apiClient.post("/vehicles", payload)) as {
        id: string;
      };

      console.log("Full API Response from hook:", res);

      return res;
    },
  });
}

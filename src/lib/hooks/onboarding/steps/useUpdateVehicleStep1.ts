"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Step1Data } from "@/components/dashboard/onboarding/types/form";

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
  isVehicleUpgraded: boolean;
  upgradedYear: number;
};

type MutationInput = Step1Data & {
  latitude: number;
  longitude: number;
  id: string;
};

export function useUpdateVehicleStep1() {
  return useMutation<{ id: string }, unknown, MutationInput>({
    mutationFn: async (data: MutationInput) => {
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
        isVehicleUpgraded: data.isVehicleUpgraded === "yes",
        upgradedYear:
          data.isVehicleUpgraded === "yes" ? Number(data.upgradedYear) : 0,
      };

      const res = (await apiClient.patch(
        `/vehicles?id=${data.id}`,
        payload
      )) as { id: string };

      return res;
    },
  });
}

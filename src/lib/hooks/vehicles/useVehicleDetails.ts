"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type VehicleDetails = {
  id: string;
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

export function useVehicleDetails(id: string | null) {
  return useQuery<VehicleDetails, unknown>({
    queryKey: ["vehicleDetails", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const vehicleData = await apiClient.get<VehicleDetails>(
        `/vehicles/${id}`
      );

      console.log("Parsed Vehicle Details:", vehicleData);
      return vehicleData;
    },
    enabled: !!id,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { VehicleDetail } from "@/components/dashboard/trips-management/types";

export const VEHICLE_DETAILS_KEY = "vehicleDetails";

export function useGetVehicleDetails(vehicleId: string | null | undefined) {
  return useQuery<VehicleDetail>({
    queryKey: [VEHICLE_DETAILS_KEY, "trip-context", vehicleId],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("No Vehicle ID provided");
      }
      return apiClient.get<VehicleDetail>(`/vehicles/${vehicleId}`);
    },
    enabled: !!vehicleId,
  });
}

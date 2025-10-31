// lib/hooks/vehicles/useVehicleDetailsPage.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  VehicleDetail,
  VehicleBookingSegment,
  PaginatedResponse,
} from "@/components/dashboard/vehicle-onboarding/details/types";

// Query Keys
export const VEHICLE_DETAIL_KEY = "vehicleDetail";
export const VEHICLE_BOOKINGS_KEY = "vehicleBookings";

/**
 * Fetches the details for a single vehicle.
 * @param vehicleId The ID of the vehicle to fetch.
 */
export function useGetVehicleDetails(vehicleId: string | null) {
  return useQuery<VehicleDetail>({
    queryKey: [VEHICLE_DETAIL_KEY, vehicleId],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }
      return apiClient.get<VehicleDetail>(`/vehicles/${vehicleId}`);
    },
    enabled: !!vehicleId,
  });
}

/**
 * Fetches the booking history for a single vehicle.
 * @param vehicleId The ID of the vehicle.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 */
export function useGetVehicleBookings(
  vehicleId: string | null,
  page: number,
  size: number
) {
  return useQuery<PaginatedResponse<VehicleBookingSegment>>({
    queryKey: [VEHICLE_BOOKINGS_KEY, vehicleId, page, size],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));
      // Add other filters as needed later

      const endpoint = `/bookings/${vehicleId}/bookings?${params.toString()}`;
      return apiClient.get<PaginatedResponse<VehicleBookingSegment>>(endpoint);
    },
    enabled: !!vehicleId,
  });
}

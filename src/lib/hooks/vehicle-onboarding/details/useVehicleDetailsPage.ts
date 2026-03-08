"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import {
  VehicleDetail,
  VehicleBookingSegment,
  PaginatedResponse,
} from "@/components/dashboard/vehicle-onboarding/details/types";

export const VEHICLE_DETAIL_KEY = "vehicleDetail";
export const VEHICLE_BOOKINGS_KEY = "vehicleBookings";

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

export function useGetVehicleBookings(
  vehicleId: string | null,
  page: number,
  size: number,
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

      const endpoint = `/bookings/${vehicleId}/bookings?${params.toString()}`;
      return apiClient.get<PaginatedResponse<VehicleBookingSegment>>(endpoint);
    },
    enabled: !!vehicleId,
  });
}

export interface VehicleBookingsFilters {
  page: number;
  bookingStatus: string | null;
  bookingTypeId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export function useGetVehicleBookingsPaginated(
  vehicleId: string | null,
  filters: VehicleBookingsFilters,
) {
  const { page, bookingStatus, bookingTypeId, startDate, endDate } = filters;

  return useQuery<PaginatedResponse<VehicleBookingSegment>>({
    queryKey: [
      VEHICLE_BOOKINGS_KEY,
      vehicleId,
      "paginated",
      page,
      bookingStatus,
      bookingTypeId,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      if (!vehicleId) throw new Error("Vehicle ID is required");

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      if (bookingStatus) params.append("bookingStatus", bookingStatus);
      if (bookingTypeId) params.append("bookingTypeId", bookingTypeId);
      if (startDate)
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));

      const endpoint = `/bookings/${vehicleId}/bookings?${params.toString()}`;
      return apiClient.get<PaginatedResponse<VehicleBookingSegment>>(endpoint);
    },
    enabled: !!vehicleId,
    placeholderData: (previousData) => previousData,
  });
}

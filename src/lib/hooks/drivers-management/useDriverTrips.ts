// lib/hooks/trips/useDriverTrips.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import {
  Trip,
  PaginatedResponse,
} from "@/components/dashboard/drivers-management/trip-types";

export const DRIVER_TRIPS_QUERY_KEY = "driverTrips";

// Define the filter parameters
export interface DriverTripFilters {
  driverId: string;
  page: number;
  bookingStatus: string | null;
  tripStatus: string | null;
  bookingTypeID: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export function useGetDriverTrips(filters: DriverTripFilters) {
  const {
    driverId,
    page,
    bookingStatus,
    tripStatus,
    bookingTypeID,
    startDate,
    endDate,
  } = filters;

  return useQuery<PaginatedResponse<Trip>>({
    queryKey: [
      DRIVER_TRIPS_QUERY_KEY,
      driverId,
      page,
      bookingStatus,
      tripStatus,
      bookingTypeID,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      if (!driverId) throw new Error("Driver ID is required");

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      // Add optional filters
      if (bookingStatus) params.append("bookingStatus", bookingStatus);
      if (tripStatus) params.append("tripStatus", tripStatus);
      if (bookingTypeID) params.append("bookingTypeID", bookingTypeID);
      if (startDate)
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));

      const endpoint = `/admin/trips/driver/${driverId}?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Trip>>(endpoint);
    },
    // Only run the query if driverId is present
    enabled: !!driverId,
    placeholderData: (previousData) => previousData,
  });
}

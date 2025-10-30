// lib/hooks/useVehicleAvailability.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient"; // Use your existing apiClient
import type { AvailabilityResponse } from "@/components/dashboard/availability/availability";

type UseVehicleAvailabilityProps = {
  searchTerm: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
};

/**
 * Fetches vehicle availability data.
 */
export function useVehicleAvailability({
  searchTerm,
  startDate,
  endDate,
  page,
}: UseVehicleAvailabilityProps) {
  return useQuery<AvailabilityResponse, Error>({
    queryKey: ["vehicleAvailability", searchTerm, startDate, endDate, page],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required.");
      }

      // Format dates to "YYYY-MM-DD" for the API
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const params = new URLSearchParams({
        searchTerm,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        page: String(page),
        size: "10", // Or make this dynamic
      });

      const endpoint = `/availability?${params.toString()}`;
      return apiClient.get<AvailabilityResponse>(endpoint);
    },
    // Only run the query if start and end dates are provided
    enabled: !!startDate && !!endDate,
  });
}

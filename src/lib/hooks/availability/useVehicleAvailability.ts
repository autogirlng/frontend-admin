"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import type { PaginatedAvailabilityData } from "@/components/dashboard/availability/availability";

type UseVehicleAvailabilityProps = {
  searchTerm: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
};

export function useVehicleAvailability({
  searchTerm,
  startDate,
  endDate,
  page,
}: UseVehicleAvailabilityProps) {
  return useQuery<PaginatedAvailabilityData, Error>({
    queryKey: ["vehicleAvailability", searchTerm, startDate, endDate, page],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required.");
      }

      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const params = new URLSearchParams({
        searchTerm,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        page: String(page),
        size: "10",
      });

      const endpoint = `/availability?${params.toString()}`;

      const response = await apiClient.get<any>(endpoint);

      if (response?.data?.content) {
        return response.data;
      }

      if (response?.content) {
        return response;
      }

      if (response?.data === null) {
        return {
          content: [],
          currentPage: 0,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        };
      }

      console.error("Unexpected API Response Structure:", response);
      throw new Error(
        "Vehicle availability data is undefined or invalid structure"
      );
    },
    enabled: !!startDate && !!endDate,
    retry: 1,
    staleTime: 5000,
  });
}

// lib/hooks/vehicles/useVehicleSearch.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import {
  VehicleSearchResult,
  PaginatedResponse,
} from "@/components/dashboard/drivers-management/types";

export const APPROVED_VEHICLES_KEY = "approvedVehiclesSearch";

/**
 * Searches for vehicles with APPROVED status.
 * @param searchTerm The search term
 * @param page The page number
 */
export function useSearchApprovedVehicles(
  searchTerm: string,
  page: number = 0
) {
  return useQuery<PaginatedResponse<VehicleSearchResult>, Error>({
    queryKey: [APPROVED_VEHICLES_KEY, searchTerm, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("status", "APPROVED");
      params.append("page", String(page));
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      return apiClient.get<PaginatedResponse<VehicleSearchResult>>(
        `/vehicles?${params.toString()}`
      );
    },
    // Only run if user types 3+ chars, or if search term is empty (to show initial list)
    enabled: searchTerm.length === 0 || searchTerm.length > 2,
  });
}

// lib/hooks/vehicles/useFeaturedVehicles.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import {
  FeaturedVehicle,
  VehicleSearchResult,
  PaginatedResponse,
} from "@/components/dashboard/top-rated-vehicle/types";

// --- Query Keys ---
export const FEATURED_VEHICLES_KEY = "featuredVehicles";
export const APPROVED_VEHICLES_KEY = "approvedVehicles";

// --- 1. Get All Featured Vehicles ---
export function useGetFeaturedVehicles() {
  return useQuery<PaginatedResponse<FeaturedVehicle>, Error>({
    queryKey: [FEATURED_VEHICLES_KEY],
    queryFn: () =>
      apiClient.get<PaginatedResponse<FeaturedVehicle>>(
        "/public/featured-vehicles"
      ),
  });
}

// --- 2. Search Approved Vehicles (for Add modal) ---
export function useSearchApprovedVehicles(searchTerm: string) {
  return useQuery<PaginatedResponse<VehicleSearchResult>, Error>({
    queryKey: [APPROVED_VEHICLES_KEY, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("status", "APPROVED");
      params.append("page", "0");
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      return apiClient.get<PaginatedResponse<VehicleSearchResult>>(
        `/vehicles?${params.toString()}`
      );
    },
    enabled: searchTerm.length > 2, // Only run if user types 3+ chars
  });
}

// --- 3. Add a Featured Vehicle ---
export function useAddFeaturedVehicle() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (vehicleId: string) =>
      apiClient.post(`/admin/featured-vehicles/${vehicleId}`, {}),
    onSuccess: () => {
      toast.success("Vehicle added to featured list.");
      // Refetch the main list
      queryClient.invalidateQueries({ queryKey: [FEATURED_VEHICLES_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add vehicle.");
    },
  });
}

// --- 4. Remove a Featured Vehicle ---
export function useRemoveFeaturedVehicle() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (vehicleId: string) =>
      apiClient.delete(`/admin/featured-vehicles/${vehicleId}`),
    onSuccess: () => {
      toast.success("Vehicle removed from featured list.");
      // Refetch the main list
      queryClient.invalidateQueries({ queryKey: [FEATURED_VEHICLES_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove vehicle.");
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";
import {
  DriverApplication,
  PaginatedResponse,
  DriverApplicationFilters,
} from "./types";

export const DRIVER_APPLICATIONS_KEY = "driverApplications";
export const DRIVER_APPLICATION_DETAIL_KEY = "driverApplicationDetail";

export function useGetDriverApplications(
  page: number,
  size: number,
  filters: DriverApplicationFilters,
) {
  return useQuery<PaginatedResponse<DriverApplication>>({
    queryKey: [DRIVER_APPLICATIONS_KEY, page, size, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));

      if (filters.searchTerm) {
        params.append("searchTerm", filters.searchTerm);
      }
      if (filters.yearsOfExperience) {
        params.append("yearsOfExperience", String(filters.yearsOfExperience));
      }

      const endpoint = `/admin/driver-applications?${params.toString()}`;
      return apiClient.get<PaginatedResponse<DriverApplication>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetDriverApplicationDetails(id: string | null) {
  return useQuery<DriverApplication>({
    queryKey: [DRIVER_APPLICATION_DETAIL_KEY, id],
    queryFn: () =>
      apiClient.get<DriverApplication>(`/admin/driver-applications/${id}`),
    enabled: !!id,
  });
}

export function useUpdateDriverApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    DriverApplication,
    Error,
    { applicationId: string; status: string }
  >({
    mutationFn: ({ applicationId, status }) =>
      apiClient.patch(`/admin/driver-applications/${applicationId}/status`, {
        status,
      }),
    onSuccess: (updatedData) => {
      toast.success(`Application status updated to ${updatedData.status}`);
      queryClient.invalidateQueries({ queryKey: [DRIVER_APPLICATIONS_KEY] });
      queryClient.setQueryData(
        [DRIVER_APPLICATION_DETAIL_KEY, updatedData.id],
        updatedData,
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status.");
    },
  });
}

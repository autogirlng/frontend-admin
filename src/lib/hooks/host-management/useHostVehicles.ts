// lib/hooks/host-management/useHostVehicles.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  HostVehicle,
  PaginatedResponse,
} from "@/components/dashboard/host-management/types";

export const HOST_VEHICLES_KEY = "hostVehicles";

interface HostVehicleFilters {
  hostId: string;
  page: number;
  searchTerm: string;
  status: string | null;
}

export function useGetHostVehicles({
  hostId,
  page,
  searchTerm,
  status,
}: HostVehicleFilters) {
  return useQuery<PaginatedResponse<HostVehicle>>({
    queryKey: [HOST_VEHICLES_KEY, hostId, page, searchTerm, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      if (searchTerm) params.append("searchTerm", searchTerm);
      if (status) params.append("status", status);

      const endpoint = `/vehicles/host/${hostId}?${params.toString()}`;
      return apiClient.get<PaginatedResponse<HostVehicle>>(endpoint);
    },
    enabled: !!hostId,
    placeholderData: (previousData) => previousData,
  });
}

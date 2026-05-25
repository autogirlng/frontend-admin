import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  Host,
  PaginatedResponse,
  HostDetail,
} from "@/components/dashboard/host-management/types";
import type { Country, GeoState } from "@/components/outskirt/geo";

const HOSTS_QUERY_KEY = "hosts";
export const HOST_DETAIL_KEY = "hostDetail";

export interface HostLocationFilters {
  latitude?: number;
  longitude?: number;
}

export interface HostFilters extends HostLocationFilters {
  page: number;
  size?: number;
  searchTerm?: string;
}

const isValidCoordinate = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function useGetHosts(filters: HostFilters) {
  const { page, size = 10, searchTerm, latitude, longitude } = filters;

  return useQuery<PaginatedResponse<Host>>({
    queryKey: [HOSTS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (isValidCoordinate(latitude) && isValidCoordinate(longitude)) {
        params.append("latitude", String(latitude));
        params.append("longitude", String(longitude));
      }

      const endpoint = `/admin/users/hosts?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Host>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetHostDetails(hostId: string | null) {
  return useQuery<HostDetail, Error>({
    queryKey: [HOST_DETAIL_KEY, hostId],
    queryFn: () => apiClient.get<HostDetail>(`/admin/users/hosts/${hostId}`),
    enabled: !!hostId, // Only run if hostId is not null
  });
}

export function useGetCountries() {
  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: () => apiClient.get<Country[]>("/countries"),
  });
}

export function useGetStatesByCountry(countryId: string | null) {
  return useQuery<GeoState[]>({
    queryKey: ["states", countryId],
    queryFn: () => apiClient.get<GeoState[]>(`/states/country/${countryId}`),
    enabled: !!countryId,
  });
}

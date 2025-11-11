import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  Host,
  PaginatedResponse,
  HostDetail,
} from "@/components/dashboard/host-management/types";

const HOSTS_QUERY_KEY = "hosts";
export const HOST_DETAIL_KEY = "hostDetail";

export function useGetHosts(page: number, searchTerm: string) {
  return useQuery<PaginatedResponse<Host>>({
    queryKey: [HOSTS_QUERY_KEY, page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
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

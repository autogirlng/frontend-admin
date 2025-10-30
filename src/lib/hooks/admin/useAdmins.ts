// lib/hooks/admin/useAdmins.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  AdminUser,
  PaginatedResponse,
} from "@/components/dashboard/trips-management/types";

export const ADMINS_QUERY_KEY = "admins";

export function useGetAdmins(searchTerm: string) {
  return useQuery<PaginatedResponse<AdminUser>>({
    queryKey: [ADMINS_QUERY_KEY, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "50");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      const endpoint = `/admin/users/admins?${params.toString()}`;
      return apiClient.get<PaginatedResponse<AdminUser>>(endpoint);
    },
  });
}

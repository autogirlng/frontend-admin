// lib/hooks/admin/useAdmins.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  AdminUser,
  PaginatedResponse,
} from "@/components/dashboard/trips-management/types";

export const ADMINS_QUERY_KEY = "admins";

export function useGetAdmins(
  page: number,
  searchTerm: string,
  size: number = 10 // <-- Made optional with a default value
) {
  return useQuery<PaginatedResponse<AdminUser>>({
    queryKey: [ADMINS_QUERY_KEY, page, searchTerm, size], // <-- Added size to queryKey
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size)); // <-- Use the size parameter
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      const endpoint = `/admin/users/admins?${params.toString()}`;
      return apiClient.get<PaginatedResponse<AdminUser>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

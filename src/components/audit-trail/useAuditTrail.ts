// lib/hooks/audit/useAuditTrail.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import { AuditLog, PaginatedResponse } from "./types"; // Adjust path

export const AUDIT_TRAIL_KEY = "auditTrail";

// The raw API response structure for pagination
interface ApiPaginatedAuditResponse {
  content: AuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function useGetAuditTrail(page: number, searchTerm: string) {
  return useQuery<PaginatedResponse<AuditLog>, Error>({
    queryKey: [AUDIT_TRAIL_KEY, page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "15"); // More logs per page
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }

      const endpoint = `/audit-trail?${params.toString()}`;
      const response = await apiClient.get<ApiPaginatedAuditResponse>(endpoint);

      // Adapt the API response
      return {
        content: response.content,
        currentPage: response.page,
        pageSize: response.size,
        totalItems: response.totalElements,
        totalPages: response.totalPages,
      };
    },
    placeholderData: (previousData) => previousData,
  });
}

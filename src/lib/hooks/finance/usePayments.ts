// lib/hooks/finance/usePayments.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import {
  Payment,
  PaginatedResponse,
} from "@/components/dashboard/finance/types";

// Query Key
export const PAYMENTS_QUERY_KEY = "payments";

// 1. Get Paginated Payments
export interface PaymentFilters {
  page: number;
  paymentStatus: string | null;
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
}

export function useGetPayments(filters: PaymentFilters) {
  const { page, paymentStatus, startDate, endDate, searchTerm } = filters;

  return useQuery<PaginatedResponse<Payment>>({
    queryKey: [
      PAYMENTS_QUERY_KEY,
      page,
      paymentStatus,
      startDate,
      endDate,
      searchTerm,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (startDate)
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));
      if (searchTerm) params.append("searchTerm", searchTerm);

      const endpoint = `/admin/payments?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Payment>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// 2. Get Single Payment Details
export function useGetPaymentDetails(paymentId: string | null) {
  return useQuery<Payment>({
    queryKey: [PAYMENTS_QUERY_KEY, "detail", paymentId],
    queryFn: () => apiClient.get<Payment>(`/payments/${paymentId}`),
    enabled: !!paymentId, // Only run if paymentId is not null
  });
}

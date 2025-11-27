// lib/hooks/finance/usePayments.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
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

export function useDownloadInvoice() {
  return useMutation<
    void,
    Error,
    { bookingId: string; invoiceNumber?: string }
  >({
    mutationFn: async ({ bookingId, invoiceNumber }) => {
      const defaultFilename = invoiceNumber
        ? `Invoice-${invoiceNumber}.pdf`
        : `Invoice-${bookingId}.pdf`;

      await apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {},
        defaultFilename
      );
    },
    onSuccess: () => {
      toast.success("Invoice download started.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to download invoice.");
    },
  });
}

// ✅ --- 4. NEW: Download Receipt ---
export function useDownloadPaymentReceipt() {
  return useMutation<
    void,
    Error,
    { bookingId: string; invoiceNumber?: string }
  >({
    mutationFn: async ({ bookingId, invoiceNumber }) => {
      const defaultFilename = invoiceNumber
        ? `Receipt-${invoiceNumber}.pdf`
        : `Receipt-${bookingId}.pdf`;

      await apiClient.getAndDownloadFile(
        `/admin/invoices/${bookingId}/download-receipt`,
        defaultFilename
      );
    },
    onSuccess: () => {
      toast.success("Receipt download started.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to download receipt.");
    },
  });
}


// 7. Preview Invoice → uses POST (same as download)
export function usePreviewInvoiceBlob() {
  return useMutation<Blob, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      return await apiClient.postFileAsBlob(
        `/admin/invoices/generate-pdf/${bookingId}?preview=true`
      );
    },
  });
}

// 8. Preview Receipt → uses GET (same as download)
export function usePreviewReceiptBlob() {
  return useMutation<Blob, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      return await apiClient.getFileAsBlob(
        `/admin/invoices/${bookingId}/download-receipt?preview=true`
      );
    },
  });
}

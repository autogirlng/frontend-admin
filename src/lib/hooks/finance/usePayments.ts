"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  Payment,
  PaginatedResponse,
} from "@/components/dashboard/finance/types";
import { OfflinePaymentApprovalResponse } from "@/components/dashboard/finance/types";

export const PAYMENTS_QUERY_KEY = "payments";

export interface PaymentFilters {
  page: number;
  size: number;
  paymentStatus: string | null;
  paymentProvider: string | null;
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
}

export function useGetPayments(filters: PaymentFilters) {
  const {
    page,
    size,
    paymentStatus,
    paymentProvider,
    startDate,
    endDate,
    searchTerm,
  } = filters;

  return useQuery<PaginatedResponse<Payment>>({
    queryKey: [
      PAYMENTS_QUERY_KEY,
      page,
      size,
      paymentStatus,
      paymentProvider,
      startDate,
      endDate,
      searchTerm,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));

      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (paymentProvider) params.append("paymentProvider", paymentProvider);
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

export function useGetPaymentDetails(paymentId: string | null) {
  return useQuery<Payment>({
    queryKey: [PAYMENTS_QUERY_KEY, "detail", paymentId],
    queryFn: () => apiClient.get<Payment>(`/payments/${paymentId}`),
    enabled: !!paymentId,
  });
}

export function useDownloadInvoice() {
  return useMutation<
    void,
    Error,
    { bookingId: string; invoiceNumber?: string; userName?: string }
  >({
    mutationFn: async ({ bookingId, invoiceNumber, userName }) => {
      const safeName = userName
        ? userName
            .trim()
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 30) + "_"
        : "";

      const defaultFilename = `Invoice_${safeName}_${invoiceNumber}.pdf`;

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

export function useDownloadPaymentReceipt() {
  return useMutation<
    void,
    Error,
    { bookingId: string; invoiceNumber?: string; userName?: string }
  >({
    mutationFn: async ({ bookingId, invoiceNumber, userName }) => {
      const safeName = userName
        ? userName
            .trim()
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 30) + "_"
        : "";

      const defaultFilename = `Receipt_${safeName}_${invoiceNumber}.pdf`;

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

export function usePreviewInvoiceBlob() {
  return useMutation<Blob, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      return await apiClient.postFileAsBlob(
        `/admin/invoices/generate-pdf/${bookingId}?preview=true`
      );
    },
  });
}

export function usePreviewReceiptBlob() {
  return useMutation<Blob, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      return await apiClient.getFileAsBlob(
        `/admin/invoices/${bookingId}/download-receipt?preview=true`
      );
    },
  });
}

export function useApproveOfflinePayment() {
  const queryClient = useQueryClient();

  return useMutation<
    OfflinePaymentApprovalResponse,
    Error,
    { bookingId: string }
  >({
    mutationFn: async ({ bookingId }) => {
      return await apiClient.post(
        `/admin/bookings/${bookingId}/confirm-offline-payment`,
        {}
      );
    },

    onSuccess: (data, variables) => {
      toast.success(
        `Payment approved successfully! Invoice: ${data.invoiceNumber}`
      );
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
    },

    onError: (error) => {
      toast.error(
        error.message || "Failed to approve payment. Please try again."
      );
    },
  });
}

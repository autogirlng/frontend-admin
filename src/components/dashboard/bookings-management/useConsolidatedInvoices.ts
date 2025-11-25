// lib/hooks/finance/useConsolidatedInvoices.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  ConsolidatedInvoice,
  PaginatedResponse,
  CreateConsolidatedPayload,
} from "./consolidated-types";

export const CONSOLIDATED_INVOICES_KEY = "consolidatedInvoices";

// 1. GET All Consolidated Invoices
export function useGetConsolidatedInvoices(page: number) {
  return useQuery<PaginatedResponse<ConsolidatedInvoice>>({
    queryKey: [CONSOLIDATED_INVOICES_KEY, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      const endpoint = `/admin/invoices/consolidated?${params.toString()}`;
      return apiClient.get<PaginatedResponse<ConsolidatedInvoice>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// 2. POST Create Consolidated Invoice
export function useCreateConsolidatedInvoice() {
  const queryClient = useQueryClient();
  return useMutation<ConsolidatedInvoice, Error, CreateConsolidatedPayload>({
    mutationFn: (payload) =>
      apiClient.post("/admin/invoices/consolidated", payload),
    onSuccess: () => {
      toast.success("Consolidated invoice created successfully.");
      queryClient.invalidateQueries({ queryKey: [CONSOLIDATED_INVOICES_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create invoice."),
  });
}

// 3. POST Confirm Invoice
export function useConfirmConsolidatedInvoice() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id: string) =>
      apiClient.post(`/admin/invoices/consolidated/${id}/confirm`, {}),
    onSuccess: () => {
      toast.success("Invoice confirmed and receipt sent.");
      queryClient.invalidateQueries({ queryKey: [CONSOLIDATED_INVOICES_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to confirm invoice."),
  });
}

// 4. GET Download PDF
export function useDownloadConsolidatedPdf() {
  return useMutation<void, Error, { id: string; invoiceNumber: string }>({
    mutationFn: async ({ id, invoiceNumber }) => {
      await apiClient.getAndDownloadFile(
        `/admin/invoices/consolidated/${id}/pdf`,
        `${invoiceNumber}.pdf`
      );
    },
    onSuccess: () => toast.success("PDF download started."),
    onError: (error) => toast.error("Failed to download PDF."),
  });
}

// 5. GET Download Receipt
export function useDownloadConsolidatedReceipt() {
  return useMutation<void, Error, { id: string; invoiceNumber: string }>({
    mutationFn: async ({ id, invoiceNumber }) => {
      await apiClient.getAndDownloadFile(
        `/admin/invoices/consolidated/${id}/receipt`,
        `Receipt-${invoiceNumber}.pdf`
      );
    },
    onSuccess: () => toast.success("Receipt download started."),
    onError: (error) => toast.error("Failed to download receipt."),
  });
}

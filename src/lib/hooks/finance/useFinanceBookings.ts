// lib/hooks/finance/useFinanceBookings.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  Booking,
  PaginatedResponse,
  BulkConfirmPayload,
  BulkConfirmResponse,
  UpdateBookingPayload,
  CalculationResponse,
} from "@/components/dashboard/finance/bookings/types";
import { BookingForCalculation } from "@/components/dashboard/finance/booking-calculation-type";

// Query Key
export const BOOKINGS_QUERY_KEY = "financeBookings";

// 1. Get Bookings
export interface BookingFilters {
  page: number;
  bookingStatus: string | null;
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
  paymentMethod: string | null; // ✅ ADDED
}

export function useGetFinanceBookings(filters: BookingFilters) {
  const {
    page,
    bookingStatus,
    startDate,
    endDate,
    searchTerm,
    paymentMethod, // ✅ ADDED
  } = filters;

  return useQuery<PaginatedResponse<Booking>>({
    queryKey: [
      BOOKINGS_QUERY_KEY,
      page,
      bookingStatus,
      startDate,
      endDate,
      searchTerm,
      paymentMethod, // ✅ ADDED
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      if (bookingStatus) params.append("bookingStatus", bookingStatus);
      if (startDate)
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (paymentMethod) params.append("paymentMethod", paymentMethod); // ✅ ADDED

      const endpoint = `/bookings?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Booking>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// 2. Confirm Offline Payment (Unchanged)
export function useConfirmOfflinePayment() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (bookingId: string) =>
      apiClient.post(
        `/admin/bookings/${bookingId}/confirm-offline-payment`,
        {}
      ),
    onSuccess: () => {
      toast.success("Offline payment confirmed. Booking is now active.");
      queryClient.invalidateQueries({
        queryKey: [BOOKINGS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm payment.");
    },
  });
}

export function useBulkConfirmOfflinePayment() {
  const queryClient = useQueryClient();

  return useMutation<BulkConfirmResponse, Error, BulkConfirmPayload>({
    mutationFn: (payload) =>
      apiClient.post(`/admin/bookings/confirm-offline-payment/bulk`, payload),
    onSuccess: (data) => {
      // Show a detailed toast based on the response
      if (data.failedConfirmations > 0) {
        toast.error(
          `Bulk action complete: ${data.successfulConfirmations} succeeded, ${data.failedConfirmations} failed.`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `Successfully confirmed ${data.successfulConfirmations} payments.`
        );
      }

      // Invalidate the bookings list to refetch
      queryClient.invalidateQueries({
        queryKey: [BOOKINGS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Bulk confirmation failed.");
    },
  });
}

export function useDownloadInvoice() {
  return useMutation<
    void,
    Error,
    { bookingId: string; invoiceNumber?: string }
  >({
    mutationFn: async ({ bookingId, invoiceNumber }) => {
      // Create a user-friendly filename
      const defaultFilename = invoiceNumber
        ? `Invoice-${invoiceNumber}.pdf`
        : `Invoice-${bookingId}.pdf`;

      // Use the postAndDownloadFile method from your apiClient
      await apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {}, // Empty body for the POST
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

// Ensure your fetcher extracts the inner .data correctly
export function useGetBooking(bookingId: string | null) {
  return useQuery({
    queryKey: ["booking-details", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await apiClient.get<BookingForCalculation>(
        `/bookings/${bookingId}`
      );
    },
    enabled: !!bookingId,
  });
}

// 2. Get Calculation Details (to pre-fill the form)
export function useGetCalculation(calculationId: string | null) {
  return useQuery({
    queryKey: ["calculation-details", calculationId],
    queryFn: async () => {
      if (!calculationId) return null;
      // ✅ NEW: Return the result directly
      return await apiClient.get<CalculationResponse>(
        `/public/bookings/calculate/${calculationId}`
      );
    },
    enabled: !!calculationId,
  });
}

// 3. Update Booking Mutation
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { bookingId: string; payload: UpdateBookingPayload }
  >({
    mutationFn: async ({ bookingId, payload }) => {
      return await apiClient.patch(`/admin/bookings/${bookingId}`, payload);
    },
    onSuccess: () => {
      toast.success("Booking updated successfully.");
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update booking.");
    },
  });
}

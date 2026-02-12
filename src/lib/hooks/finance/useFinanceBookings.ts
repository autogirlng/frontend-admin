"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  Booking,
  PaginatedResponse,
  BulkConfirmResponse,
  UpdateBookingPayload,
  CalculationResponse,
  Vehicle,
  UpdateBookingResponse,
} from "@/components/dashboard/finance/bookings/types";
import { BookingForCalculation } from "@/components/dashboard/finance/booking-calculation-type";

export const BOOKINGS_QUERY_KEY = "financeBookings";

export interface OfflinePaymentPayload {
  paymentImageUrl: string;
  publicId: string;
  amountPaid?: number;
}

export interface BulkOfflinePaymentPayload {
  paymentConfirmations: {
    bookingId: string;
    paymentImageUrl: string;
    publicId: string;
  }[];
}

export interface BookingFilters {
  page: number;
  bookingStatus: string | null;
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
  paymentMethod: string | null;
}

export interface BookingConflict {
  bookingId: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  category: string;
  status: string;
  earliestStart: string;
  latestEnd: string;
  bookedAt: string;
}

export function useGetFinanceBookings(filters: BookingFilters) {
  const { page, bookingStatus, startDate, endDate, searchTerm, paymentMethod } =
    filters;

  return useQuery<PaginatedResponse<Booking>>({
    queryKey: [
      BOOKINGS_QUERY_KEY,
      page,
      bookingStatus,
      startDate,
      endDate,
      searchTerm,
      paymentMethod,
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
      if (paymentMethod) params.append("paymentMethod", paymentMethod);

      const endpoint = `/bookings?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Booking>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useConfirmOfflinePayment() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { bookingId: string; payload: OfflinePaymentPayload }
  >({
    mutationFn: ({ bookingId, payload }) =>
      apiClient.post(
        `/admin/bookings/${bookingId}/confirm-offline-payment`,
        payload,
      ),
    onSuccess: () => {
      toast.success("Payment recorded successfully.");
      queryClient.invalidateQueries({
        queryKey: [BOOKINGS_QUERY_KEY],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["payments"],
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

  return useMutation<BulkConfirmResponse, Error, BulkOfflinePaymentPayload>({
    mutationFn: (payload) =>
      apiClient.post(`/admin/bookings/confirm-offline-payment/bulk`, payload),
    onSuccess: (data) => {
      if (data.failedConfirmations > 0) {
        toast.error(
          `Bulk action complete: ${data.successfulConfirmations} succeeded, ${data.failedConfirmations} failed.`,
          { duration: 5000 },
        );
      } else {
        toast.success(
          `Successfully confirmed ${data.successfulConfirmations} payments.`,
        );
      }
      queryClient.invalidateQueries({
        queryKey: [BOOKINGS_QUERY_KEY],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["payments"],
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
      const defaultFilename = invoiceNumber
        ? `Invoice-${invoiceNumber}.pdf`
        : `Invoice-${bookingId}.pdf`;
      await apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {},
        defaultFilename,
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

export function useGetBooking(bookingId: string | null) {
  return useQuery({
    queryKey: ["booking-details", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await apiClient.get<BookingForCalculation>(
        `/bookings/${bookingId}`,
      );
    },
    enabled: !!bookingId,
  });
}

export function useGetCalculation(calculationId: string | null) {
  return useQuery({
    queryKey: ["calculation-details", calculationId],
    queryFn: async () => {
      if (!calculationId) return null;
      return await apiClient.get<CalculationResponse>(
        `/public/bookings/calculate/${calculationId}`,
      );
    },
    enabled: !!calculationId,
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBookingResponse,
    Error,
    { bookingId: string; payload: UpdateBookingPayload }
  >({
    mutationFn: async ({ bookingId, payload }) => {
      return await apiClient.patch(`/admin/bookings/${bookingId}`, payload);
    },
    onSuccess: () => {
      toast.success("Booking updated successfully.");
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update booking.");
    },
  });
}

export function useGetVehicleDetails(vehicleId: string | null) {
  return useQuery({
    queryKey: ["vehicle-details", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;
      return await apiClient.get<Vehicle>(`/public/vehicles/${vehicleId}`);
    },
    enabled: !!vehicleId,
  });
}

export function useCheckBookingConflicts(bookingId: string | null) {
  return useQuery<BookingConflict[]>({
    queryKey: ["bookingConflicts", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("Booking ID required");
      return apiClient.get<BookingConflict[]>(
        `/admin/bookings/${bookingId}/conflicts`,
      );
    },
    enabled: !!bookingId,
    retry: false,
  });
}

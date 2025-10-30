// lib/hooks/finance/useFinanceBookings.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import {
  Booking,
  PaginatedResponse,
} from "@/components/dashboard/finance/bookings/types";

// Query Key
export const BOOKINGS_QUERY_KEY = "financeBookings";

export interface BookingFilters {
  page: number;
  bookingStatus: string | null;
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
}

export function useGetFinanceBookings(filters: BookingFilters) {
  const { page, bookingStatus, startDate, endDate, searchTerm } = filters;

  return useQuery<PaginatedResponse<Booking>>({
    queryKey: [
      BOOKINGS_QUERY_KEY,
      page,
      bookingStatus,
      startDate,
      endDate,
      searchTerm,
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

      const endpoint = `/bookings?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Booking>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// 2. Confirm Offline Payment
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
      // Invalidate the bookings list to refetch
      queryClient.invalidateQueries({
        queryKey: [BOOKINGS_QUERY_KEY],
        exact: false,
      });
    },
    // ✅ UPDATED onError block:
    onError: (error: Error) => {
      // This now directly uses the 'message' from the error object,
      // which should contain the string from the error response's "data" field.
      toast.error(error.message || "Failed to confirm payment.");
    },
  });
}

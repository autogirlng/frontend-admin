"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { BookingDetail } from "@/components/dashboard/bookings-management/details-types";

export const BOOKING_DETAIL_KEY = "bookingDetail";

export function useGetBookingDetails(bookingId: string | null) {
  return useQuery<BookingDetail>({
    queryKey: [BOOKING_DETAIL_KEY, bookingId],
    queryFn: async () => {
      if (!bookingId) {
        throw new Error("Booking ID is required");
      }
      return apiClient.get<BookingDetail>(`/public/bookings/${bookingId}`);
    },
    enabled: !!bookingId,
  });
}

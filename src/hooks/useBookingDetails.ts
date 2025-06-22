"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { BookingInformation } from "@/utils/types";

export default function useBookingDetails(bookingId: string) {
  const http = useHttp();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["bookingDetails", bookingId],
    queryFn: () => http.get<BookingInformation>(`/bookings/getSingle/${bookingId}`),
    enabled: !!bookingId,
    retry: false,
  });

  return {
    bookingDetails: data,
    isError,
    error,
    isLoading,
  };
} 
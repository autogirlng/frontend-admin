"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { PaginatedResponse } from "@/components/dashboard/finance/types";

export type UnallocatedBookingSegment = {
  startDate: string;
  startTime: string;
  bookingTypeId: string;
  pickupLatitude: number;
  dropoffLatitude: number;
  pickupLongitude: number;
  dropoffLongitude: number;
  pickupLocationString: string;
  dropoffLocationString: string;
  pickupLocation?: string;
  dropoffLocation?: string;
};

export type UnallocatedBooking = {
  bookingId: string;
  invoiceNumber: string;
  calculationId: string;
  status: string;
  totalPrice: number;
  bookedAt: string;
  primaryPhoneNumber: string;
  guestFullName?: string;
  guestEmail?: string;
  userId?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userType: string;
  };
  extraDetails: string;
  purposeOfRide: string;
  bookingRef: string;
  segments: UnallocatedBookingSegment[];
  bookingForOthers: boolean;
};

export function useGetUnallocatedCount() {
  return useQuery<number, Error>({
    queryKey: ["unallocatedHourlyCount"],
    queryFn: async () => {
      return apiClient.get<number>(
        "/admin/bookings/hourly-booking/unallocated/count",
      );
    },
    refetchInterval: 60000,
  });
}

export function useGetUnallocatedBookings(page: number = 0, size: number = 10) {
  return useQuery<PaginatedResponse<UnallocatedBooking>, Error>({
    queryKey: ["unallocatedHourlyBookings", page, size],
    queryFn: async () => {
      return apiClient.get<PaginatedResponse<UnallocatedBooking>>(
        `/admin/bookings/hourly-booking/unallocated?page=${page}&size=${size}`,
      );
    },
    placeholderData: (previousData) => previousData,
  });
}

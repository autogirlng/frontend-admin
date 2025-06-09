"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { BookingInformation } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";

type VehicleUpcomingBookingType = {
  data: BookingInformation[];
  totalCount: number;
};

export default function useVehicleUpcomingBooking(id: string) {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["getUpcomingBookings", user?.id],

    queryFn: () =>
      http.get<VehicleUpcomingBookingType>(
        `/bookings/upcoming/${id}?page=1&limit=10`
      ),
    enabled: !!user?.id && !!id,
    retry: false,
  });

  return {
    upcomingBookings: data?.data ?? [],
    isError,
    error,
    isLoading,
  };
}

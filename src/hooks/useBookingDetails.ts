"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { BookingInformation } from "@/utils/types";
import { Driver } from "@/utils/types";

export default function useBookingDetails(bookingId: string) {
  const http = useHttp();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["bookingDetails", bookingId],
    queryFn: async () => {
      const booking = await http.get<BookingInformation>(`/bookings/getSingle/${bookingId}`);
      // Fetch assignments
      const assignments = (await http.get<any[]>(`/drivers/booking/${bookingId}`)) || [];
      // Fetch driver profiles for each assignment
      const drivers = await Promise.all(
        assignments.map(async (assignment) => {
          const driverProfile = await http.get<Driver>(`/drivers/findOne/${assignment.driverId}`);
          return { ...assignment, driver: driverProfile };
        })
      );
      return { bookingDetails: booking, assignedDrivers: drivers };
    },
    enabled: !!bookingId,
    retry: false,
  });

  return {
    bookingDetails: data?.bookingDetails,
    assignedDrivers: data?.assignedDrivers,
    isError,
    error,
    isLoading,
  };
} 
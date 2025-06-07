"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { Review } from "@/types";
import { Booking, HostBookingTable } from "@/types/Bookings";

// Define the API response types if you haven't already
export interface HostVehicleDetails {
  make: string;
  color: string | null;
  seatingCapacity: number | null;
  location: string;
  vehicleType: string;
}

export interface HostVehicle {
  image: string | null;
  name: string;
  status: string;
  details: HostVehicleDetails;
  extras: string[];
}

export interface HostProfile {
  id: string;
  profileImage: string | null;
  firstName: string;
  lastName: string;
  email: string;
  businessName: string | null; // Can be null if not a business
  status: string;
  lastLogin: string;
}

export interface HostActivity {
  completedBookings: number;
  unpaidBookings: number;
  canceledBookings: number;
  pendingBookings: number;
  ongoingBookings: number;
  totalTrips: number;
  lastLogin: string;
}

export interface HostDetailsApiResponse {
  host: HostProfile;
  activity: HostActivity;
  bookings: HostBookingTable[]; // Define a more specific type if you use bookings
  reviews: Review[]; // Define a more specific type if you use reviews
  vehicles: HostVehicle[];
}

export default function useHostDetails({ hostId }: { hostId: string }) {
  const http = useHttp();

  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["hostDetails", hostId], // Use the passed hostId
    queryFn: async () => {
      const url = `${ApiRoutes.getHostDetails}/${hostId}`; // Assuming you have this API route
      console.log("Fetching host details with URL:", url);
      return http.get<HostDetailsApiResponse>(url);
    },
    enabled: !!hostId,
    retry: false,
  });

  return {
    data: data || ({} as HostDetailsApiResponse),
    isError,
    isLoading,
    isSuccess,
    refetch,
  };
}

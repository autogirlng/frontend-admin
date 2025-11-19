import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  VehicleResponse,
  BookingTypeResponse,
  CreatePastBookingPayload,
} from "./past-types";
import toast from "react-hot-toast";

// --- Get Vehicles (with search) ---
export function useGetVehiclesForAdmin(searchTerm: string = "") {
  return useQuery<VehicleResponse>({
    queryKey: ["adminVehicles", searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("searchTerm", searchTerm);

      // ✅ Explicitly add status, page, and size
      params.append("status", "APPROVED");
      params.append("page", "0");
      params.append("size", "50");

      const url = `/vehicles?${params.toString()}`;
      console.log("Fetching Vehicles URL:", url); // Debug Log

      return apiClient.get(url);
    },
    // Keep previous data while typing to avoid flickering
    placeholderData: (previousData) => previousData,
  });
}

// --- Get Booking Types ---
export function useGetBookingTypes() {
  return useQuery<BookingTypeResponse>({
    queryKey: ["bookingTypes"],
    queryFn: () => apiClient.get("/booking-types"),
  });
}

// --- Create Past Booking Mutation ---
export function useCreatePastBooking() {
  return useMutation<any, Error, CreatePastBookingPayload>({
    mutationFn: (payload) => apiClient.post("/admin/bookings/past", payload),
    onSuccess: () => {
      toast.success("Past booking recorded successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to record booking: ${error.message}`);
    },
  });
}

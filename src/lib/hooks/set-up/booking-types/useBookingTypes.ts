import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  BookingType,
  BookingTypePayload,
} from "@/components/set-up-management/bookings-types/types";
import toast from "react-hot-toast";

// Key for caching
const BOOKING_TYPES_QUERY_KEY = ["bookingTypes"];

// Hook to GET all booking types
export function useGetBookingTypes() {
  return useQuery<BookingType[]>({
    queryKey: BOOKING_TYPES_QUERY_KEY,
    queryFn: () => apiClient.get<BookingType[]>("/booking-types"),
  });
}

// Hook to POST a new booking type
export function useCreateBookingType() {
  const queryClient = useQueryClient();

  return useMutation<BookingType, Error, BookingTypePayload>({
    mutationFn: (payload) => apiClient.post("/booking-types", payload),
    onSuccess: (newData) => {
      // Optimistically update the cache
      queryClient.setQueryData<BookingType[]>(
        BOOKING_TYPES_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Booking type created successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// Hook to PUT (update) a booking type
export function useUpdateBookingType() {
  const queryClient = useQueryClient();

  return useMutation<
    BookingType,
    Error,
    { id: string; payload: BookingTypePayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/booking-types/${id}`, payload),
    onSuccess: (updatedData) => {
      // Invalidate the cache to refetch
      queryClient.invalidateQueries({ queryKey: BOOKING_TYPES_QUERY_KEY });
      toast.success("Booking type updated successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// Hook to DELETE a booking type
export function useDeleteBookingType() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/booking-types/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData<BookingType[]>(
        BOOKING_TYPES_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Booking type deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

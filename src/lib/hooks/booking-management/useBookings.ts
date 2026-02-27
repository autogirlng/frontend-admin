import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  PaginatedResponse,
  BookingSegment,
  MoveSegmentsPayload,
} from "@/components/dashboard/bookings-management/types";
import toast from "react-hot-toast";

const BOOKINGS_QUERY_KEY = "bookings";

interface BookingFilters {
  page: number;
  status: string;
  bookingTypeId: string;
  startDate: string;
  endDate: string;
  searchTerm: string;
}

interface CancelBookingPayload {
  reason: string;
}

interface MoveBookingPayload {
  bookingId: string;
  newVehicleId: string;
  waivePriceDifference: boolean;
}

interface VehicleOption {
  id: string;
  name: string;
  vehicleIdentifier: string;
}

export function useGetBookingSegments(filters: BookingFilters) {
  const { searchTerm, ...otherFilters } = filters;

  return useQuery<PaginatedResponse<BookingSegment>>({
    queryKey: [BOOKINGS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(otherFilters.page));
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }

      if (otherFilters.status)
        params.append("bookingStatus", otherFilters.status);
      if (otherFilters.bookingTypeId)
        params.append("bookingTypeId", otherFilters.bookingTypeId);
      if (otherFilters.startDate)
        params.append("startDate", otherFilters.startDate);
      if (otherFilters.endDate) params.append("endDate", otherFilters.endDate);

      const endpoint = `/admin/bookings/segments?${params.toString()}`;
      return apiClient.get<PaginatedResponse<BookingSegment>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

interface DownloadArgs {
  bookingId: string;
  toastId: string;
}

export function useDownloadInvoice() {
  return useMutation<void, Error, DownloadArgs>({
    mutationFn: ({ bookingId }) => {
      const filename = `invoice-${bookingId}.pdf`;
      return apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {},
        filename,
      );
    },
    onSuccess: (data, variables) => {
      toast.success("Invoice download started.", {
        id: variables.toastId,
      });
    },
    onError: (error, variables) => {
      toast.error(`Download failed: ${error.message}`, {
        id: variables.toastId,
      });
    },
  });
}

export function useDownloadReceipt() {
  return useMutation<void, Error, DownloadArgs>({
    mutationFn: ({ bookingId }) => {
      const filename = `receipt-${bookingId}.pdf`;
      return apiClient.getAndDownloadFile(
        `/admin/invoices/${bookingId}/download-receipt`,
        filename,
      );
    },
    onSuccess: (data, variables) => {
      toast.success("Receipt download started.", {
        id: variables.toastId,
      });
    },
    onError: (error, variables) => {
      toast.error(`Receipt download failed: ${error.message}`, {
        id: variables.toastId,
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { bookingId: string; reason: string }>({
    mutationFn: ({ bookingId, reason }) =>
      apiClient.patch(`/admin/bookings/${bookingId}/cancel`, { reason }),
    onSuccess: () => {
      toast.success("Booking cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel booking.");
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (bookingId) => apiClient.delete(`/admin/bookings/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking record deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete booking.");
    },
  });
}

export function useMoveBooking() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, MoveBookingPayload>({
    mutationFn: ({ bookingId, newVehicleId, waivePriceDifference }) =>
      apiClient.post(`/admin/bookings/${bookingId}/move-vehicle`, {
        newVehicleId,
        waivePriceDifference,
      }),
    onSuccess: () => {
      toast.success("Booking successfully moved to new vehicle.");
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to move booking.");
    },
  });
}

export function useGetVehiclesForDropdown(searchTerm: string = "") {
  return useQuery<VehicleOption[]>({
    queryKey: ["vehiclesDropdown", searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("status", "APPROVED");
      params.append("size", "50");

      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }

      const response: any = await apiClient.get(
        `/vehicles?${params.toString()}`,
      );

      const vehicles = response.data?.content || response.content || [];

      return vehicles.map((v: any) => ({
        id: v.id,
        name: v.name,
        vehicleIdentifier: v.vehicleIdentifier,
      }));
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useAllocateVehicle() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { bookingId: string; vehicleId: string }>({
    mutationFn: async ({ bookingId, vehicleId }) => {
      await apiClient.post(`/admin/trips/allocate-vehicle/${bookingId}`, {
        vehicleId,
      });
    },
    onSuccess: () => {
      toast.success("Vehicle allocated successfully.");
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to allocate vehicle.");
    },
  });
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  PaginatedResponse,
  BookingSegment,
} from "@/components/dashboard/bookings-management/types";
import toast from "react-hot-toast";

// --- Query Key ---
const BOOKINGS_QUERY_KEY = "bookings";

// Interface for our filter state
interface BookingFilters {
  page: number;
  status: string;
  bookingTypeId: string;
  startDate: string;
  endDate: string;
  searchTerm: string;
}

/**
 * Fetches a paginated list of booking segments based on filters.
 */
export function useGetBookingSegments(filters: BookingFilters) {
  const { searchTerm, ...otherFilters } = filters;

  return useQuery<PaginatedResponse<BookingSegment>>({
    queryKey: [BOOKINGS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(otherFilters.page));
      params.append("size", "10"); // Default page size
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }

      if (otherFilters.status) params.append("bookingStatus", otherFilters.status);
      if (otherFilters.bookingTypeId)
        params.append("bookingTypeId", otherFilters.bookingTypeId);
      if (otherFilters.startDate) params.append("startDate", otherFilters.startDate);
      if (otherFilters.endDate) params.append("endDate", otherFilters.endDate);

      const endpoint = `/admin/bookings/segments?${params.toString()}`;
      return apiClient.get<PaginatedResponse<BookingSegment>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}


// --- Type for Download Mutations ---
interface DownloadArgs {
  bookingId: string;
  toastId: string; // To update the loading toast
}

/**
 * Hook to download an invoice PDF
 */
export function useDownloadInvoice() {
  return useMutation<void, Error, DownloadArgs>({
    mutationFn: ({ bookingId }) => {
      const filename = `invoice-${bookingId}.pdf`;
      // We pass an empty object {} as the body
      return apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {},
        filename
      );
    },
    onSuccess: (data, variables) => {
      // Use toastId to update the correct toast
      toast.success("Invoice download started.", {
        id: variables.toastId,
      });
    },
    onError: (error, variables) => {
      toast.error(`Download failed: ${error.message}`, {
        id: variables.toastId, // This is now valid
      });
    },
  });
}


/**
 * Hook to download an receipt PDF
 */

export function useDownloadReceipt() {
  return useMutation<void, Error, DownloadArgs>({
    mutationFn: ({ bookingId }) => {
      // This function is called by the mutation
      const filename = `receipt-${bookingId}.pdf`;
      
      // We use your new helper function here!
      return apiClient.getAndDownloadFile(
        `/admin/invoices/${bookingId}/download-receipt`,
        filename
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


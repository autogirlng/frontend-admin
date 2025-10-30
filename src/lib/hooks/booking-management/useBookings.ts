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
}

/**
 * Fetches a paginated list of booking segments based on filters.
 */
export function useGetBookingSegments(filters: BookingFilters) {
  return useQuery<PaginatedResponse<BookingSegment>>({
    queryKey: [BOOKINGS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(filters.page));
      params.append("size", "10"); // Default page size

      if (filters.status) params.append("bookingStatus", filters.status);
      if (filters.bookingTypeId)
        params.append("bookingTypeId", filters.bookingTypeId);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const endpoint = `/admin/bookings/segments?${params.toString()}`;
      return apiClient.get<PaginatedResponse<BookingSegment>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to download an invoice PDF
 */
export function useDownloadInvoice() {
  return useMutation<void, Error, { bookingId: string }>({
    mutationFn: ({ bookingId }) => {
      const filename = `invoice-${bookingId}.pdf`;
      // We pass an empty object {} as the body
      return apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {},
        filename
      );
    },
    onSuccess: () => {
      toast.success("Invoice download started.");
    },
    onError: (error) => {
      toast.error(`Download failed: ${error.message}`);
    },
  });
}

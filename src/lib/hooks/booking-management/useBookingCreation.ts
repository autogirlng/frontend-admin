import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";
import {
  CalculateBookingResponse,
  PaginatedResponse,
  VehicleSearchResult,
  CalculateBookingPayload,
  CreateBookingPayload,
  CreateBookingResponse,
  VehicleSearchFilters,
} from "@/components/dashboard/bookings-management/types";

const VEHICLE_SEARCH_KEY = "vehicleSearch";

interface DownloadInvoicePayload {
  bookingId: string;
  companyBankAccountId?: string;
}

/**
 * Hook for GET /v1/public/vehicles/search
 * Implements the "Swiss Army Knife" logic
 */
export function useVehicleSearch(
  filters: VehicleSearchFilters,
  enabled: boolean
) {
  return useQuery<PaginatedResponse<VehicleSearchResult>>({
    queryKey: [VEHICLE_SEARCH_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Iterate over filters and append if value exists
      Object.entries(filters).forEach(([key, value]) => {
        // Skip internal UI fields or empty values
        if (
          value === undefined ||
          value === "" ||
          value === null ||
          key === "pickupLocationString" ||
          key === "dropoffLocationString"
        ) {
          return;
        }

        // Handle Time Formatting: Ensure HH:mm:ss format
        if (key === "startTime" || key === "endTime") {
          const timeStr = String(value);
          // If input is HH:mm, append :00. If already HH:mm:ss, leave it.
          params.append(key, timeStr.length === 5 ? `${timeStr}:00` : timeStr);
        } else {
          params.append(key, String(value));
        }
      });

      // Ensure Pagination defaults
      if (!filters.page) params.set("page", "0");
      if (!params.has("size")) params.set("size", "10");

      const endpoint = `/public/vehicles/search?${params.toString()}`;

      return apiClient.get<PaginatedResponse<VehicleSearchResult>>(
        endpoint,
        false // public endpoint
      );
    },
    enabled: enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useBookingCalculation() {
  return useMutation<CalculateBookingResponse, Error, CalculateBookingPayload>({
    mutationFn: (payload) =>
      apiClient.post("/public/bookings/calculate", payload, false),
    onError: (error) => {
      toast.error(`Calculation failed: ${error.message}`);
    },
  });
}

export function useCreateBooking() {
  return useMutation<CreateBookingResponse, Error, CreateBookingPayload>({
    mutationFn: (payload) => apiClient.post("/bookings", payload, false),
    onError: (error) => {
      toast.error(`Booking creation failed: ${error.message}`);
    },
  });
}

export function useDownloadInvoice() {
  return useMutation<void, Error, DownloadInvoicePayload>({
    mutationFn: async ({ bookingId, companyBankAccountId }) => {
      const defaultFilename = `Invoice-${bookingId}.pdf`;
      const payload = companyBankAccountId ? { companyBankAccountId } : {};
      await apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        payload,
        defaultFilename
      );
    },
    onSuccess: () => {
      toast.success("Invoice download started.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to download invoice.");
    },
  });
}

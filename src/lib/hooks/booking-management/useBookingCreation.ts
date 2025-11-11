import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path

import toast from "react-hot-toast";
import {
  CalculateBookingResponse,
  PaginatedResponse,
  VehicleSearchResult,
  CalculateBookingPayload,
  CreateBookingPayload,
  CreateBookingResponse,
} from "@/components/dashboard/bookings-management/types";

// --- Query Key ---
const VEHICLE_SEARCH_KEY = "vehicleSearch";

// --- Interface for search filters ---
// (Ensure this includes pickup/dropoff strings as added previously)
export interface VehicleSearchFilters {
  latitude?: number;
  longitude?: number;
  radiusInKm?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  bookingTypeId?: string;
  vehicleTypeId?: string;
  vehicleMakeId?: string;
  vehicleModelId?: string;
  minSeats?: number;
  page: number; // For pagination
  pickupLocationString?: string; // For form state
  dropoffLocationString?: string; // For form state
}

// ✅ --- UPDATED: Payload Type ---
interface DownloadInvoicePayload {
  bookingId: string;
  companyBankAccountId?: string; // Optional
}

/**
 * Hook for GET /public/vehicles/search
 */
export function useVehicleSearch(
  filters: VehicleSearchFilters,
  enabled: boolean
) {
  return useQuery<PaginatedResponse<VehicleSearchResult>>({
    queryKey: [VEHICLE_SEARCH_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Add optional filters from the filters object
      Object.entries(filters).forEach(([key, value]) => {
        // Exclude form-only fields and pagination
        if (
          value &&
          key !== "page" &&
          key !== "pickupLocationString" &&
          key !== "dropoffLocationString"
        ) {
          params.append(key, String(value));
        }
      });
      params.append("page", String(filters.page));
      params.append("size", "10"); // Or your desired page size

      const endpoint = `/public/vehicles/search?${params.toString()}`;
      // Public endpoint, requireAuth is false
      return apiClient.get<PaginatedResponse<VehicleSearchResult>>(
        endpoint,
        false
      );
    },
    enabled: enabled, // Control when the query runs
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for POST /public/bookings/calculate
 */
export function useBookingCalculation() {
  return useMutation<CalculateBookingResponse, Error, CalculateBookingPayload>({
    mutationFn: (payload) =>
      // Public endpoint
      apiClient.post("/public/bookings/calculate", payload, false),
    onError: (error) => {
      toast.error(`Calculation failed: ${error.message}`);
    },
  });
}

/**
 * Hook for POST /bookings
 */
export function useCreateBooking() {
  return useMutation<CreateBookingResponse, Error, CreateBookingPayload>({
    mutationFn: (payload) =>
      // Public endpoint, explicitly pass false for requireAuth
      apiClient.post("/bookings", payload, false),
    onError: (error) => {
      toast.error(`Booking creation failed: ${error.message}`);
    },
  });
}

export function useDownloadInvoice() {
  return useMutation<void, Error, DownloadInvoicePayload>({
    mutationFn: async ({ bookingId, companyBankAccountId }) => {
      const defaultFilename = `Invoice-${bookingId}.pdf`;

      // ✅ Create payload only if ID exists
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

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { BOOKINGS_QUERY_KEY } from "../finance/useFinanceBookings";

const VEHICLE_SEARCH_KEY = "vehicleSearch";

interface DownloadInvoicePayload {
  bookingId: string;
  companyBankAccountId?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface TimeSlotsResponse {
  vehicleId: string;
  date: string;
  timeSlots: TimeSlot[];
}

export function useVehicleSearch(
  filters: VehicleSearchFilters,
  enabled: boolean,
) {
  return useQuery<PaginatedResponse<VehicleSearchResult>>({
    queryKey: [VEHICLE_SEARCH_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === "" ||
          value === null ||
          key === "pickupLocationString" ||
          key === "dropoffLocationString"
        ) {
          return;
        }

        if (key === "startTime" || key === "endTime") {
          const timeStr = String(value);
          params.append(key, timeStr.length === 5 ? `${timeStr}:00` : timeStr);
        } else {
          params.append(key, String(value));
        }
      });

      if (!filters.page) params.set("page", "0");
      if (!params.has("size")) params.set("size", "10");

      const endpoint = `/public/vehicles/search?${params.toString()}`;

      return apiClient.get<PaginatedResponse<VehicleSearchResult>>(
        endpoint,
        false,
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
  const queryClient = useQueryClient();

  return useMutation<CreateBookingResponse, Error, CreateBookingPayload>({
    mutationFn: (payload) => apiClient.post("/bookings", payload, true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BOOKINGS_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Booking created successfully!");
    },
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
        defaultFilename,
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

export function useGetVehicleTimeSlots(vehicleId?: string, date?: string) {
  return useQuery({
    queryKey: ["vehicleTimeSlots", vehicleId, date],
    queryFn: async () => {
      const data = await apiClient.get<TimeSlotsResponse>(
        `/public/vehicles/${vehicleId}/time-slots?date=${date}`,
        false,
      );
      return data || null;
    },
    enabled: !!vehicleId && !!date,
  });
}

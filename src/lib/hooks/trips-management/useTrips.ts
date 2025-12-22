"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  EditTripPayload,
  PaginatedResponse,
  Trip,
  TripDetail,
} from "@/components/dashboard/trips-management/types";

export const TRIPS_QUERY_KEY = "trips";

export interface TripFilters {
  page: number;
  bookingStatus: string | null;
  tripStatus: string | null;
  bookingTypeId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
}

export function useGetTrips(filters: TripFilters) {
  const {
    page,
    bookingStatus,
    tripStatus,
    bookingTypeId,
    startDate,
    endDate,
    searchTerm,
  } = filters;

  return useQuery<PaginatedResponse<Trip>>({
    queryKey: [
      TRIPS_QUERY_KEY,
      page,
      bookingStatus,
      tripStatus,
      bookingTypeId,
      startDate,
      endDate,
      searchTerm,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      if (bookingStatus) params.append("bookingStatus", bookingStatus);
      if (tripStatus) params.append("tripStatus", tripStatus);
      if (bookingTypeId) params.append("bookingTypeId", bookingTypeId);
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (startDate)
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));

      const endpoint = `/admin/trips?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Trip>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

type AssignDriverPayload = {
  driverId: string;
};
export function useAssignDriver() {
  const queryClient = useQueryClient();
  return useMutation<
    Trip,
    Error,
    { tripId: string; payload: AssignDriverPayload }
  >({
    mutationFn: ({ tripId, payload }) =>
      apiClient.patch(`/admin/trips/${tripId}/assign-driver`, payload),
    onSuccess: (updatedTrip) => {
      queryClient.invalidateQueries({
        queryKey: [TRIPS_QUERY_KEY],
        exact: false,
      });
      toast.success("Driver assigned successfully.");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to assign driver."),
  });
}

type AssignAgentsPayload = {
  customerAgentId?: string | null;
  operationsAgentId?: string | null;
};

export function useAssignAgents() {
  const queryClient = useQueryClient();

  return useMutation<
    Trip,
    Error,
    { tripId: string; payload: AssignAgentsPayload }
  >({
    mutationFn: ({ tripId, payload }) =>
      apiClient.patch(`/admin/trips/${tripId}/assign-agents`, payload),
    onSuccess: (updatedTrip) => {
      queryClient.invalidateQueries({
        queryKey: [TRIPS_QUERY_KEY],
        exact: false,
      });
      toast.success("Agents assigned successfully.");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to assign agents."),
  });
}

export function useGetTripDetails(tripId: string | null) {
  return useQuery<TripDetail>({
    queryKey: [TRIPS_QUERY_KEY, "detail", tripId],
    queryFn: async () => {
      if (!tripId) {
        throw new Error("Trip ID is required");
      }
      return apiClient.get<TripDetail>(`/admin/trips/${tripId}`);
    },
    enabled: !!tripId,
  });
}

export function useDownloadTripInvoice() {
  return useMutation<void, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      const defaultFilename = `Invoice-${bookingId}.pdf`;
      await apiClient.postAndDownloadFile(
        `/admin/invoices/generate-pdf/${bookingId}`,
        {},
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

export function useDownloadTripReceipt() {
  return useMutation<void, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      const defaultFilename = `Receipt-${bookingId}.pdf`;
      await apiClient.getAndDownloadFile(
        `/admin/invoices/${bookingId}/download-receipt`,
        defaultFilename
      );
    },
    onSuccess: () => {
      toast.success("Receipt download started.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to download receipt.");
    },
  });
}

export function useEditTrip() {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, { tripId: string; payload: EditTripPayload }>(
    {
      mutationFn: ({ tripId, payload }) =>
        apiClient.patch(`/admin/trips/${tripId}`, payload),
      onSuccess: (updatedTrip) => {
        toast.success("Trip details updated successfully.");
        queryClient.invalidateQueries({
          queryKey: [TRIPS_QUERY_KEY],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: [TRIPS_QUERY_KEY, "detail", updatedTrip.id],
        });
      },
      onError: (error) =>
        toast.error(error.message || "Failed to update trip details."),
    }
  );
}

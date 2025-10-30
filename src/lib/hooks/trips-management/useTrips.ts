"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  PaginatedResponse,
  Trip,
  TripDetail,
} from "@/components/dashboard/trips-management/types";

export const TRIPS_QUERY_KEY = "trips";

// 1. Get Trips
export interface TripFilters {
  page: number;
  bookingStatus: string | null;
  tripStatus: string | null;
  bookingTypeId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export function useGetTrips(filters: TripFilters) {
  const { page, bookingStatus, tripStatus, bookingTypeId, startDate, endDate } =
    filters;

  return useQuery<PaginatedResponse<Trip>>({
    queryKey: [
      TRIPS_QUERY_KEY,
      page,
      bookingStatus,
      tripStatus,
      bookingTypeId,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      if (bookingStatus) params.append("bookingStatus", bookingStatus);
      if (tripStatus) params.append("tripStatus", tripStatus);
      if (bookingTypeId) params.append("bookingTypeId", bookingTypeId);
      if (startDate)
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));

      const endpoint = `/admin/trips?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Trip>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// 2. Assign Driver
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
      // Invalidate the main trips list to refetch
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

// 3. Assign Agents
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

// 4. Get Trip Details
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

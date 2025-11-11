import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  ApproveVehiclePayload,
  AvailabilityStatus,
  BulkCreateVehiclePayload,
  BulkCreateVehicleResponse,
  CreateUnavailabilityPayload,
  PaginatedResponse,
  UnavailabilityPeriod,
  Vehicle,
  VehicleFull,
  VehicleStatus,
} from "@/components/dashboard/vehicle-onboarding/types";
import toast from "react-hot-toast";

// --- Query Key ---
const VEHICLES_QUERY_KEY = "vehicles";
export const VEHICLE_UNAVAILABILITY_KEY = "vehicleUnavailability";

/**
 * Fetches a paginated list of vehicles.
 */
export function useGetVehicles(
  page: number,
  searchTerm: string,
  status: string
) {
  return useQuery<PaginatedResponse<Vehicle>>({
    queryKey: [VEHICLES_QUERY_KEY, page, searchTerm, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (status) params.append("status", status);

      const endpoint = `/vehicles?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Vehicle>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for PATCH /vehicles/availability-status
 */
/* export function useUpdateVehicleAvailability() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown, // The response is huge and we don't need it
    Error,
    { id: string; status: AvailabilityStatus }
  >({
    mutationFn: ({ id, status }) =>
      apiClient.patch(`/vehicles/availability-status?id=${id}`, { status }),
    onSuccess: (data: any) => {
      // Use 'any' to access message
      toast.success(data.message || "Vehicle availability updated.");
      queryClient.invalidateQueries({ queryKey: [VEHICLES_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message),
  });
} */

/**
 * Hook for PATCH /vehicles/set-active
 */
export function useSetVehicleActive() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { id: string }>({
    mutationFn: ({ id }) =>
      apiClient.patch(`/vehicles/set-active?id=${id}`, {}),
    onSuccess: (data: any) => {
      toast.success(data.message || "Vehicle set to active.");
      queryClient.invalidateQueries({ queryKey: [VEHICLES_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message),
  });
}

/**
 * Hook for PATCH /vehicles/status (to Reject)
 */
export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { id: string; status: VehicleStatus.REJECTED } // Only for rejection
  >({
    mutationFn: ({ id, status }) =>
      apiClient.patch(`/vehicles/status?id=${id}`, { status }),
    onSuccess: (data: any) => {
      toast.success(data.message || "Vehicle status updated.");
      queryClient.invalidateQueries({ queryKey: [VEHICLES_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useGetVehicleById(vehicleId: string | null) {
  return useQuery<VehicleFull>({
    queryKey: [VEHICLES_QUERY_KEY, "detail", vehicleId],
    queryFn: () => apiClient.get<VehicleFull>(`/vehicles/${vehicleId}`),
    // This query will not run until `vehicleId` is a truthy value
    enabled: !!vehicleId,
  });
}

export function useApproveVehicle() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { id: string; payload: ApproveVehiclePayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.patch(`/vehicles/status?id=${id}`, payload),
    onSuccess: (data: any) => {
      toast.success(data.message || "Vehicle approved successfully.");
      // Invalidate both the list and the detail view
      queryClient.invalidateQueries({ queryKey: [VEHICLES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [VEHICLES_QUERY_KEY, "detail"],
      });
    },
    onError: (error) => toast.error(`Approval failed: ${error.message}`),
  });
}

export function useBulkCreateVehicles() {
  const queryClient = useQueryClient();

  return useMutation<
    BulkCreateVehicleResponse,
    Error,
    BulkCreateVehiclePayload
  >({
    mutationFn: (payload) => apiClient.post("/vehicles/bulk-create", payload),
    onSuccess: (data) => {
      toast.success(
        `Bulk create successful! ${data.successfulCreations} vehicles created.`
      );
      // Invalidate the main vehicle list to show the new ones
      queryClient.invalidateQueries({ queryKey: [VEHICLES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(`Bulk create failed: ${error.message}`);
    },
  });
}

export function useGetVehicleUnavailability(vehicleId: string | null) {
  return useQuery<UnavailabilityPeriod[], Error>({
    queryKey: [VEHICLE_UNAVAILABILITY_KEY, vehicleId],
    queryFn: () =>
      apiClient.get<UnavailabilityPeriod[]>(
        `/vehicles/unavailability/${vehicleId}/unavailability`
      ),
    enabled: !!vehicleId,
  });
}

// ✅ --- NEW: Create Vehicle Unavailability Period ---
export function useCreateVehicleUnavailability() {
  const queryClient = useQueryClient();
  return useMutation<
    UnavailabilityPeriod,
    Error,
    { vehicleId: string; payload: CreateUnavailabilityPayload }
  >({
    mutationFn: ({ vehicleId, payload }) =>
      apiClient.post(
        `/vehicles/unavailability/${vehicleId}/unavailability`,
        payload
      ),
    onSuccess: (_, { vehicleId }) => {
      toast.success("Vehicle marked as unavailable.");
      // Refetch the list of periods for this vehicle
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_UNAVAILABILITY_KEY, vehicleId],
      });
      // Also refetch the main vehicles list, as its status might change
      queryClient.invalidateQueries({
        queryKey: [VEHICLES_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to set unavailability."),
  });
}

// ✅ --- NEW: Delete Vehicle Unavailability Period ---
export function useDeleteVehicleUnavailability() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { vehicleId: string; unavailabilityId: string }
  >({
    mutationFn: ({ unavailabilityId }) =>
      apiClient.delete(
        `/vehicles/unavailability/unavailability/${unavailabilityId}`
      ),
    onSuccess: (_, { vehicleId }) => {
      toast.success("Unavailability period removed.");
      // Refetch the list of periods for this vehicle
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_UNAVAILABILITY_KEY, vehicleId],
      });
      // Also refetch the main vehicles list
      queryClient.invalidateQueries({
        queryKey: [VEHICLES_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to remove period."),
  });
}

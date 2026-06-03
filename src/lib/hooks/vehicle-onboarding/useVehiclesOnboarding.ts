import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  ApproveVehiclePayload,
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

const VEHICLES_QUERY_KEY = "vehicles";
export const VEHICLE_UNAVAILABILITY_KEY = "vehicleUnavailability";

export function useGetVehicles(
  page: number,
  searchTerm: string,
  status: string,
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

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { id: string; status: VehicleStatus.REJECTED }
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
        `Bulk create successful! ${data.successfulCreations} vehicles created.`,
      );
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
        `/vehicles/unavailability/${vehicleId}/unavailability`,
      ),
    enabled: !!vehicleId,
  });
}

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
        payload,
      ),
    onSuccess: (_, { vehicleId }) => {
      toast.success("Vehicle marked as unavailable.");
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_UNAVAILABILITY_KEY, vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: [VEHICLES_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to set unavailability."),
  });
}

export function useDeleteVehicleUnavailability() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { vehicleId: string; unavailabilityId: string }
  >({
    mutationFn: ({ unavailabilityId }) =>
      apiClient.delete(
        `/vehicles/unavailability/unavailability/${unavailabilityId}`,
      ),
    onSuccess: (_, { vehicleId }) => {
      toast.success("Unavailability period removed.");
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_UNAVAILABILITY_KEY, vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: [VEHICLES_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to remove period."),
  });
}

export function useEndVehicleUnavailabilityEarly() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { vehicleId: string; unavailabilityId: string; endedAt: string }
  >({
    mutationFn: ({ unavailabilityId, endedAt }) =>
      apiClient.patch(
        `/vehicles/unavailability/unavailability/${unavailabilityId}/end-early`,
        { endedAt },
      ),
    onSuccess: (_, { vehicleId }) => {
      toast.success("Unavailability ended early.");
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_UNAVAILABILITY_KEY, vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: [VEHICLES_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to end unavailability early."),
  });
}

// lib/hooks/drivers-management/useDrivers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

import toast from "react-hot-toast";
import {
  Driver,
  DriverDetail,
  DriverPayload,
  UpdateDriverPayload,
  DriverSchedule,
  DriverSchedulePayload,
  PaginatedResponse,
} from "@/components/dashboard/drivers-management/types";
import { VehicleDetail } from "@/components/dashboard/trips-management/types";
import { VEHICLE_DETAIL_KEY } from "../vehicle-onboarding/details/useVehicleDetailsPage";

// --- Query Keys ---
export const DRIVERS_QUERY_KEY = "drivers";
export const DRIVER_SCHEDULE_KEY = "driverSchedule";
export const DRIVER_DETAIL_KEY = "driverDetail";

// --- GET All "My Drivers" ---
export function useGetMyDrivers(page: number, searchTerm: string) {
  return useQuery<PaginatedResponse<Driver>>({
    queryKey: [DRIVERS_QUERY_KEY, page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      const endpoint = `/drivers/my-drivers?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Driver>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// --- GET Single Driver Details ---
export function useGetDriverDetails(driverId: string | null) {
  return useQuery<DriverDetail>({
    queryKey: [DRIVER_DETAIL_KEY, driverId],
    queryFn: () => apiClient.get<DriverDetail>(`/drivers/${driverId}`),
    enabled: !!driverId,
  });
}

// --- POST Create Driver ---
export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation<Driver, Error, DriverPayload>({
    mutationFn: (payload) => apiClient.post("/drivers", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
      toast.success("Driver created successfully.");
    },
    onError: (error) => toast.error(`Failed to create: ${error.message}`),
  });
}

// --- PATCH Update Driver Details ---
export function useUpdateDriver() {
  const queryClient = useQueryClient();
  return useMutation<
    DriverDetail,
    Error,
    { driverId: string; payload: UpdateDriverPayload }
  >({
    mutationFn: ({ driverId, payload }) =>
      apiClient.patch(`/drivers/${driverId}`, payload),
    onSuccess: (updatedDriver) => {
      toast.success("Driver details updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [DRIVER_DETAIL_KEY, updatedDriver.id],
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update driver."),
  });
}

// --- PATCH Update Driver Profile Picture ---
export function useUpdateDriverProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation<DriverDetail, Error, { driverId: string; file: File }>({
    mutationFn: ({ driverId, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient.patchFormData<DriverDetail>(
        `/drivers/${driverId}/profile-picture`,
        formData
      );
    },
    onSuccess: (updatedDriver) => {
      toast.success("Profile picture updated!");
      queryClient.setQueryData(
        [DRIVER_DETAIL_KEY, updatedDriver.id],
        updatedDriver
      );
      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload picture.");
    },
  });
}

// --- POST Send Schedule Link ---
export function useSendScheduleLink() {
  return useMutation<unknown, Error, { driverId: string }>({
    mutationFn: ({ driverId }) =>
      apiClient.post(`/drivers/${driverId}/send-schedule-link`, {}),
    onSuccess: () => {
      toast.success("Schedule link sent successfully.");
    },
    onError: (error) => toast.error(`Failed to send link: ${error.message}`),
  });
}

// --- GET Driver Schedule ---
export function useGetDriverSchedule(driverId: string, weekStartDate: string) {
  return useQuery<DriverSchedule>({
    queryKey: [DRIVER_SCHEDULE_KEY, driverId, weekStartDate],
    queryFn: () =>
      apiClient.get<DriverSchedule>(
        `/drivers/${driverId}/schedule?weekStartDate=${weekStartDate}`
      ),
    enabled: !!driverId && !!weekStartDate,
  });
}

// --- PUT Update Driver Schedule ---
export function useUpdateDriverSchedule() {
  const queryClient = useQueryClient();
  return useMutation<
    DriverSchedule,
    Error,
    { driverId: string; payload: DriverSchedulePayload }
  >({
    mutationFn: ({ driverId, payload }) =>
      apiClient.put(`/drivers/${driverId}/schedule`, payload),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(
        [DRIVER_SCHEDULE_KEY, updatedData.driver.id, updatedData.weekStartDate],
        updatedData
      );
      toast.success("Schedule updated successfully.");
    },
    onError: (error) => toast.error(`Failed to update: ${error.message}`),
  });
}

// --- PATCH Update Driver Status ---
export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { driverId: string; isActive: boolean }>({
    mutationFn: ({ driverId, isActive }) =>
      apiClient.patch(`/drivers/${driverId}/status`, { isActive }),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
      toast.success(
        `Driver status updated to ${isActive ? "ACTIVE" : "INACTIVE"}`
      );
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update status."),
  });
}

export function useAssignDriverToVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleDetail,
    Error,
    { vehicleId: string; driverId: string }
  >({
    mutationFn: ({ vehicleId, driverId }) =>
      apiClient.patch(`/vehicles/${vehicleId}/assign-driver`, { driverId }),
    onSuccess: (updatedVehicle) => {
      toast.success("Driver permanently assigned to vehicle.");

      queryClient.setQueryData(
        [VEHICLE_DETAIL_KEY, updatedVehicle.id],
        updatedVehicle
      );

      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to assign driver."),
  });
}

export function useUnassignDriverFromVehicle() {
  const queryClient = useQueryClient();

  return useMutation<VehicleDetail, Error, { vehicleId: string }>({
    mutationFn: async ({ vehicleId }) => {
      const result = await apiClient.delete<VehicleDetail>(
        `/vehicles/${vehicleId}/assign-driver`
      );

      if (result === null) {
        throw new Error("API returned an unexpected null response.");
      }

      return result;
    },
    onSuccess: (updatedVehicle) => {
      toast.success("Driver permanently unassigned from vehicle.");

      queryClient.setQueryData(
        [VEHICLE_DETAIL_KEY, updatedVehicle.id],
        updatedVehicle
      );

      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to unassign driver."),
  });
}

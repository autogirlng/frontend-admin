// lib/hooks/drivers-management/useDrivers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path

import toast from "react-hot-toast";
import {
  Driver,
  DriverDetail,
  DriverPayload,
  UpdateDriverPayload,
  DriverSchedule,
  DriverSchedulePayload,
  PaginatedResponse,
} from "@/components/dashboard/drivers-management/types"; // Adjust path

// --- Query Keys ---
export const DRIVERS_QUERY_KEY = "drivers";
export const DRIVER_SCHEDULE_KEY = "driverSchedule";
export const DRIVER_DETAIL_KEY = "driverDetail"; // ✅ ADDED

// --- GET All "My Drivers" ---
export function useGetMyDrivers(page: number, searchTerm: string) {
  return useQuery<PaginatedResponse<Driver>>({
    queryKey: [DRIVERS_QUERY_KEY, page, searchTerm],
    queryFn: async () => {
      // ... (function is unchanged) ...
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

// ✅ --- NEW: GET Single Driver Details ---
export function useGetDriverDetails(driverId: string | null) {
  return useQuery<DriverDetail>({
    queryKey: [DRIVER_DETAIL_KEY, driverId],
    queryFn: () => apiClient.get<DriverDetail>(`/drivers/${driverId}`),
    enabled: !!driverId,
  });
}

// --- POST Create Driver ---
export function useCreateDriver() {
  // ... (function is unchanged) ...
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

// ✅ --- NEW: PATCH Update Driver Details ---
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
      // Invalidate both the list and the detail queries
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

// ✅ --- NEW: PATCH Update Driver Profile Picture ---
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
      // Optimistically update the detail query cache
      queryClient.setQueryData(
        [DRIVER_DETAIL_KEY, updatedDriver.id],
        updatedDriver
      );
      // Invalidate the main list to show new picture (if you add it)
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
// ... (function is unchanged) ...
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
// ... (function is unchanged) ...
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
// ... (function is unchanged) ...
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
// ... (function is unchanged) ...
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

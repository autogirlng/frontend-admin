// lib/hooks/drivers-management/useDrivers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path

import toast from "react-hot-toast";
import {
  Driver,
  DriverPayload,
  DriverSchedule,
  DriverSchedulePayload,
  PaginatedResponse,
} from "@/components/dashboard/drivers-management/types"; // Adjust path

// --- Query Keys ---
export const DRIVERS_QUERY_KEY = "drivers";
export const DRIVER_SCHEDULE_KEY = "driverSchedule";

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

// --- POST Create Driver (FIXED) ---
export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation<Driver, Error, DriverPayload>({
    mutationFn: (payload) => apiClient.post("/drivers", payload),
    onSuccess: (newData) => {
      // ✅ FIX: Invalidate the query to refetch the paginated list
      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
      toast.success("Driver created successfully.");
    },
    onError: (error) => toast.error(`Failed to create: ${error.message}`),
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
      // Update the cache for this specific schedule
      queryClient.setQueryData(
        [DRIVER_SCHEDULE_KEY, updatedData.driver.id, updatedData.weekStartDate],
        updatedData
      );
      toast.success("Schedule updated successfully.");
    },
    onError: (error) => toast.error(`Failed to update: ${error.message}`),
  });
}

// --- NEW HOOK ---
// --- PATCH Update Driver Status ---
type UpdateStatusPayload = {
  isActive: boolean;
};

type MutationInput = {
  driverId: string;
  isActive: boolean;
};

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, MutationInput>({
    mutationFn: ({ driverId, isActive }) => {
      const payload: UpdateStatusPayload = { isActive };
      return apiClient.patch(`/drivers/${driverId}/status`, payload);
    },
    onSuccess: (_, { isActive }) => {
      // ✅ Invalidate the 'drivers' query cache to refetch the list
      queryClient.invalidateQueries({
        queryKey: [DRIVERS_QUERY_KEY],
        exact: false,
      });
      toast.success(
        `Driver status updated to ${isActive ? "ACTIVE" : "INACTIVE"}`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status.");
    },
  });
}

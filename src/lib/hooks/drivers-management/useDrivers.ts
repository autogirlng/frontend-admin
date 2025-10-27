import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path

import toast from "react-hot-toast";
import {
  Driver,
  DriverPayload,
  DriverSchedule,
  DriverSchedulePayload,
} from "@/components/dashboard/drivers-management/types";

// --- Query Keys ---
export const DRIVERS_QUERY_KEY = "drivers";
export const DRIVER_SCHEDULE_KEY = "driverSchedule";

// --- GET All "My Drivers" ---
export function useGetMyDrivers() {
  return useQuery<Driver[]>({
    queryKey: [DRIVERS_QUERY_KEY],
    queryFn: () => apiClient.get<Driver[]>("/drivers/my-drivers"),
  });
}

// --- POST Create Driver ---
export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation<Driver, Error, DriverPayload>({
    mutationFn: (payload) => apiClient.post("/drivers", payload),
    onSuccess: (newData) => {
      queryClient.setQueryData<Driver[]>(
        [DRIVERS_QUERY_KEY],
        (oldData = []) => [...oldData, newData]
      );
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
    // This query will only run if driverId and weekStartDate are provided
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import toast from "react-hot-toast";
import {
  VehicleColor,
  VehicleColorPayload,
} from "@/components/set-up-management/vehicle-colors/types";

// --- Query Key ---
const VEHICLE_COLORS_QUERY_KEY = ["vehicleColors"];

// --- GET All Vehicle Colors ---
export function useGetVehicleColors() {
  return useQuery<VehicleColor[]>({
    queryKey: VEHICLE_COLORS_QUERY_KEY,
    queryFn: () => apiClient.get<VehicleColor[]>("/public/vehicle-colors"),
  });
}

// --- POST Create Vehicle Color ---
export function useCreateVehicleColor() {
  const queryClient = useQueryClient();

  return useMutation<VehicleColor, Error, VehicleColorPayload>({
    mutationFn: (payload) => apiClient.post("/public/vehicle-colors", payload),
    onSuccess: (newData) => {
      // Optimistically add to the cache
      queryClient.setQueryData<VehicleColor[]>(
        VEHICLE_COLORS_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Vehicle color created.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// --- PUT Update Vehicle Color ---
export function useUpdateVehicleColor() {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleColor, // Assuming PUT returns the updated object
    Error,
    { id: string; payload: VehicleColorPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/public/vehicle-colors/${id}`, payload),
    onSuccess: () => {
      // Invalidate the cache to refetch the list
      queryClient.invalidateQueries({ queryKey: VEHICLE_COLORS_QUERY_KEY });
      toast.success("Vehicle color updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// --- DELETE Vehicle Color ---
export function useDeleteVehicleColor() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/public/vehicle-colors/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData<VehicleColor[]>(
        VEHICLE_COLORS_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Vehicle color deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

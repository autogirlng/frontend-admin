import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import toast from "react-hot-toast";
import {
  VehicleType,
  VehicleTypePayload,
} from "@/components/set-up-management/vehicle-types/types";

// --- Query Key ---
const VEHICLE_TYPES_QUERY_KEY = ["vehicleTypes"];

// --- GET All Vehicle Types ---
export function useGetVehicleTypes() {
  return useQuery<VehicleType[]>({
    queryKey: VEHICLE_TYPES_QUERY_KEY,
    queryFn: () => apiClient.get<VehicleType[]>("/public/vehicle-types"),
  });
}

// --- POST Create Vehicle Type ---
export function useCreateVehicleType() {
  const queryClient = useQueryClient();

  return useMutation<VehicleType, Error, VehicleTypePayload>({
    mutationFn: (payload) => apiClient.post("/public/vehicle-types", payload),
    onSuccess: (newData) => {
      // Optimistically add to the cache
      queryClient.setQueryData<VehicleType[]>(
        VEHICLE_TYPES_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Vehicle type created.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// --- PUT Update Vehicle Type ---
export function useUpdateVehicleType() {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleType, // Assuming PUT returns the updated object
    Error,
    { id: string; payload: VehicleTypePayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/public/vehicle-types/${id}`, payload),
    onSuccess: () => {
      // Invalidate the cache to refetch the list
      queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
      toast.success("Vehicle type updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// --- DELETE Vehicle Type ---
export function useDeleteVehicleType() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/public/vehicle-types/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData<VehicleType[]>(
        VEHICLE_TYPES_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Vehicle type deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

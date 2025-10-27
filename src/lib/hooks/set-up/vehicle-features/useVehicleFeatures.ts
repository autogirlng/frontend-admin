import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import {
  VehicleFeature,
  VehicleFeaturePayload,
} from "@/components/set-up-management/vehicle-features/types";
import toast from "react-hot-toast";

// --- Query Key ---
const VEHICLE_FEATURES_QUERY_KEY = ["vehicleFeatures"];

// --- GET All Vehicle Features ---
export function useGetVehicleFeatures() {
  return useQuery<VehicleFeature[]>({
    queryKey: VEHICLE_FEATURES_QUERY_KEY,
    queryFn: () => apiClient.get<VehicleFeature[]>("/public/vehicle-features"),
  });
}

// --- POST Create Vehicle Feature ---
export function useCreateVehicleFeature() {
  const queryClient = useQueryClient();

  return useMutation<VehicleFeature, Error, VehicleFeaturePayload>({
    mutationFn: (payload) =>
      apiClient.post("/public/vehicle-features", payload),
    onSuccess: (newData) => {
      // Optimistically add to the cache
      queryClient.setQueryData<VehicleFeature[]>(
        VEHICLE_FEATURES_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Vehicle feature created.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// --- PUT Update Vehicle Feature ---
export function useUpdateVehicleFeature() {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleFeature, // Assuming PUT returns the updated object
    Error,
    { id: string; payload: VehicleFeaturePayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/public/vehicle-features/${id}`, payload),
    onSuccess: () => {
      // Invalidate the cache to refetch the list
      queryClient.invalidateQueries({ queryKey: VEHICLE_FEATURES_QUERY_KEY });
      toast.success("Vehicle feature updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// --- DELETE Vehicle Feature ---
export function useDeleteVehicleFeature() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/public/vehicle-features/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData<VehicleFeature[]>(
        VEHICLE_FEATURES_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Vehicle feature deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

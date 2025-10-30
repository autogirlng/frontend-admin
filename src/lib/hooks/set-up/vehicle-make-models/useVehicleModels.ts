import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import {
  VehicleModel,
  VehicleModelPayload,
  CsvUploadResponse,
} from "@/components/set-up-management/vehicle-make-model/types";
import toast from "react-hot-toast";

// --- Query Key ---
const VEHICLE_MODELS_QUERY_KEY = ["vehicleModels"];

// --- GET All Vehicle Models ---
export function useGetVehicleModels() {
  return useQuery<VehicleModel[]>({
    queryKey: VEHICLE_MODELS_QUERY_KEY,
    queryFn: () => apiClient.get<VehicleModel[]>("/public/vehicle-models"),
  });
}

// --- POST Create Model ---
export function useCreateVehicleModel() {
  const queryClient = useQueryClient();
  return useMutation<VehicleModel, Error, VehicleModelPayload>({
    mutationFn: (payload) => apiClient.post("/public/vehicle-models", payload),
    onSuccess: (newData) => {
      queryClient.setQueryData<VehicleModel[]>(
        VEHICLE_MODELS_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Vehicle model created.");
    },
    onError: (error) => toast.error(`Failed to create: ${error.message}`),
  });
}

// --- PUT Update Model ---
export function useUpdateVehicleModel() {
  const queryClient = useQueryClient();
  return useMutation<
    VehicleModel,
    Error,
    { id: string; payload: VehicleModelPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/public/vehicle-models/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_MODELS_QUERY_KEY });
      toast.success("Vehicle model updated.");
    },
    onError: (error) => toast.error(`Failed to update: ${error.message}`),
  });
}

// --- DELETE Model ---
export function useDeleteVehicleModel() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/public/vehicle-models/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<VehicleModel[]>(
        VEHICLE_MODELS_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Vehicle model deleted.");
    },
    onError: (error) => toast.error(`Failed to delete: ${error.message}`),
  });
}

// --- POST Upload CSV ---
// Note: The endpoint seems wrong in the prompt (it has {id})
// I'm assuming it should be /public/vehicle-models/upload-csv
// If it's really /public/vehicle-models/{id}, you need to pass an ID in.
export function useUploadVehicleModelsCsv() {
  const queryClient = useQueryClient();
  return useMutation<CsvUploadResponse, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      // Assuming this is the correct endpoint, adjust if needed
      return apiClient.postFormData(
        "/public/vehicle-models/upload-csv",
        formData
      );
    },
    onSuccess: () => {
      // Refetch the list after CSV upload
      queryClient.invalidateQueries({ queryKey: VEHICLE_MODELS_QUERY_KEY });
    },
  });
}

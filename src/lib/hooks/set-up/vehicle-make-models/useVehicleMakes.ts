import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import toast from "react-hot-toast";
import {
  VehicleMake,
  VehicleMakePayload,
  CsvUploadResponse,
} from "@/components/set-up-management/vehicle-make-model/types";

// --- Query Key ---
export const VEHICLE_MAKES_QUERY_KEY = ["vehicleMakes"];

// --- GET All Vehicle Makes ---
export function useGetVehicleMakes() {
  return useQuery<VehicleMake[]>({
    queryKey: VEHICLE_MAKES_QUERY_KEY,
    queryFn: () => apiClient.get<VehicleMake[]>("/public/vehicle-makes"),
  });
}

// --- POST Create Make ---
export function useCreateVehicleMake() {
  const queryClient = useQueryClient();
  return useMutation<VehicleMake, Error, VehicleMakePayload>({
    mutationFn: (payload) => apiClient.post("/public/vehicle-makes", payload),
    onSuccess: (newData) => {
      queryClient.setQueryData<VehicleMake[]>(
        VEHICLE_MAKES_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Vehicle make created.");
    },
    onError: (error) => toast.error(`Failed to create: ${error.message}`),
  });
}

// --- PUT Update Make ---
export function useUpdateVehicleMake() {
  const queryClient = useQueryClient();
  return useMutation<
    VehicleMake,
    Error,
    { id: string; payload: VehicleMakePayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/public/vehicle-makes/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_MAKES_QUERY_KEY });
      toast.success("Vehicle make updated.");
    },
    onError: (error) => toast.error(`Failed to update: ${error.message}`),
  });
}

// --- DELETE Make ---
export function useDeleteVehicleMake() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/public/vehicle-makes/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<VehicleMake[]>(
        VEHICLE_MAKES_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Vehicle make deleted.");
    },
    onError: (error) => toast.error(`Failed to delete: ${error.message}`),
  });
}

// --- POST Upload CSV ---
export function useUploadVehicleMakesCsv() {
  const queryClient = useQueryClient();
  return useMutation<CsvUploadResponse, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient.postFormData(
        "/public/vehicle-makes/upload-csv",
        formData
      );
    },
    onSuccess: () => {
      // Refetch the list after CSV upload
      queryClient.invalidateQueries({ queryKey: VEHICLE_MAKES_QUERY_KEY });
    },
    // Errors are handled by the component to show the details
  });
}

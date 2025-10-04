import apiClient from "@/api/APIClient";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { useQuery, QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface UpdateRolePermissionsPayload {
  role: string;
  permissions: string[];
}

export const useUpdateRolePermissions = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRolePermissionsPayload) => {
      // Asynchronous function to send update request.
      const response = await apiClient.put(`${ApiRoutes.changeRole}`, payload); // Makes PUT request with the payload.
      return response.data; // Returns the response data.
    },
    onSuccess: (data, variables) => {
      // Callback executed on successful mutation.
      // Invalidates the 'rolePermissions' query to force a refetch of the latest data from the server.
      queryClient.invalidateQueries({ queryKey: ["rolePermissions"] });
      console.log(
        `Successfully updated permissions for role: ${variables.role}`,
        data
      );
      // Using browser alert for demonstration purposes. In a real app, use a more sophisticated notification system (e.g., toast messages).
      toast.success(`Permissions for ${variables.role} updated successfully!`);
    },
    onError: (error: any) => {
      // Using 'any' for error type for simplicity, consider more specific error handling.
      console.error("Error updating role permissions:", error);
      // Using browser alert for demonstration purposes.
      toast.error(
        `Failed to update permissions: ${error.message || "Unknown error"}`
      );
    },
  });
};
// Interface for a single role permission object received from the API.
export interface RolePermission {
  id: string; // Unique identifier for the role permission entry.
  role: string; // The name of the role (e.g., "SUPER_ADMIN", "ADMIN").
  permissions: string[]; // An array of strings, each representing a permission.
  createdAt: string; // Timestamp of creation.
  updatedAt: string; // Timestamp of last update.
}

export const useRolePermissions = () => {
  return useQuery<RolePermission[]>({
    queryKey: ["rolePermissions"], // Unique key for caching this query's data.
    queryFn: async () => {
      // Asynchronous function to fetch data from the API.
      const response = await apiClient.get(ApiRoutes.changeRole); // Makes GET request.
      return response.data; // Returns the data from the API response.
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes (5 * 60 seconds * 1000 milliseconds).
    // No initialData as per your request. Data will be fetched from the API.
  });
};

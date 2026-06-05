import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import toast from "react-hot-toast";
import {
  CustomerCategory,
  CustomerCategoryPayload,
} from "@/components/set-up-management/customer-categories/types";

// --- Query Key ---
const CUSTOMER_CATEGORIES_QUERY_KEY = ["customerCategories"];

// --- GET All Customer Categories ---
export function useGetCustomerCategories() {
  return useQuery<CustomerCategory[]>({
    queryKey: CUSTOMER_CATEGORIES_QUERY_KEY,
    queryFn: () =>
      apiClient.get<CustomerCategory[]>("/public/customer-categories"),
  });
}

// --- POST Create Customer Category ---
export function useCreateCustomerCategory() {
  const queryClient = useQueryClient();

  return useMutation<CustomerCategory, Error, CustomerCategoryPayload>({
    mutationFn: (payload) =>
      apiClient.post("/admin/customer-categories", payload),
    onSuccess: () => {
      // Invalidate to refetch with the populated vehicleType object
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_CATEGORIES_QUERY_KEY,
      });
      toast.success("Customer category created.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// --- PUT Update Customer Category ---
export function useUpdateCustomerCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    CustomerCategory, // Assuming PUT returns the updated object
    Error,
    { id: string; payload: CustomerCategoryPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/customer-categories/${id}`, payload),
    onSuccess: () => {
      // Invalidate the cache to refetch the list
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_CATEGORIES_QUERY_KEY,
      });
      toast.success("Customer category updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// --- DELETE Customer Category ---
export function useDeleteCustomerCategory() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/customer-categories/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData<CustomerCategory[]>(
        CUSTOMER_CATEGORIES_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Customer category deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed
import toast from "react-hot-toast";
import {
  DiscountDuration,
  DiscountDurationPayload,
} from "@/components/set-up-management/discount-durations/types";

// --- Query Key ---
const DISCOUNT_DURATIONS_QUERY_KEY = ["discountDurations"];

// --- GET All Discount Durations ---
export function useGetDiscountDurations() {
  return useQuery<DiscountDuration[]>({
    queryKey: DISCOUNT_DURATIONS_QUERY_KEY,
    queryFn: () => apiClient.get<DiscountDuration[]>("/discount-durations"),
  });
}

// --- POST Create Duration ---
export function useCreateDiscountDuration() {
  const queryClient = useQueryClient();

  return useMutation<DiscountDuration, Error, DiscountDurationPayload>({
    mutationFn: (payload) => apiClient.post("/discount-durations", payload),
    onSuccess: (newData) => {
      // Optimistically add to the cache
      queryClient.setQueryData<DiscountDuration[]>(
        DISCOUNT_DURATIONS_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Discount duration created.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// --- PUT Update Duration ---
export function useUpdateDiscountDuration() {
  const queryClient = useQueryClient();

  return useMutation<
    DiscountDuration, // Assuming PUT returns the updated object
    Error,
    { id: string; payload: DiscountDurationPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/discount-durations/${id}`, payload),
    onSuccess: () => {
      // Invalidate the cache to refetch the list
      queryClient.invalidateQueries({ queryKey: DISCOUNT_DURATIONS_QUERY_KEY });
      toast.success("Discount duration updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// --- DELETE Duration ---
export function useDeleteDiscountDuration() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/discount-durations/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData<DiscountDuration[]>(
        DISCOUNT_DURATIONS_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Discount duration deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

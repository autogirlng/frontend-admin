import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed

import toast from "react-hot-toast";
import {
  PlatformFee,
  PlatformFeePayload,
  PlatformFeeUpdatePayload,
} from "@/components/set-up-management/platform-fee/types";

// --- Query Key ---
const PLATFORM_FEES_QUERY_KEY = ["platformFees"];

// --- GET All Platform Fees ---
export function useGetPlatformFees() {
  return useQuery<PlatformFee[]>({
    queryKey: PLATFORM_FEES_QUERY_KEY,
    queryFn: () => apiClient.get<PlatformFee[]>("/platform-fees"),
  });
}

// --- POST Create Fee ---
export function useCreatePlatformFee() {
  const queryClient = useQueryClient();

  return useMutation<PlatformFee, Error, PlatformFeePayload>({
    mutationFn: (payload) => apiClient.post("/platform-fees", payload),
    onSuccess: (newData) => {
      // Optimistically add the new fee to the cache
      queryClient.setQueryData<PlatformFee[]>(
        PLATFORM_FEES_QUERY_KEY,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Platform fee created successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

// --- PUT Update Fee ---
export function useUpdatePlatformFee() {
  const queryClient = useQueryClient();

  return useMutation<
    PlatformFee, // Assuming PUT returns the updated fee
    Error,
    { feeType: string; payload: PlatformFeeUpdatePayload }
  >({
    mutationFn: ({ feeType, payload }) =>
      apiClient.put(`/platform-fees/${feeType}`, payload),
    onSuccess: (updatedData, { feeType }) => {
      // Optimistically update the cache
      queryClient.setQueryData<PlatformFee[]>(
        PLATFORM_FEES_QUERY_KEY,
        (oldData = []) =>
          oldData.map((fee) =>
            fee.feeType === feeType ? { ...fee, ...updatedData } : fee
          )
      );
      toast.success("Platform fee updated successfully.");
    },
    // If onSuccess doesn't work (e.g., PUT returns no content),
    // we can use onSettled to just refetch.
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: PLATFORM_FEES_QUERY_KEY });
    // },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// --- DELETE Fee ---
export function useDeletePlatformFee() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (feeType) => apiClient.delete(`/platform-fees/${feeType}`),
    onSuccess: (_, feeType) => {
      // Optimistically remove from cache
      queryClient.setQueryData<PlatformFee[]>(
        PLATFORM_FEES_QUERY_KEY,
        (oldData = []) => oldData.filter((item) => item.feeType !== feeType)
      );
      toast.success("Platform fee deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

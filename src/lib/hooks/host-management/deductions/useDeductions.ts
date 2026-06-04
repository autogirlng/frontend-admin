import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import type { PaginatedResponse } from "@/components/dashboard/host-management/types";
import type {
  Dispute,
  DisputeFilterParams,
  DeductionPayload,
  PatchDisputePayload,
} from "@/lib/types/deductions";

export const ADMIN_DEDUCTIONS_QUERY_KEY = "admin-deductions";
export const ADMIN_DISPUTES_QUERY_KEY = "admin-disputes";
const HOST_PAYOUTS_QUERY_KEY = "hostPayouts";

const invalidateDeductionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [ADMIN_DEDUCTIONS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [HOST_PAYOUTS_QUERY_KEY] });
};

export function useCreateDeduction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeductionPayload>({
    mutationFn: async (payload: DeductionPayload) => {
      return apiClient.post<void>("/admin/payouts/deduction", payload);
    },
    onSuccess: () => {
      invalidateDeductionQueries(queryClient);
      toast.success("Deduction created successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create deduction.");
    },
  });
}

export function useUpdateDeduction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; payload: DeductionPayload }>({
    mutationFn: async ({ id, payload }) => {
      return apiClient.put<void>(`/admin/payouts/deduction/${id}`, payload);
    },
    onSuccess: () => {
      invalidateDeductionQueries(queryClient);
      toast.success("Deduction updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update deduction.");
    },
  });
}

export function useDeleteDeduction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete<void>(`/admin/payouts/deduction/${id}`);
    },
    onSuccess: () => {
      invalidateDeductionQueries(queryClient);
      toast.success("Deduction deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete deduction.");
    },
  });
}

export function useGetAdminDisputes(filters: DisputeFilterParams) {
  const { page = 0, size = 20, status } = filters;

  return useQuery<PaginatedResponse<Dispute>>({
    queryKey: [ADMIN_DISPUTES_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));
      if (status) params.append("status", status);

      const endpoint = `/admin/payouts/deduction/disputes?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Dispute>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function usePatchDispute() {
  const queryClient = useQueryClient();

  return useMutation<
    Dispute,
    Error,
    { id: string; payload: PatchDisputePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      return apiClient.patch<Dispute>(
        `/admin/payouts/deduction/disputes/${id}`,
        payload,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_DISPUTES_QUERY_KEY] });
      toast.success("Dispute status updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update dispute status.");
    },
  });
}

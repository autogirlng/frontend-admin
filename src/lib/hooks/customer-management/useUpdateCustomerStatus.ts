"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";

type UpdateStatusPayload = {
  isActive: boolean;
};

type MutationInput = {
  userId: string;
  isActive: boolean;
};

/**
 * Hook to update a user's status (activate/deactivate).
 */
export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, MutationInput>({
    mutationFn: ({ userId, isActive }) => {
      const payload: UpdateStatusPayload = { isActive };
      return apiClient.patch(`/admin/users/${userId}/status`, payload);
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
        exact: false,
      });
      toast.success(
        `User status updated to ${isActive ? "ACTIVE" : "INACTIVE"}`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status.");
    },
  });
}

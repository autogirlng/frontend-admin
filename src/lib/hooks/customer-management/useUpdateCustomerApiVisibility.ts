"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import { CUSTOMER_DETAIL_KEY } from "./useCustomers";

type MutationInput = {
  userId: string;
  canSeeApi: boolean;
};

export function useUpdateCustomerApiVisibility() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, MutationInput>({
    mutationFn: ({ userId, canSeeApi }) => {
      return apiClient.patch(`/admin/users/${userId}/can-see-api`, {
        canSeeApi,
      });
    },
    onSuccess: (_, { canSeeApi }) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_DETAIL_KEY] });
      toast.success(
        `API visibility updated to ${canSeeApi ? "Visible" : "Hidden"}`,
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update API visibility.");
    },
  });
}

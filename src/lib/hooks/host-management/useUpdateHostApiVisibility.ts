"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import { HOST_DETAIL_KEY } from "./useHosts";

type MutationInput = {
  userId: string;
  canSeeApi: boolean;
};

export function useUpdateHostApiVisibility() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, MutationInput>({
    mutationFn: ({ userId, canSeeApi }) => {
      return apiClient.patch(`/admin/users/${userId}/can-see-api`, {
        canSeeApi,
      });
    },
    onSuccess: (_, { canSeeApi }) => {
      queryClient.invalidateQueries({ queryKey: ["hosts"] });
      queryClient.invalidateQueries({ queryKey: [HOST_DETAIL_KEY] });
      toast.success(
        `API visibility updated to ${canSeeApi ? "Visible" : "Hidden"}`,
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update API visibility.");
    },
  });
}

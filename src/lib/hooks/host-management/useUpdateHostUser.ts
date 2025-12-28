// lib/hooks/host-management/useUpdateHostUser.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";

export interface UpdateHostUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType?: "CUSTOMER" | "HOST" | "ADMIN";
  departmentName?: string;
  active?: boolean;
}

interface MutationInput {
  userId: string;
  payload: UpdateHostUserPayload;
}

export const useUpdateHostUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, MutationInput>({
    mutationFn: ({ userId, payload }) => {
      // Matches the simple pattern from your useUpdateMyProfile
      return apiClient.patch(`/users/update-host-user/${userId}`, payload);
    },

    onSuccess: (_, variables) => {
      toast.success("User details updated successfully");

      // 1. Refresh the specific host details (if you are on the details page)
      queryClient.invalidateQueries({
        queryKey: ["hostDetails", variables.userId],
      });

      // 2. Refresh the main hosts list (so the table updates immediately)
      queryClient.invalidateQueries({ 
        queryKey: ["hosts"],
      });
    },

    onError: (error: any) => {
      // Matches your working example's error handling
      const errorMessage = error.message || "Failed to update user details.";
      toast.error(errorMessage);
    },
  });
};
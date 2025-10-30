"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type CreateHostPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type CreateHostResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "HOST";
};

export function useCreateHost() {
  const queryClient = useQueryClient();

  return useMutation<CreateHostResponse, Error, CreateHostPayload>({
    mutationFn: async (payload) => {
      return apiClient.post<CreateHostResponse>("/admin/users/hosts", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hosts"],
        exact: false,
      });
    },
  });
}

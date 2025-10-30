"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";

/**
 * Hook to send login credentials to a host.
 */
export function useSendCredentials() {
  return useMutation<unknown, Error, string>({
    mutationFn: (hostId: string) => {
      return apiClient.post(
        `/admin/users/hosts/${hostId}/send-credentials`,
        {}
      );
    },
    onSuccess: () => {
      toast.success("Login credentials sent successfully to host.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send credentials.");
    },
  });
}

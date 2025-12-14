"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";

export interface VacationModePayload {
  startDateTime: string;
  endDateTime: string;
  reason: string;
  notes: string;
}

export function useSetVacationMode() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { hostId: string; payload: VacationModePayload }
  >({
    mutationFn: ({ hostId, payload }) =>
      apiClient.post(`/admin/users/hosts/${hostId}/vacation-mode`, payload),
    onSuccess: () => {
      toast.success("Vacation mode enabled successfully.");
      queryClient.invalidateQueries({ queryKey: ["hosts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to set vacation mode.");
    },
  });
}

export function useEndVacationMode() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (hostId) =>
      apiClient.post(`/admin/users/hosts/${hostId}/end-vacation-mode`, {}),
    onSuccess: () => {
      toast.success("Vacation mode ended. Vehicles are now available.");
      queryClient.invalidateQueries({ queryKey: ["hosts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to end vacation mode.");
    },
  });
}

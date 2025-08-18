// src/hooks/useDeactivateMember.ts

"use client";
import { useMutation } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { toast } from "react-toastify";
import { queryClient } from "@/api/QueryClient";

// Define the payload type for clarity
interface DeactivatePayload {
  memberId: string;
  blockedReason: string;
}

export default function useDeactivateMember() {
  const http = useHttp();

  const mutation = useMutation({
    mutationFn: async (payload: DeactivatePayload) =>
      http.put<any>(`/user/deactivate/${payload.memberId}`, {
        blockedReason: payload.blockedReason,
      }),
    onSuccess: (data) => {
      toast.success("Team member deactivated successfully!");
      // You can also add logic here to invalidate queries for the team list
      queryClient.invalidateQueries({ queryKey: ['membersTable'] })
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    deactivateMember: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
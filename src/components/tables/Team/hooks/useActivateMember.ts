// src/components/tables/Team/hooks/useActivateMember.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { toast } from "react-toastify";
import { queryClient } from "@/api/QueryClient";

// Define the payload type, which is just the member ID
interface ActivatePayload {
  memberId: string;
}

export default function useActivateMember() {
  const http = useHttp();

  const mutation = useMutation({
    mutationFn: async (payload: ActivatePayload) =>
      http.put<any>(`/user/activate/${payload.memberId}`, {}), // Adjust API endpoint as needed
    onSuccess: () => {
      toast.success("Team member activated successfully!");
      // You can add logic to invalidate queries for the team list
   queryClient.invalidateQueries({ queryKey: ['membersTable'] })
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred during activation.");
    },
  });

  return {
    activateMember: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
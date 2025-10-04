// src/hooks/useEditMember.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { useHttp } from "@/utils/useHttp";
import apiClient from "@/api/APIClient";
import { EditMemberPayload, ErrorResponse } from "@/utils/types"; 
// Define the response type from your API for an update
interface EditMemberResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // ... other fields the API returns
}

export default function useEditMember() {
  const queryClient = useQueryClient();
  const http = useHttp();

  const editMemberMutation = useMutation<
    EditMemberResponse,
    AxiosError<ErrorResponse>,
    EditMemberPayload
  >({
    mutationFn: async (updatedMemberData) => {
      // The API call for editing requires the member ID in the URL
      const { id, ...payload } = updatedMemberData;
      return apiClient.put(
        `${ApiRoutes.adminUser}/${id}`, // Assuming this is your PATCH endpoint
        payload
      );
    },
    onSuccess: (data) => {
      toast.success("Team member updated successfully!");
      // Invalidate the query for the team members list to refetch fresh data
        queryClient.invalidateQueries({ 
        queryKey: ['membersTable'],
        exact: false // This ensures all queries starting with 'membersTable' are invalidated
      }); },
    onError: (error) => {
      toast.error(error.message || "Failed to update team member.");
    },
  });

  return {
    editMember: editMemberMutation.mutate,
    isLoading: editMemberMutation.isPending,
    isSuccess: editMemberMutation.isSuccess,
    isError: editMemberMutation.isError,
    error: editMemberMutation.error,
  };
}
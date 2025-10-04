"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks"; // Assuming these are your Redux hooks
import { handleErrors } from "@/utils/functions"; // Utility for error handling
import { AddMemberPayload, ErrorResponse } from "@/utils/types"; // Assuming ErrorResponse type
import { useHttp } from "@/utils/useHttp"; // Your custom HTTP client hook
import { ApiRoutes } from "@/utils/ApiRoutes"; // Your API routes definitions
import { useRouter } from "next/navigation";
import { UserRole } from "@/utils/types"; // Import UserRole from your types/enums
import { toast } from "react-toastify";
import apiClient from "@/api/APIClient";

interface AddMemberResponse {
  id: string; // Assuming the API returns the ID of the newly created user
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole; // The API might return 'role' instead of 'userRole'
  // ... any other fields the API returns upon successful creation
}

export default function useAddMember() {
  const http = useHttp(); // You can use this instead of apiClient if it's your intended pattern
  const router = useRouter();
  const dispatch = useAppDispatch(); // If you need to dispatch anything after success
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: async (newMemberData: AddMemberPayload) => {
      // The crucial fix is to RETURN the promise from the API call.
      // Additionally, using 'await' makes the code clearer.
      newMemberData.isBusiness = false;
      const response = await apiClient.post<AddMemberResponse>(
        ApiRoutes.addNewMember,
        newMemberData
      );
      return response.data; // Return the data from the response to the onSuccess handler
    },
    onSuccess: (data) => {
      // 'data' here is the response data returned from mutationFn
      toast.success("Team member added successfully!");
      // Optionally, you can perform actions like routing or refetching
      // router.push("/team-members");
       queryClient.invalidateQueries({ 
        queryKey: ['membersTable'],
        exact: false
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // Check if the error is an AxiosError and has a response
      const errorMessage =
        error.response?.data?.message|| error.response?.data?.ERR_CODE ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    },
  });

  return {
    addMember: addMemberMutation.mutate,
    isLoading: addMemberMutation.isPending,
    isSuccess: addMemberMutation.isSuccess,
    isError: addMemberMutation.isError,
    error: addMemberMutation.error,
  };
}
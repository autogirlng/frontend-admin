// src/hooks/useAddMember.ts (or wherever you prefer to place your hooks)
"use client";

import { useMutation } from "@tanstack/react-query";
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
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch(); // If you need to dispatch anything after success

  const addMemberMutation = useMutation({
    mutationFn: async (newMemberData: AddMemberPayload) => 
  
      apiClient.post<AddMemberResponse>(ApiRoutes.addNewMember, newMemberData),
    onSuccess: (data) => {
      toast.success("Team member added successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
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

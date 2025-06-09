// src/hooks/useAddMember.ts (or wherever you prefer to place your hooks)
"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks"; // Assuming these are your Redux hooks
import { handleErrors } from "@/utils/functions"; // Utility for error handling
import {
  AddMemberPayload,
  ChangeRolePayload,
  ErrorResponse,
} from "@/utils/types"; // Assuming ErrorResponse type
import { useHttp } from "@/utils/useHttp"; // Your custom HTTP client hook
import { ApiRoutes } from "@/utils/ApiRoutes"; // Your API routes definitions
import { useRouter } from "next/navigation";
import { UserRole } from "@/utils/types"; // Import UserRole from your types/enums
import { toast } from "react-toastify";

interface ChangeRoleResponse {
  id: string; // Assuming the API returns the ID of the newly created user
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export default function useChangeRole() {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user); // Assuming auth slice has user info

  const mutation = useMutation({
    mutationFn: async (changeRole: ChangeRolePayload) =>
      http.put<ChangeRoleResponse>(ApiRoutes.changeRole, changeRole),
    onSuccess: (data) => {
      toast.success("Team member added successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    changeRole: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

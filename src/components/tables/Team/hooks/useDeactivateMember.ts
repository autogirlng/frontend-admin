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

export default function useDeactivateMember() {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch(); // If you need to dispatch anything after success
  const { user } = useAppSelector((state) => state.user); // Assuming auth slice has user info

  const mutation = useMutation({
    mutationFn: async (deactivateMember: any) =>
      http.put<any>(ApiRoutes.deactivateMember, deactivateMember),
    onSuccess: (data) => {
      toast.success("Team member added successfully!");
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

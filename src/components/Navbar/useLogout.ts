"use client";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/utils/types";
import { handleErrors } from "@/utils/functions";
import { AxiosError } from "axios";
import { clearUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { LocalRoute } from "@/utils/LocalRoutes";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logoutUser = () => {
    dispatch(clearUser());
    router.push(LocalRoute.login);
  };

  return {
    logoutUser,
  };
}

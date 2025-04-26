"use client";

import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/utils/types";
import { handleErrors } from "@/utils/functions";
import { AxiosError } from "axios";
import { clearUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logoutUser = () => {
    dispatch(clearUser());
    router.push("/login");
  };

  //   const logoutUser = useMutation({
  //     mutationFn: () => http.put("/api/user/logout"),

  //     onSuccess: (data) => {
  //       console.log("User logged out Successfully", data.data);
  //       dispatch(clearUser());
  // router.push("/login");
  //     },

  //     onError: (error: AxiosError<ErrorResponse>) => {
  //       handleErrors("Logout", error);
  //     },
  //   });

  return {
    logoutUser,
  };
}

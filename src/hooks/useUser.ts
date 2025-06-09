"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUser, setUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useHttp } from "@/utils/useHttp";
import { User } from "@/utils/types";

export default function useUser() {
  const http = useHttp();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    const user_token = window.localStorage.getItem("user_token");
    setUserToken(user_token || "");

    if (!user_token) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => http.get<User>("/api/user"),
    enabled: !!userToken,
    retry: 1,
  });

  // const { data, isError, isLoading } = useQuery({
  //   queryKey: ["getUser"],
  //   queryFn: () => http.get<User>(`/api/user`),
  //   enabled: !!userToken,retry: 1,
  // });

  useEffect(() => {
    if (getUser.isSuccess) {
      console.log("User data fetched successfully", getUser.data);
      dispatch(
        setUser({
          // @ts-ignore
          user: getUser.data,
          userToken: userToken || "",
          isAuthenticated: true,
          isLoading: false,
        })
      );
    }

    if (getUser.isError) {
      console.log("Error fetching user", getUser.error);
      dispatch(clearUser());
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser.isError, getUser.isSuccess]);

  return {
    getUser,
    user_token: userToken,
  };
}

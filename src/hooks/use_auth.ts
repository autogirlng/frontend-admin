"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/hooks";
import {
  setToken,
  setUser,
  setLoading,
  clearUser,
} from "@/lib/features/userSlice";
import {
  loginUser,
  LoginRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  forgotPassword,
  resetNewPassword,
} from "@/service/AuthService";
import { LocalRoute } from "@/utils/LocalRoutes";
import { User } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ApiRoutes } from "@/utils/ApiRoutes";

interface APIError {
  message?: string;
}

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const http = useHttp();

  const [token, setClientToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Ensure running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initial token check (only once)
  useEffect(() => {
    if (isClient && !hasCheckedAuth) {
      const storedToken = localStorage.getItem("user_token");
      setClientToken(storedToken);
      setHasCheckedAuth(true);

      console.log(storedToken);
      if (!storedToken && pathname !== LocalRoute.login) {
        router.push(LocalRoute.login);
      }
    }
  }, [isClient, hasCheckedAuth, router, pathname]);

  // Token expiration checker
  const checkTokenExpiration = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload & { exp?: number }>(token);
        if (decodedToken?.exp) {
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            dispatch(clearUser());
            localStorage.removeItem("user_token");
            router.push(LocalRoute.login);
            toast.warn("Your session has expired. Please log in again.");
          }
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        dispatch(clearUser());
        localStorage.removeItem("user_token");
        router.push(LocalRoute.login);
        toast.error("Invalid session. Please log in again.");
      }
    }
  };

  useEffect(() => {
    if (isClient && token) {
      checkTokenExpiration();
      const intervalId = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(intervalId);
    }
  }, [token, isClient]);

  // Fetch user data
  const {
    isLoading: isUserLoading,
    isError: isUserError,
    data: userData,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => http.get<User>(ApiRoutes.getUser),
    retry: false,
    enabled: isClient && !!token,
  });

  useEffect(() => {
    if (isClient && userData) {
      dispatch(
        setUser({
          user: userData,
          userToken: token || "",
          isAuthenticated: !!token,
          isLoading: false,
        })
      );
    } else if (isClient && isUserError && token) {
      dispatch(clearUser());
      localStorage.removeItem("user_token");
      router.push(LocalRoute.login);
      toast.error("Your session might be invalid. Please log in again.");
      dispatch(setLoading(false));
    } else if (isClient && isUserLoading) {
      dispatch(setLoading(true));
    }
  }, [userData, isUserError, isUserLoading, dispatch, router, token, isClient]);

  // Login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data) => {
      localStorage.setItem("user_token", data);
      dispatch(setToken(data));
      setClientToken(data);
      router.push(LocalRoute.dashboardPage);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as APIError)?.message || "Invalid email or password.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Forgot Password
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onSuccess: (response, variables) => {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      router.push(`${LocalRoute.otpSentPage}?email=${variables.email}`);
    },
    onError: (error: unknown) => {
      const errorMessage = (error as APIError)?.message || "Invalid email.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetNewPassword(data),
    onSuccess: (response) => {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      router.push(LocalRoute.login);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as APIError)?.message || "Failed to reset password.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  return {
    login: loginMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isLoading: loginMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isUserLoading,
  };
}

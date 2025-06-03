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
import { useCallback, useEffect, useState } from "react";
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

  const [isClient, setIsClient] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Get token from localStorage (client-side only)
  const token = isClient ? localStorage.getItem("user_token") : null;

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initial auth check
  useEffect(() => {
    if (isClient && !hasCheckedAuth) {
      setHasCheckedAuth(true);

      if (!token && !pathname.includes(LocalRoute.login)) {
        router.push(LocalRoute.login);
      }
    }
  }, [isClient, hasCheckedAuth, token, pathname, router]);

  // Token expiration checker
  const checkTokenExpiration = useCallback(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload & { exp?: number }>(token);
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        dispatch(clearUser());
        localStorage.removeItem("user_token");
        router.push(LocalRoute.login);
        toast.warn("Session expired. Please log in again.");
      }
    } catch (error) {
      console.error("Token decode error:", error);
      dispatch(clearUser());
      localStorage.removeItem("user_token");
      router.push(LocalRoute.login);
      toast.error("Invalid session. Please log in.");
    }
  }, [token, dispatch, router]);

  // Setup token expiration checker
  useEffect(() => {
    if (!isClient || !token) return;

    checkTokenExpiration(); // Immediate check
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [isClient, token, checkTokenExpiration]);

  // User data query
  const {
    isLoading: isUserLoading,
    isError: isUserError,
    data: userData,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: () => http.get<User>(ApiRoutes.getUser),
    retry: false,
    enabled: isClient && hasCheckedAuth && !!token,
  });

  // Handle user data changes
  useEffect(() => {
    if (!isClient) return;

    if (userData) {
      dispatch(
        setUser({
          user: userData,
          userToken: token || "",
          isAuthenticated: !!token,
          isLoading: false,
        })
      );
    } else if (isUserError && token) {
      handleAuthError();
    } else if (isUserLoading) {
      dispatch(setLoading(true));
    }
  }, [userData, isUserError, isUserLoading, dispatch, token, isClient]);

  const handleAuthError = useCallback(() => {
    dispatch(clearUser());
    localStorage.removeItem("user_token");
    router.push(LocalRoute.login);
    toast.error("Authentication failed. Please log in again.");
    dispatch(setLoading(false));
  }, [dispatch, router]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: (token) => {
      localStorage.setItem("user_token", token);
      dispatch(setToken(token));
      router.push(LocalRoute.dashboardPage);
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      router.push(`${LocalRoute.otpSentPage}?email=${variables.email}`);
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Password reset request failed.");
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetNewPassword(data),
    onSuccess: (response) => {
      toast.success(response.message);
      router.push(LocalRoute.login);
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Password reset failed.");
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

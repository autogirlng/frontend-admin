import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  loginUser,
  LoginRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  forgotPassword,
  resetNewPassword,
} from "../service/AuthService";
import { LocalRoute } from "../utils/LocalRoutes";

interface APIError {
  message?: string;
}

export function useAuth() {
  const router = useRouter();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data) => {
      localStorage.setItem("authToken", data);
      router.push("/");
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

  // Forgot Password Mutation
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

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetNewPassword(data),
    onSuccess: (response) => {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/auth/login"); // Redirect to login after reset
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
  };
}

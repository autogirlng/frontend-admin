import { AxiosError } from "axios";
import apiClient from "@/api/APIClient";
import { ApiRoutes } from "@/utils/ApiRoutes";
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function loginUser(credentials: LoginRequest): Promise<string> {
  try {
    const { data } = await apiClient.post<string>(ApiRoutes.login, credentials);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Invalid email or password"
    );
  }
}

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<{ message: string }> {
  try {
    const response = await apiClient.post<{ message: string }>(
      ApiRoutes.forgotPassword,
      data
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        "Failed to send reset password email"
    );
  }
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
}

export async function resetNewPassword(
  data: ResetPasswordRequest
): Promise<{ message: string }> {
  try {
    const { data: response } = await apiClient.post<{ message: string }>(
      `/auth/reset-password/`,
      data
    );
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to reset password"
    );
  }
}

import { useMemo } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { baseUrl } from "./ApiRoutes";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse } from "@/utils/types";
import { clearUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { LocalRoute } from "./LocalRoutes";

export const useHttp = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const http = useMemo(() => {
    return axios.create({
      baseURL: baseUrl,
      timeout: 20000,
    });
  }, []);

  http.interceptors.request.use((config) => {
    const token = localStorage.getItem("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleAuthError = (error: AxiosError<ErrorResponse>) => {
    if (
      error?.response?.status === 401 ||
      error?.response?.data?.ERR_CODE === "NOT_PERMITTED_REAUTHENICATE"
    ) {
      dispatch(clearUser());
      router.push(LocalRoute.login);
      return true;
    }
    return false;
  };

  return {
    get: async <T>(url: string) => {
      try {
        const response = await http.get<T>(url);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },

    post: async <T>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig<any>
    ) => {
      try {
        const response = await http.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message ?? error.message);
        }
        throw error;
      }
    },

    put: async <T>(
      url: string,
      data?: any,
      retries: number = 2
    ): Promise<T> => {
      const makeRequest = async (attempt: number): Promise<T> => {
        try {
          const response = await http.put<T>(url, data, {
            timeout: 30000,
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            if (handleAuthError(error)) return Promise.reject(error);
            if (
              (error.code === "ECONNABORTED" || !error.response) &&
              attempt < retries
            ) {
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * attempt)
              );
              return makeRequest(attempt + 1);
            }
            handleErrors(error);
            throw new Error(error.response?.data.message ?? error.message);
          }
          throw error;
        }
      };

      return makeRequest(0);
    },

    delete: async <T>(url: string) => {
      try {
        const response = await http.delete<T>(url);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (handleAuthError(error)) return;
          handleErrors(error);
          throw new Error(error.response?.data.message);
        }
        throw error;
      }
    },
  };
};

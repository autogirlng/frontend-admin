import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: object | null;
}

interface ApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApi<T>() {
  const router = useRouter();
  const [apiState, setApiState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const request = useCallback(
    async (endpoint: string, config: RequestConfig = {}) => {
      setApiState({
        data: null,
        error: null,
        isLoading: true,
      });

      try {
        const token = localStorage.getItem("authToken");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(config.headers as Record<string, string>),
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            method: config.method || "GET",
            headers,
            body: config.body ? JSON.stringify(config.body) : null,
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authToken");
          router.push("/login?session_expired=true");
          throw new Error("Session expired. Please log in again.");
        }

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || "An unknown API error occurred."
          );
        }

        setApiState({
          data: responseData as T,
          error: null,
          isLoading: false,
        });
      } catch (error: any) {
        setApiState({
          data: null,
          error: error.message,
          isLoading: false,
        });
      }
    },
    [router]
  );

  return { ...apiState, request };
}

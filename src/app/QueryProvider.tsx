"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: (error: any) => {
              toast.error(error.message || "An unexpected error occurred");
              if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
              ) {
                signOut({ callbackUrl: "/login?session_expired=true" });
              }
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

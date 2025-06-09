"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { Dashboard } from "@/types/Dashboard";

export default function useDashboard({
  filters,
}: {
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["dashboard", user?.id, filters],

    queryFn: async () =>
      http.get<Dashboard>(`${ApiRoutes.getDashboard}?timeFilter=all`),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    data: data || ({} as Dashboard),
    isError,
    isLoading,
    isSuccess,
  };
}

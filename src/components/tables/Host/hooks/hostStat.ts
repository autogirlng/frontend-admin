"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { HostStatistics } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
type fleetStat = {
  metrics: HostStatistics;
  totalCount: number;
};

export default function useHostStats({
  filters,
}: {
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();

  const { userToken, user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["hostStatistics", userToken],
    queryFn: () => http.get<fleetStat>(ApiRoutes.getFleet),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    isError,
    isLoading,
    data: data?.metrics || {
      totalHost: 0,
      activeHost: 0,
      inactiveHost: 0,
      blockedHost: 0,
    },
  };
}

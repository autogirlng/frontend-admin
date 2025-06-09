"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { HostStatistics } from "@/utils/types"; // Assuming this type matches your desired output
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

// Define the exact shape of the data coming from your API
type ApiHostStatsResponse = {
  totalHosts: number;
  activeHosts: number;
  inactiveHosts: number;
  blockedHosts: number;
  onboardingDistribution: {
    selfOnboarded: number;
    adminOnboarded: number;
  };
};

export default function useHostStats({
  filters,
}: {
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { userToken, user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    // Specify the type for the data directly
    queryKey: ["hostStatistics", userToken],
    queryFn: async () => {
      const response = await http.get<HostStatistics>(ApiRoutes.getAllHostStat);

      return response;
    },
    enabled: !!user?.id,
    retry: false,
  });

  return {
    isError,
    isLoading,
    data: data || ({} as HostStatistics),
  };
}

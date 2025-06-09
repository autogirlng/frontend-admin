"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import {
  VehicleOnboardingStatistics,
  VehicleOnboardingTable,
} from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
type vehicleOnboardingStatsTable = {
  metrics: VehicleOnboardingStatistics;
  totalCount: number;
};

export default function useVehicleOnboardingStats() {
  const http = useHttp();
  const { userToken, user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getVehicleOnboardingStats", userToken],
    queryFn: () =>
      http.get<vehicleOnboardingStatsTable>(ApiRoutes.vehicleOnboardingTable),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    isError,
    isLoading,
    data: data?.metrics || {
      totalListings: 0,
      approved: 0,
      rejected: 0,
      inReview: 0,
      drafts: 0,
    },
  };
}

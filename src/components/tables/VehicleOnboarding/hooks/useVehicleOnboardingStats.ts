"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { VehicleOnboardingStatistics } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

export default function useVehicleOnboardingStats() {
  const http = useHttp();
  const { userToken, user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getVehicleOnboardingStats", userToken],
    queryFn: () =>
      http.get<VehicleOnboardingStatistics>(ApiRoutes.vehicleOnboardingStats),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    isError,
    isLoading,

    data,
  };
}

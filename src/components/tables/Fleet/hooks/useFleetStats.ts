"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { FleetStatistics } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
type fleetStat = {
  metrics: FleetStatistics;
  totalCount: number;
};

export default function useFleetStats() {
  const http = useHttp();
  const { userToken, user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getVehicleOnboardingStats", userToken],
    queryFn: () => http.get<fleetStat>(ApiRoutes.getFleet),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    isError,
    isLoading,
    data: data?.metrics || {
      totalVehicles: 0,
      activeVehicles: 0,
      inactiveVehicles: 0,
      vehiclesInMaintenance: 0,
      suspendedVehicles: 0,
    },
  };
}

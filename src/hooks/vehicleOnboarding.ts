"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { VehicleInformation } from "@/utils/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { useHttp } from "@/utils/useHttp";

export default function useVehicleOnboarding() {
  const dispatch = useAppDispatch();
  const routeParams = useSearchParams();
  const vehicleId = routeParams.get("id");

  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getVehicleById"],
    queryFn: () =>
      http.get<VehicleInformation>(
        `${ApiRoutes.vehicleOnboarding}/${vehicleId}`
      ),
    enabled: !!user?.id && !!vehicleId,
    retry: false,
  });
  useEffect(() => {
    if (isSuccess) {
      console.log("Get Vehicle Information By Id", data);
      // @ts-ignore
      dispatch(updateVehicleInformation(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  return {
    data,
    isError,
    isLoading,
  };
}

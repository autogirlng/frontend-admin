"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { VehicleOnboardingTable } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { handleFilterQuery } from "@/utils/functions";
import { ApiRoutes } from "@/utils/ApiRoutes";

type vehicleOnboardingTable = {
  data: VehicleOnboardingTable[];
  total: number;
  pageSize: number;
  totalPages: number;
};

export default function useVehicleOnboardingTable({
  currentPage = 1,
  pageLimit = 10,
  search,
  filters = {},
}: {
  currentPage: number;
  pageLimit: number;
  search?: string;
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: [
      "vehicleOnboardingTable",
      user?.id,
      currentPage,
      search,
      filters,
    ],

    queryFn: async () =>
      http.get<vehicleOnboardingTable>(
        `${ApiRoutes.vehicleOnboardingTable}?${handleFilterQuery({
          filters,
        })}&search=${search}&page=${currentPage}`
      ),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    data: data?.data || [],
    isError,
    isLoading,
    isSuccess,
    totalCount: data?.total || 0,
    pageSize: data?.pageSize || 0,
    totalPages: data?.totalPages || 0,
  };
}

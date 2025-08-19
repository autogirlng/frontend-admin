"use client";

import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "@/lib/hooks";
import { Member } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { handleFilterQuery } from "@/utils/functions";
import { ApiRoutes } from "@/utils/ApiRoutes";

type teamTable = {
  data: Member[];
  total: number;
  pageSize: number;
  totalPages: number;
};

export default function useTeamTable({
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

  const { data, isError, isLoading, isSuccess,refetch } = useQuery({
    queryKey: ["membersTable", user?.id, currentPage, search, filters],

    queryFn: async () =>
      http.get<teamTable>(
        `${ApiRoutes.getAllAdminTeam}?${handleFilterQuery({
          filters,
        })}&search=${search}&page=${currentPage}&limit=${pageLimit}`
      ),
    enabled: !!user?.id,
    retry: false,
  });
  console.log(data?.data);
  return {
    data: data?.data || [],
    isError,
    isLoading,
    isSuccess,
    refetch,
    totalCount: data?.total || 0,
    pageSize: data?.pageSize || 0,
    totalPages: data?.totalPages || 0,
  };
}

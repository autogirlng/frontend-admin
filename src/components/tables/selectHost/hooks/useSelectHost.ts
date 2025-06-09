"use client";
import { HostTable } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

type selectHostTable = {
  data: HostTable[];
  total: number;
  pageSize: number;
  totalPages: number;
};

export default function useSelectHostTable({
  currentPage = 1,
  pageLimit = 10,
  search,
}: // filters = {},
{
  currentPage: number;
  pageLimit: number;
  search?: string;
  // filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: [
      "selectHost",
      user?.id,
      currentPage,
      search,
      // filters,
    ],

    queryFn: async () =>
      http.get<selectHostTable>(
        `${ApiRoutes.getAllHost}?&limit=10&page=${currentPage}`
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

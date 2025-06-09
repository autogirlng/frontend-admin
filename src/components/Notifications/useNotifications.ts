"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useHttp } from "@/utils/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { CalendarValue, Notification } from "@/utils/types";
import { handleFilterQuery } from "@/utils/functions";
import { ApiRoutes } from "../../utils/ApiRoutes";

type NotificationDataType = {
  data: Notification[];
  totalCount: number;
  unreadCount: number;
};

export default function useNotifications({
  currentPage,
  pageLimit,
  filters = null,
}: {
  currentPage: number;
  pageLimit: number;
  filters?: CalendarValue;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const formatDate = (date: Date | null): string => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const { startDate, endDate } = useMemo(() => {
    const startDate =
      filters && Array.isArray(filters) ? formatDate(filters[0] as Date) : "";
    const endDate =
      filters && Array.isArray(filters) && filters[1]
        ? formatDate(
            new Date(
              (filters[1] as Date).setDate((filters[1] as Date).getDate() - 1)
            )
          )
        : "";
    return { startDate, endDate };
  }, [filters]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getNotifications", currentPage, pageLimit, startDate, endDate],
    queryFn: () =>
      http.get<NotificationDataType>(
        `${
          ApiRoutes.notification
        }?page=${currentPage}&limit=${pageLimit}&${handleFilterQuery({
          filters: {},
          startDate,
          endDate,
        })}`
      ),
    enabled: !!user?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    notifications: data?.data ?? [],
    totalCount: data?.totalCount ?? 0,
    totalUnread: data?.unreadCount ?? 0,
    isError,
    isLoading,
  };
}

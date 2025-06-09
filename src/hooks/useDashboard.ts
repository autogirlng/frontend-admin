"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { Dashboard } from "@/types/Dashboard";

export default function useDashboard({
  filters,
}: {
  // Now strictly accepts Record<string, string>
  filters?: Record<string, string>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const formatFiltersForApi = (
    filters: Record<string, string> | undefined
  ): string => {
    if (!filters || Object.keys(filters).length === 0) {
      return "";
    }

    const params = new URLSearchParams();

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key];
        // Directly append single string values
        params.append("timeFilter", value);
      }
    }
    return params.toString();
  };

  const formattedFilterParams = formatFiltersForApi(filters);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["dashboard", user?.id, formattedFilterParams],

    queryFn: async () => {
      // Append the formatted filters to the API route
      const url = `${ApiRoutes.getDashboard}?${
        formattedFilterParams ? `${formattedFilterParams}&` : ""
      }`;
      console.log("Fetching dashboard data with URL:", url);
      return http.get<Dashboard>(url);
    },
    enabled: !!user?.id,
    retry: false,
  });

  return {
    data: data || ({} as Dashboard),
    isError,
    isLoading,
    isSuccess,
  };
}

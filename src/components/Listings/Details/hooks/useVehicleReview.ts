"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/utils/useHttp";
import { Review } from "@/utils/types";

type ReviewsDataType = {
  data: Review[];
  totalCount: number;
};

export default function useVehicleReview({
  id,
  currentPage = 1,
  pageLimit = 10,
}: {
  id: string;
  currentPage: number;
  pageLimit: number;
}) {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getVehicleReviews", user?.id, id],

    queryFn: () =>
      http.get<ReviewsDataType>(
        `/reviews/findonebooking/${id}?page=${currentPage}&limit=${pageLimit}`
      ),
    enabled: !!user?.id && !!id,
    retry: false,
  });

  return {
    vehicleReviews: data?.data || [],
    totalCount: data?.totalCount || 0,
    isError,
    isLoading,
  };
}

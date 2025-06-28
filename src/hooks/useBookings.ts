import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { Booking } from "@/utils/types";

export interface UseBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BookingResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function useBookings({ page = 1, limit = 10, search = "" }: UseBookingsParams) {
  const http = useHttp();

  return useQuery<BookingResponse, Error>({
    queryKey: ["bookings", page, limit, search],
    queryFn: async () => {
      const response = await http.get<BookingResponse>(
        `/admin/booking/list?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      if (!response) throw new Error("No data received from bookings API");
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev, // Keep previous data while fetching new
  });
} 
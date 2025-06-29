import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { Booking } from "@/utils/types";

export interface UseBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  timeFilter?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
}

export interface BookingResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function useBookings({ page = 1, limit = 10, search = "", timeFilter = "all", startDate, endDate, status }: UseBookingsParams) {
  const http = useHttp();

  return useQuery<BookingResponse, Error>({
    queryKey: ["bookings", page, limit, search, timeFilter, startDate, endDate, status],
    queryFn: async () => {
      let url = `/admin/booking/list?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      if (timeFilter && timeFilter !== 'all') {
        url += `&timeFilter=${timeFilter}`;
      } else {
        url += `&timeFilter=all`;
      }
      if (startDate) {
        url += `&startDate=${encodeURIComponent(startDate.toISOString())}`;
      }
      if (endDate) {
        url += `&endDate=${encodeURIComponent(endDate.toISOString())}`;
      }
      if (status) {
        url += `&status=${status}`;
      }
      const response = await http.get<BookingResponse>(url);
      if (!response) throw new Error("No data received from bookings API");
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev, // Keep previous data while fetching new
  });
} 
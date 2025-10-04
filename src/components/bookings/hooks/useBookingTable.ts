import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";

interface BookingApiResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type { BookingApiResponse };
export default function useBookingTable({
  page = 1,
  limit = 10,
  search = "",
  timeFilter = "all",
  startDate,
  endDate,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  timeFilter?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string | null;
}) {
  const http = useHttp();

  const queryKey = ["bookings", page, limit, search, timeFilter, startDate, endDate, status];

  const fetchBookings = async () => {
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
    const response = await http.get<BookingApiResponse>(url);
    return response || { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };
  };

  const { data, isLoading, error, isSuccess, isFetching } = useQuery({
    queryKey,
    queryFn: fetchBookings,
    staleTime: Infinity, // Keep data fresh forever to prevent refetches
    placeholderData: (prev) => prev,
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });

  return {
    data,
    isLoading,
    error,
    isSuccess,
    isFetching,
  };
} 
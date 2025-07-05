import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { Customers } from "@/types";

export default function useCustomerTable({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string }) {
  const http = useHttp();

  const queryKey = ["customers", page, limit, search];

  const fetchCustomers = async () => {
    return await http.get<Customers>(
      `/user/all?limit=${limit}&page=${page}&userRole=CUSTOMER&search=${search}`
    );
  };

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchCustomers,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  return {
    customers: data?.data || [],
    totalCount: data?.totalCount || 0,
    limit: data?.limit || limit,
    isLoading,
    error,
  };
} 
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  Customer,
  PaginatedResponse,
} from "@/components/dashboard/customer-management/types";

const CUSTOMERS_QUERY_KEY = "customers";

export function useGetCustomers(page: number, searchTerm: string) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: [CUSTOMERS_QUERY_KEY, page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }

      const endpoint = `/admin/users/customers?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Customer>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  totalBookings: number;
  active: boolean;
}

export interface CustomersData {
  content: Customer[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const useGetCustomers = (
  searchTerm: string = "",
  page: number = 0,
  size: number = 10
) => {
  return useQuery<CustomersData, Error>({
    queryKey: ["customers", searchTerm, page, size],
    queryFn: () =>
      apiClient.get<CustomersData>(
        `/admin/users/customers?searchTerm=${searchTerm}&page=${page}&size=${size}`
      ),
  });
};

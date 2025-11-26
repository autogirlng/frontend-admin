"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  PaginatedResponse,
  AdminUser,
  CreateAdminPayload,
  Customer,
  Host,
  AdminUserDetail,
} from "@/components/settings/staffs/types";

export const ADMINS_QUERY_KEY = "admins";
export const ADMIN_DETAIL_KEY = "adminDetail";
export const CUSTOMERS_SEARCH_KEY = "customersSearch";
export const HOSTS_SEARCH_KEY = "hostsSearch";

export function useGetAdmins(page: number, searchTerm: string) {
  return useQuery<PaginatedResponse<AdminUser>>({
    queryKey: [ADMINS_QUERY_KEY, page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      const endpoint = `/admin/users/admins?${params.toString()}`;
      return apiClient.get<PaginatedResponse<AdminUser>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetAdminDetails(adminId: string | null) {
  return useQuery<AdminUserDetail, Error>({
    queryKey: [ADMIN_DETAIL_KEY, adminId],
    queryFn: () =>
      apiClient.get<AdminUserDetail>(`/admin/users/admins/${adminId}`),
    enabled: !!adminId,
  });
}

export function useGetCustomersForPromotion(searchTerm: string) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: [CUSTOMERS_SEARCH_KEY, searchTerm],
    queryFn: () =>
      apiClient.get(
        `/admin/users/customers?page=0&size=5&searchTerm=${searchTerm}`
      ),
    enabled: searchTerm.length > 2,
  });
}

export function useGetHostsForPromotion(searchTerm: string) {
  return useQuery<PaginatedResponse<Host>>({
    queryKey: [HOSTS_SEARCH_KEY, searchTerm],
    queryFn: () =>
      apiClient.get(
        `/admin/users/hosts?page=0&size=5&searchTerm=${searchTerm}`
      ),
    enabled: searchTerm.length > 2,
  });
}

export function useUpdateAdminStatus() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { userId: string; isActive: boolean }>({
    mutationFn: ({ userId, isActive }) =>
      apiClient.patch(`/admin/users/${userId}/status`, { isActive }),
    onSuccess: (_, { isActive }) => {
      toast.success(
        `Admin status updated to ${isActive ? "ACTIVE" : "INACTIVE"}`
      );
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update status."),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation<AdminUser, Error, CreateAdminPayload>({
    mutationFn: (payload) => apiClient.post("/admin/users/admins", payload),
    onSuccess: () => {
      toast.success("Admin account created successfully.");
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) => toast.error(error.message || "Failed to create admin."),
  });
}

export function usePromoteUserToAdmin() {
  const queryClient = useQueryClient();
  return useMutation<AdminUser, Error, string>({
    mutationFn: (userId: string) =>
      apiClient.patch(`/admin/users/${userId}/promote-to-admin`, {}),
    onSuccess: () => {
      toast.success("User successfully promoted to ADMIN.");
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["customers"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["hosts"],
        exact: false,
      });
    },
    onError: (error) => toast.error(error.message || "Failed to promote user."),
  });
}

export function useResendCredentials() {
  return useMutation<unknown, Error, string>({
    mutationFn: (adminId: string) =>
      apiClient.post(`/admin/users/admins/${adminId}/resend-credentials`, {}),
    onSuccess: () => {
      toast.success("New login credentials sent successfully.");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to resend credentials."),
  });
}

export function useDownloadCredentials() {
  return useMutation<unknown, Error, { adminId: string; adminName: string }>({
    mutationFn: async ({ adminId, adminName }) => {
      await apiClient.postAndDownloadFile(
        `/admin/users/admins/${adminId}/download-credentials`,
        {},
        `${adminName}-credentials.pdf`
      );
      return null;
    },
    onSuccess: () => {
      toast.success("Credentials downloading...");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to download credentials."),
  });
}

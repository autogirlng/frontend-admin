// lib/hooks/notifications/useNotificationsList.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  PaginatedResponse,
  NotificationItem,
  ApiPaginatedResponse,
} from "@/components/notifications/types"; // Adjust path

// --- Query Keys ---
export const NOTIFICATIONS_LIST_KEY = "notificationsList";

// 1. GET Notifications List (Unchanged)
export function useNotificationsList(page: number, size: number = 10) {
  const { data: session } = useSession();

  return useQuery<PaginatedResponse<NotificationItem>, Error>({
    queryKey: [NOTIFICATIONS_LIST_KEY, page, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));

      const endpoint = `/notification/notification-by-user?${params.toString()}`;
      const apiResponse = await apiClient.get<
        ApiPaginatedResponse<NotificationItem>
      >(endpoint);

      const adaptedResponse: PaginatedResponse<NotificationItem> = {
        content: apiResponse.content,
        currentPage: apiResponse.page,
        pageSize: apiResponse.size,
        totalItems: apiResponse.totalElements,
        totalPages: apiResponse.totalPages,
      };
      return adaptedResponse;
    },
    enabled: !!session,
    placeholderData: (previousData) => previousData,
  });
}

// ✅ 2. NEW: Mark Single Notification as Read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (notificationId: string) =>
      apiClient.patch(`/notification/${notificationId}`, {}),
    onSuccess: () => {
      // Invalidate to refresh list and unread count
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_LIST_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as read.");
    },
  });
}

// ✅ 3. NEW: Delete Notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (notificationId: string) =>
      apiClient.delete(`/notification/${notificationId}`),
    onSuccess: () => {
      toast.success("Notification deleted.");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_LIST_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete notification.");
    },
  });
}

// ✅ 4. NEW: Mark All as Read
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, void>({
    mutationFn: () => apiClient.patch(`/notification/read-all`, {}),
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_LIST_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark all as read.");
    },
  });
}

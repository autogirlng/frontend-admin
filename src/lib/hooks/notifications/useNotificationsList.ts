import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import { useSession } from "next-auth/react";
import {
  PaginatedResponse,
  NotificationItem,
  ApiPaginatedResponse,
} from "@/components/notifications/types";

// --- Query Key ---
const NOTIFICATIONS_LIST_KEY = "notificationsList";

/**
 * Fetches a paginated list of historical notifications for the current user.
 * @param page - The current page number (0-indexed)
 * @param size - The number of items per page
 */
export function useNotificationsList(page: number, size: number = 10) {
  const { data: session } = useSession();

  return useQuery<PaginatedResponse<NotificationItem>, Error>({
    queryKey: [NOTIFICATIONS_LIST_KEY, page, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));
      // Add other filters if needed (e.g., read status)

      const endpoint = `/notification/notification-by-user?${params.toString()}`;

      // Fetch the data using the API structure
      const apiResponse = await apiClient.get<
        ApiPaginatedResponse<NotificationItem>
      >(endpoint);

      // Adapt the API response to your standard PaginatedResponse structure
      const adaptedResponse: PaginatedResponse<NotificationItem> = {
        content: apiResponse.content,
        currentPage: apiResponse.page,
        pageSize: apiResponse.size,
        totalItems: apiResponse.totalElements,
        totalPages: apiResponse.totalPages,
      };
      return adaptedResponse;
    },
    // Only run the query if the user is authenticated
    enabled: !!session,
    placeholderData: (previousData) => previousData, // Keep data while fetching next page
  });
}

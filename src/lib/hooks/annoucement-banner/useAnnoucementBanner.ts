"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  BannerResponse,
  CreateBannerPayload,
  GetBannerResponse,
} from "@/components/dashboard/announcement-banner/types";

export const ANNOUNCEMENT_BANNER_QUERY_KEY = "announcementBanner";

export function useGetAnnouncementBanner() {
  return useQuery<GetBannerResponse, Error>({
    queryKey: [ANNOUNCEMENT_BANNER_QUERY_KEY],
    queryFn: () => apiClient.get<GetBannerResponse>("/banner"),
  });
}

export function useCreateAnnouncementBannerContent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateBannerPayload>({
    mutationFn: (payload) => apiClient.post<BannerResponse>("/banner", payload),
    onSuccess: () => {
      toast.success("Announcement banner content created successfully.");
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_BANNER_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create announcement banner content.",
      );
    },
  });
}

export function useDeleteAnnouncementBannerContent(bannerId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, void>({
    mutationFn: () => apiClient.delete<void>(`/banner/${bannerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_BANNER_QUERY_KEY],
      });
      toast.success("Announcement Banner content deleted successfully.");
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to delete announcement banner content.",
      );
    },
  });
}

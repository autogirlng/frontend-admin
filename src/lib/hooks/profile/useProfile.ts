// lib/hooks/profile/useProfile.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  UserProfile,
  UpdateProfilePayload,
} from "@/components/settings/profile/types";

// Query Key
export const PROFILE_QUERY_KEY = "myProfile";

// --- 1. Get User Profile ---
export function useGetMyProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: () => apiClient.get<UserProfile>("/users/me"),
  });
}

// --- 2. Update User Profile (Text fields) ---
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateProfilePayload>({
    mutationFn: (payload) => apiClient.patch("/users/me", payload),
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      // Invalidate the profile query to refetch the fresh data
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
}

// --- 3. Update Profile Picture ---
export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      // The API client returns the `data` property, which is the URL string
      return apiClient.patchFormData<string>(
        "/users/me/profile-picture",
        formData
      );
    },
    onSuccess: (newImageUrl) => {
      toast.success("Profile picture updated!");
      // Optimistically update the cache
      queryClient.setQueryData<UserProfile>([PROFILE_QUERY_KEY], (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          profilePictureUrl: newImageUrl,
        };
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload picture.");
    },
  });
}

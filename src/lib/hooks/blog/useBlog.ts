import { useState } from "react";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { uploadToCloudinary } from "@/components/dashboard/finance/payments/utils";
import {
  BlogPost,
  CreateBlogCategoryPayload,
  CreateBlogPostPayload,
  CreateBlogPostResponseData,
  BlogCategory,
  ModeratedBlogApprovalPayload,
  PaginatedResponse,
  BLOG_CONTENT_TYPE,
  UseUploadImageReturn,
} from "@/components/dashboard/blog/types";

const BLOG_POST_QUERY_KEY = "blogPostQueryKey";
const BLOG_COMMENT_QUERY_KEY = "blogCommentQueryKey";
const BLOG_CATEGORY_QUERY_KEY = "blogCategoryQueryKey";

export function useFetchSingleBlogContent(id: string) {
  return useQuery<BlogPost, Error>({
    queryKey: [BLOG_POST_QUERY_KEY, id],
    queryFn: () => apiClient.get<BlogPost>(`/blog-posts/${id}`),
    enabled: !!id,
  });
}

export function useCreateBlogContent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateBlogPostPayload>({
    mutationFn: (payload) =>
      apiClient.post<CreateBlogPostResponseData>("/blog-posts", payload),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Blog post content created successfully.");
      queryClient.invalidateQueries({
        queryKey: [BLOG_POST_QUERY_KEY],
      });
      return data;
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create blog post content successfully",
      );
    },
  });
}

export function useUpdateBlogContent(id: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateBlogPostPayload>({
    mutationFn: (payload) => {
      console.log({ ...payload, id });
      return apiClient.put<CreateBlogPostResponseData>("/blog-posts", {
        ...payload,
        id,
      });
    },
    onSuccess: () => {
      toast.success("Blog post content updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [BLOG_POST_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update blog post content successfully",
      );
    },
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateBlogCategoryPayload>({
    mutationFn: (payload) =>
      apiClient.post<BlogCategory>("/blog-categories", payload),
    onSuccess: () => {
      toast.success("New Blog Category Created");
      queryClient.invalidateQueries({
        queryKey: [BLOG_POST_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Blog Category Not Created");
    },
  });
}

export function useApproveBlogContent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ModeratedBlogApprovalPayload>({
    mutationFn: (payload) =>
      apiClient.put(`/admin/approve/${payload.contentType}/${payload.id}`, {}),
    onSuccess: () => {
      toast.success("Blog post approved");
      queryClient.invalidateQueries({
        queryKey: [BLOG_POST_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create blog post content successfully",
      );
    },
  });
}

export function useFetchBlogContents<T>(contentType: BLOG_CONTENT_TYPE) {
  return useQuery<T, Error>({
    queryKey: [BLOG_POST_QUERY_KEY, contentType],
    queryFn: async (): Promise<T> => {
      const res = await apiClient.get<T>(`/admin/approve/${contentType}`);
      return res;
    },
  });
}

export function useFetchBlogCategories() {
  return useQuery<PaginatedResponse<BlogCategory>, Error>({
    queryKey: [BLOG_CATEGORY_QUERY_KEY],
    queryFn: async (): Promise<PaginatedResponse<BlogCategory>> => {
      const res =
        await apiClient.get<PaginatedResponse<BlogCategory>>(
          `/blog-categories`,
        );
      return res;
    },
  });
}

export function useFetchBlogPostComments<T>(postId: string) {
  return useQuery<T, Error>({
    queryKey: [BLOG_COMMENT_QUERY_KEY, postId],
    queryFn: async (): Promise<T> => {
      const res = await apiClient.get<T>(`/blog-comments/post/${postId}`);
      console.log(res);
      return res;
    },
  });
}

export function useUploadImage(): UseUploadImageReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
  ): Promise<{ url: string; publicId: string } | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadToCloudinary(file);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
}

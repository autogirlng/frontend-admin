import { useState } from "react";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { uploadToCloudinary } from "@/components/dashboard/finance/payments/utils";
import {
  BlogPost,
  CreateBlogCategoryPayload,
  UpdateBlogCategoryPayload,
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
        queryKey: [BLOG_CATEGORY_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Blog Category Not Created");
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateBlogCategoryPayload>({
    mutationFn: (payload) =>
      apiClient.put<BlogCategory>("/blog-categories", payload),
    onSuccess: () => {
      toast.success("Blog category updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [BLOG_CATEGORY_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog category");
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (categoryId) =>
      apiClient.delete(`/blog-categories/${categoryId}`),
    onSuccess: () => {
      toast.success("Blog category deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: [BLOG_CATEGORY_QUERY_KEY],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog category");
    },
  });
}

export function useApproveBlogContent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ModeratedBlogApprovalPayload>({
    mutationFn: (payload) =>
      apiClient.put(`/admin/approve/${payload.contentType}/${payload.id}`, {}),
    onSuccess: (_, variables) => {
      toast.success("Blog content approved");
      queryClient.invalidateQueries({
        queryKey: [BLOG_POST_QUERY_KEY],
      });
      if (variables.contentType === BLOG_CONTENT_TYPE.CATEGORY) {
        queryClient.invalidateQueries({
          queryKey: [BLOG_CATEGORY_QUERY_KEY],
        });
      }
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create blog post content successfully",
      );
    },
  });
}

export function useFetchBlogContents<T>(
  contentType: BLOG_CONTENT_TYPE,
  page: number = 0,
  size: number = 10,
) {
  return useQuery<T, Error>({
    queryKey: [BLOG_POST_QUERY_KEY, contentType, page, size],
    queryFn: async (): Promise<T> => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));

      const res = await apiClient.get<T>(
        `/admin/approve/${contentType}?${params.toString()}`,
      );
      return res;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useFetchBlogCategories(page: number = 0, size: number = 20) {
  return useQuery<PaginatedResponse<BlogCategory>, Error>({
    queryKey: [BLOG_CATEGORY_QUERY_KEY, page, size],
    queryFn: async (): Promise<PaginatedResponse<BlogCategory>> => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));

      const res = await apiClient.get<PaginatedResponse<BlogCategory>>(
        `/blog-categories?${params.toString()}`,
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

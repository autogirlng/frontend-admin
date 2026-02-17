import { useState } from "react";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { uploadToCloudinary } from "@/components/dashboard/finance/payments/utils";
interface UseUploadImageReturn {
  uploadImage: (
    file: File,
  ) => Promise<{ url: string; publicId: string } | null>;
  isUploading: boolean;
  error: string | null;
}

export enum BLOG_STATUS {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SENT = "SENT",
  ACTIVE = "ACTIVE",
  VERIFIED = "VERIFIED",
}

export enum BLOG_CONTENT_TYPE {
  CATEGORY = "CATEGORY",
  POST = "POST",
  COMMENT = "COMMENT",
}

export interface CreateBlogPostPayload {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  blogCategory: {
    id: string;
  };
  tags: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  status: string;
  postCount: number;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvedAt?: string;
  approvedById?: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  authAuthorName?: string;
  authAuthorEmail?: string;
  authAuthorPhoneNumber?: string;
}

export interface CreateBlogPostResponseData {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BLOG_STATUS;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvedAt: string;
  approvedById: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  authAuthorName: string;
  authAuthorEmail: string;
  authAuthorPhoneNumber: string;
  blogCategory: BlogCategory;
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    commentCount: number;
  };
}

export interface ModeratedBlogPostContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  blogCategory: BlogCategory;
  tags: string[];
}
export interface ModeratedBlogPost {
  content: ModeratedBlogPostContent[];
  page: 0;
  size: 0;
  totalElements: 0;
  totalPages: 1;
  last: true;
  first: true;
}

export interface ModeratedBlogApprovalPayload {
  contentType: BLOG_CONTENT_TYPE;
  id: string;
}

export type BlogStatus =
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "FAILED"
  | "ACTIVE";

export interface BlogMetrics {
  views: number;
  likes: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvedAt: string;
  approvedById: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  blogCategory: BlogCategory;
  tags: string[];
  metrics: BlogMetrics;
}

export interface BlogComment {
  id: string;
  content: string;
  post: BlogPost;
  status: BlogStatus;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvalRef: string;
  ipAddress: string;
  userAgent: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface CreateBlogCategoryPayload {
  name: string;
  description: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
}

const BLOG_POST_QUERY_KEY = "blogPostQueryKey";
const BLOG_COMMENT_QUERY_KEY = "blogCommentQueryKey";

export function useFetchSingleBlogContent(id: string) {
  return useQuery<BlogPost, Error>({
    queryKey: [BLOG_POST_QUERY_KEY, id],
    queryFn: () => apiClient.get<BlogPost>(`/blog-posts/${id}`),
  });
}

export function useCreateBlogContent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateBlogPostPayload>({
    mutationFn: (payload) =>
      apiClient.post<CreateBlogPostResponseData>("/blog-posts", payload),
    onSuccess: () => {
      toast.success("Blog post content created successfully.");
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

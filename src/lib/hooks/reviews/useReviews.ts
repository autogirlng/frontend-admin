"use client";

import { RatingReview } from "@/components/dashboard/reviews/types";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { format } from "date-fns";

// --- Types ---
interface ReviewsApiResponse {
  status: string;
  message: string;
  data: {
    content: RatingReview[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
  };
}

interface UseReviewsParams {
  page: number;
  size?: number;
  status?: string; // Added missing status
  rating?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ModerateReviewPayload {
  id: string;
  status: "APPROVED" | "REJECTED";
  reason: string;
}

// --- 1. Fetch Reviews Hook ---
export const useReviews = ({
  page,
  size = 10,
  status,
  rating,
  search,
  startDate,
  endDate
}: UseReviewsParams) => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  return useQuery({
    // Included 'status' in the key so it refetches when filter changes
    queryKey: ["reviews", page, size, status, rating, search, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      
      if (status) params.append("status", status);
      if (rating) params.append("rating", rating);
      if (search) params.append("search", search);
      if (startDate) params.append("startDate", format(startDate, "yyyy-MM-dd")); 
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rating-review?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      return response.json() as Promise<ReviewsApiResponse>;
    },
    enabled: !!token,
    placeholderData: keepPreviousData, 
  });
};

// --- 2. Moderate Review Hook (New) ---

export const useModerateReview = () => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, reason }: ModerateReviewPayload) => {
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rating-review/moderate-review/${id}`, 
        {
          method: "PATCH", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Send data in the body
          body: JSON.stringify({
            status,
            reason
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to moderate review");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Review moderated successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};
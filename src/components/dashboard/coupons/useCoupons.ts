"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import { 
  Coupon, 
  CreateCouponPayload, 
  PaginatedResponse, 
  BookingCouponResponse 
} from "./types";

export const COUPONS_QUERY_KEY = "coupons";
export const COUPON_DETAIL_KEY = "couponDetail";
export const BOOKING_BY_COUPON_KEY = "bookingByCoupon";

export function useGetCoupons(page: number) {
  return useQuery<PaginatedResponse<Coupon>>({
    queryKey: [COUPONS_QUERY_KEY, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "20");

      const endpoint = `/admin/coupons?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Coupon>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetCouponDetails(id: string | null) {
  return useQuery<Coupon>({
    queryKey: [COUPON_DETAIL_KEY, id],
    queryFn: () => apiClient.get<Coupon>(`/admin/coupons/${id}`),
    enabled: !!id,
  });
}

/**
 * Fetches bookings associated with a specific coupon code.
 * Uses the internal logic of apiClient to handle auth automatically.
 */
export function useGetBookingsByCoupon(coupon: string | null, page: number = 0) {
  return useQuery<BookingCouponResponse>({
    queryKey: [BOOKING_BY_COUPON_KEY, coupon, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "10");

      const endpoint = `/admin/bookings/booking/${coupon}/coupon?${params.toString()}`;
      return apiClient.get<BookingCouponResponse>(endpoint);
    },
    enabled: !!coupon,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation<Coupon, Error, CreateCouponPayload>({
    mutationFn: (payload) => apiClient.post("/admin/coupons", payload),
    onSuccess: () => {
      toast.success("Coupon created successfully.");
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create coupon."),
  });
}

export function useToggleCouponStatus() {
  const queryClient = useQueryClient();
  return useMutation<Coupon, Error, string>({
    mutationFn: (id) => apiClient.patch(`/admin/coupons/${id}/toggle`, {}),
    onSuccess: (updatedCoupon) => {
      const status = updatedCoupon.active ? "activated" : "deactivated";
      toast.success(`Coupon ${status}.`);
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [COUPON_DETAIL_KEY, updatedCoupon.id],
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update status."),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      toast.success("Coupon deleted.");
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete coupon."),
  });
}
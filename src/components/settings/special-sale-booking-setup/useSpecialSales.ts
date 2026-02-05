"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import {
  ServicePricing,
  ServicePricingPayload,
  ServicePricingYear,
  ServicePricingYearPayload,
} from "./types";

export const SERVICE_PRICING_KEY = ["servicePricing"];
export const SERVICE_PRICING_YEARS_KEY = ["servicePricingYears"];

export function useGetServicePricing() {
  return useQuery<ServicePricing[]>({
    queryKey: SERVICE_PRICING_KEY,
    queryFn: () => apiClient.get<ServicePricing[]>("/admin/service-pricing"),
  });
}

export function useCreateServicePricing() {
  const queryClient = useQueryClient();
  return useMutation<ServicePricing, Error, ServicePricingPayload>({
    mutationFn: (payload) => apiClient.post("/admin/service-pricing", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PRICING_KEY });
      toast.success("Service Pricing created successfully");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create pricing"),
  });
}

export function useUpdateServicePricing() {
  const queryClient = useQueryClient();
  return useMutation<
    ServicePricing,
    Error,
    { id: string; payload: ServicePricingPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/service-pricing/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PRICING_KEY });
      toast.success("Service Pricing updated successfully");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update pricing"),
  });
}

export function useDeleteServicePricing() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/service-pricing/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PRICING_KEY });
      toast.success("Service Pricing deleted successfully");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete pricing"),
  });
}

export function useGetServicePricingYears() {
  return useQuery<ServicePricingYear[]>({
    queryKey: SERVICE_PRICING_YEARS_KEY,
    queryFn: () =>
      apiClient.get<ServicePricingYear[]>("/admin/service-pricing-years"),
  });
}

export function useCreateServicePricingYear() {
  const queryClient = useQueryClient();
  return useMutation<ServicePricingYear, Error, ServicePricingYearPayload>({
    mutationFn: (payload) =>
      apiClient.post("/admin/service-pricing-years", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PRICING_YEARS_KEY });
      toast.success("Year Range created successfully");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create year range"),
  });
}

export function useUpdateServicePricingYear() {
  const queryClient = useQueryClient();
  return useMutation<
    ServicePricingYear,
    Error,
    { id: string; payload: ServicePricingYearPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/service-pricing-years/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PRICING_YEARS_KEY });
      toast.success("Year Range updated successfully");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update year range"),
  });
}

export function useDeleteServicePricingYear() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/service-pricing-years/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PRICING_YEARS_KEY });
      toast.success("Year Range deleted successfully");
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete year range"),
  });
}

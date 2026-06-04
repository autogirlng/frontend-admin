import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "react-toastify";

export interface PricingSheet {
  id: string;
  vehicleMakeName: string;
  vehicleModelName: string;
  baseYear: number;
  upgradedYear?: number;
  bookingTypeName: string;
  durationInMinutes: number;
  price: number;
  active: boolean;
}

export interface PricingSheetModel {
  modelId: string;
  modelName: string;
  modelCode: string;
  pricingSheets: PricingSheet[];
}

export interface PricingSheetMake {
  makeId: string;
  makeName: string;
  makeCode: string;
  models: PricingSheetModel[];
}

export interface PricingCatalogData {
  content: PricingSheetMake[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PricingItem {
  bookingTypeId: string;
  price: number;
}

export interface CreatePricingSheetPayload {
  vehicleModelId: string;
  baseYear: number;
  upgradedYear?: number;
  pricingItems: PricingItem[];
}

export interface UpdatePricingSheetPayload {
  baseYear: number;
  upgradedYear?: number;
  bookingTypeId: string;
  price: number;
}

export const PRICING_CATALOG_QUERY_KEY = ["pricingCatalog"];

export function useGetPricingCatalog(page = 0, searchTerm = "") {
  return useQuery<PricingCatalogData>({
    queryKey: [...PRICING_CATALOG_QUERY_KEY, page, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page) });
      if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
      return apiClient.get<PricingCatalogData>(
        `/admin/pricing-sheets/catalog?${params.toString()}`,
      );
    },
  });
}

export function useCreatePricingSheet() {
  const queryClient = useQueryClient();

  return useMutation<PricingSheet, Error, CreatePricingSheetPayload>({
    mutationFn: (payload) => apiClient.post("/admin/pricing-sheets", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICING_CATALOG_QUERY_KEY });
      toast.success("Pricing sheet created successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

export function useTogglePricingSheetStatus() {
  const queryClient = useQueryClient();

  return useMutation<PricingSheet, Error, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      apiClient.patch(`/admin/pricing-sheets/${id}/status`, { isActive }),
    onSuccess: (updatedSheet) => {
      queryClient.invalidateQueries({ queryKey: PRICING_CATALOG_QUERY_KEY });
      toast.success(
        updatedSheet.active
          ? "Pricing sheet activated successfully."
          : "Pricing sheet deactivated successfully.",
      );
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

export function useUpdatePricingSheet() {
  const queryClient = useQueryClient();

  return useMutation<
    PricingSheet,
    Error,
    { id: string; payload: UpdatePricingSheetPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/pricing-sheets/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICING_CATALOG_QUERY_KEY });
      toast.success("Pricing sheet updated successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

export function useDeletePricingSheet() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/pricing-sheets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICING_CATALOG_QUERY_KEY });
      toast.success("Pricing sheet deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

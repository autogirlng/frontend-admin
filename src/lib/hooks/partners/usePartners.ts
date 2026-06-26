import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";
import type {
  Partner,
  CreatePartnerPayload,
  UpdatePartnerPayload,
  MapVehiclesPayload,
  MapStatesPayload,
  PaginatedResponse,
  PartnerPriorityVehicle,
} from "@/components/dashboard/partners/types";

export const PARTNERS_QUERY_KEY = "partners";
export const PARTNER_VEHICLES_KEY = "partnerVehicles";

export function useGetPartners(page: number, search: string, size = 20) {
  return useQuery<PaginatedResponse<Partner>>({
    queryKey: [PARTNERS_QUERY_KEY, page, search, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));
      if (search) params.append("search", search);
      return apiClient.get<PaginatedResponse<Partner>>(
        `/admin/partners?${params.toString()}`,
      );
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetPartnerById(id: string | null) {
  return useQuery<Partner>({
    queryKey: [PARTNERS_QUERY_KEY, "detail", id],
    queryFn: () => apiClient.get<Partner>(`/admin/partners/${id}`),
    enabled: !!id,
  });
}

export function useGetPartnerPriorityVehicles(slug: string | null | undefined) {
  return useQuery<PartnerPriorityVehicle[]>({
    queryKey: [PARTNER_VEHICLES_KEY, slug],
    queryFn: async () => {
      if (!slug) return [];
      const first = await apiClient.get<
        PaginatedResponse<PartnerPriorityVehicle>
      >(`/public/partners/${slug}/vehicles/priority?page=0&size=1`);
      const total = first.totalElements;
      if (total === 0) return [];
      const all = await apiClient.get<
        PaginatedResponse<PartnerPriorityVehicle>
      >(`/public/partners/${slug}/vehicles/priority?page=0&size=${total}`);
      return all.content;
    },
    enabled: !!slug,
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation<Partner, Error, CreatePartnerPayload>({
    mutationFn: (payload) => apiClient.post("/admin/partners", payload),
    onSuccess: () => {
      toast.success("Partner created successfully.");
      queryClient.invalidateQueries({ queryKey: [PARTNERS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create partner."),
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation<
    Partner,
    Error,
    { id: string; payload: UpdatePartnerPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/partners/${id}`, payload),
    onSuccess: (_, { id }) => {
      toast.success("Partner updated successfully.");
      queryClient.invalidateQueries({ queryKey: [PARTNERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PARTNERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update partner."),
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/partners/${id}`),
    onSuccess: () => {
      toast.success("Partner deleted.");
      queryClient.invalidateQueries({ queryKey: [PARTNERS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete partner."),
  });
}

export function useMapVehiclesToPartner() {
  const queryClient = useQueryClient();
  return useMutation<
    Partner,
    Error,
    { id: string; slug: string; payload: MapVehiclesPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.post(`/admin/partners/${id}/vehicles`, payload),
    onSuccess: (_, { id, slug }) => {
      toast.success("Vehicles assigned successfully.");
      queryClient.invalidateQueries({
        queryKey: [PARTNERS_QUERY_KEY, "detail", id],
      });
      queryClient.invalidateQueries({ queryKey: [PARTNER_VEHICLES_KEY, slug] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to assign vehicles."),
  });
}

export function useRemoveVehicleFromPartner() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { id: string; slug: string; vehicleId: string }
  >({
    mutationFn: ({ id, vehicleId }) =>
      apiClient.delete(`/admin/partners/${id}/vehicles/${vehicleId}`),
    onSuccess: (_, { id, slug }) => {
      toast.success("Vehicle removed from partner.");
      queryClient.invalidateQueries({
        queryKey: [PARTNERS_QUERY_KEY, "detail", id],
      });
      queryClient.invalidateQueries({ queryKey: [PARTNER_VEHICLES_KEY, slug] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to remove vehicle."),
  });
}

export function useMapStatesToPartner() {
  const queryClient = useQueryClient();
  return useMutation<Partner, Error, { id: string; payload: MapStatesPayload }>(
    {
      mutationFn: ({ id, payload }) =>
        apiClient.post(`/admin/partners/${id}/states`, payload),
      onSuccess: (_, { id }) => {
        toast.success("States mapped to partner successfully.");
        queryClient.invalidateQueries({
          queryKey: [PARTNERS_QUERY_KEY, "detail", id],
        });
      },
      onError: (error) => toast.error(error.message || "Failed to map states."),
    },
  );
}

export function useRemoveStateFromPartner() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { id: string; stateId: string }>({
    mutationFn: ({ id, stateId }) =>
      apiClient.delete(`/admin/partners/${id}/states/${stateId}`),
    onSuccess: (_, { id }) => {
      toast.success("State removed from partner.");
      queryClient.invalidateQueries({
        queryKey: [PARTNERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => toast.error(error.message || "Failed to remove state."),
  });
}

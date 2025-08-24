import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRoutes, baseUrl } from "@/utils/ApiRoutes";
import APIClient from "@/api/APIClient";

export interface ExtremeArea {
  id: string;
  state: string;
  areas: string[];
}

export interface ExtremeAreaResponse {
  data: ExtremeArea[];
  totalCount: number;
  totalPages: number;
}

export function useExtremeAreas(state: string, page = 1, limit = 10) {
  // If state is provided, use the /state/:state endpoint, else fetch all
  return useQuery({
    queryKey: ["extreme-areas", state, page, limit],
    queryFn: async () => {
      if (state) {
        // fetch by state (with pagination if supported)
        const res = await APIClient.get(`${baseUrl}${ApiRoutes.extremeAreas}/state/${state}?page=${page}&limit=${limit}`);
        return res.data;
      } else {
        // fetch all
        const res = await APIClient.get(`${baseUrl}${ApiRoutes.extremeAreas}?page=${page}&limit=${limit}`);
        return res.data;
      }
    },
  });
}

export function useAddExtremeArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { state: string; areas: string[] }) => {
      const res = await APIClient.post(`${baseUrl}${ApiRoutes.extremeAreas}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extreme-areas"] });
    },
  });
}

export function useUpdateExtremeArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; state: string; areas: string[] }) => {
      const { id, ...rest } = payload;
      const res = await APIClient.patch(`${baseUrl}${ApiRoutes.extremeAreas}/${id}`, rest);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extreme-areas"] });
    },
  });
}

export function useDeleteExtremeArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await APIClient.delete(`${baseUrl}${ApiRoutes.extremeAreas}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extreme-areas"] });
    },
  });
}

export function useExtremeAreaByState(state: string) {
  return useQuery({
    queryKey: ["extreme-area", state],
    queryFn: async () => {
      const res = await APIClient.get(`${baseUrl}${ApiRoutes.extremeAreas}/state/${state}`);
      return res.data;
    },
  });
}

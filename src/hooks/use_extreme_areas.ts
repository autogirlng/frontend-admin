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
  return useQuery({
    queryKey: ["extreme-areas", state, page, limit],
    queryFn: async () => {
      if (state) {
        const res = await APIClient.get(
          `${baseUrl}${ApiRoutes.extremeAreas}/state/${state}?page=${page}&limit=${limit}`
        );
        return res.data;
      } else {
        const res = await APIClient.get(
          `${baseUrl}${ApiRoutes.extremeAreas}?page=${page}&limit=${limit}`
        );
        return res.data;
      }
    },
  });
}

export function useAddExtremeArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { state: string; areas: string[] }) => {
      const res = await APIClient.post(
        `${baseUrl}${ApiRoutes.extremeAreas}`,
        payload
      );
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
    mutationFn: async (payload: {
      id: string;
      state: string;
      areas: string[];
    }) => {
      const { id, ...rest } = payload;
      const res = await APIClient.patch(
        `${baseUrl}${ApiRoutes.extremeAreas}/${id}`,
        rest
      );
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
      const res = await APIClient.delete(
        `${baseUrl}${ApiRoutes.extremeAreas}/${id}`
      );
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
      const res = await APIClient.get(
        `${baseUrl}${ApiRoutes.extremeAreas}/state/${state}`
      );
      return res.data;
    },
  });
}

export function useExtremeAreaById(id: string | null) {
  return useQuery({
    queryKey: ["extreme-area", id],
    queryFn: async () => {
      const res = await APIClient.get<ExtremeArea>(
        `${baseUrl}${ApiRoutes.extremeAreas}/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  });
}

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import apiClient from "@/api/APIClient";
import { AxiosError, AxiosResponse } from "axios";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { headers } from "next/headers";

// =============================================================================
// TYPES
// =============================================================================

/** The shape of a single outskirt location from the API. */
export type OutskirtLocation = {
  id: string;
  locationName: string;
  state: string;
  isActive: boolean;
};

/** The shape of the paginated API response. */
export type PaginatedOutskirtLocationResponse = {
  data: OutskirtLocation[];
  message: string;
    count: number;
    totalPages: number;
      total: number,
  page: number,
  limit: number,
  totalCount: number; // Assuming the API returns a total count for pagination
};

/** The payload for adding new locations. */
export type AddOutskirtLocationPayload = {
  state: string;
  locations: string[];
  isActive: boolean;
};

/** The payload for updating a location. */
export type UpdateOutskirtLocationPayload = {
  id: string;
  locationName: string;
  state: string;
  isActive: boolean;
};

/** The shape of the successful API response for a mutation. */
type MutationResponse = {
  message: string;
};

// =============================================================================
// QUERY HOOK: Fetch Locations
// =============================================================================
export const useOutskirtLocations = (
  state: string,
  isActive: boolean = true,
  page: number,
  limit: number
): UseQueryResult<PaginatedOutskirtLocationResponse, Error> => {
  return useQuery<PaginatedOutskirtLocationResponse, Error>({
    queryKey: ["outskirtLocations", state, isActive, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Conditionally add the state filter if it's not "ALL_STATES"
      if (state !== "ALL_STATES") {
        params.append("state", state);
      }
      
      params.append("isActive", String(isActive));
      params.append("page", String(page));
      params.append("limit", String(limit));

      const url = `${ApiRoutes.outskirtLocations}?${params.toString()}`;
      const response: AxiosResponse<PaginatedOutskirtLocationResponse> = await apiClient.get(url);
      console.log('API Response:', response.data);
      return response.data;
    },
    // Query is always enabled now, since "ALL_STATES" is a valid filter
    enabled: true, 
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// =============================================================================
// MUTATION HOOKS
// =============================================================================

/** A custom hook to add new outskirt locations via a POST request. */
export const useAddOutskirtLocation = (): UseMutationResult<
  MutationResponse,
  AxiosError,
  AddOutskirtLocationPayload
> => {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, AxiosError, AddOutskirtLocationPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<MutationResponse>(ApiRoutes.outskirtLocations, payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all queries that have "outskirtLocations" in their key
      queryClient.invalidateQueries({ queryKey: ["outskirtLocations"] });
    },
  });
};

/** A custom hook to update an outskirt location via a PATCH request. */
export const useUpdateOutskirtLocation = (): UseMutationResult<
  MutationResponse,
  AxiosError,
  UpdateOutskirtLocationPayload
> => {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, AxiosError, UpdateOutskirtLocationPayload>({
    mutationFn: async (payload) => {
      const { id, ...data } = payload;
      const response = await apiClient.post<MutationResponse>(`${ApiRoutes.outskirtLocations}/${id}`, data,);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outskirtLocations"] });
    },
  });
};

/** A custom hook to delete an outskirt location via a DELETE request. */
export const useDeleteOutskirtLocation = (): UseMutationResult<
  MutationResponse,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, AxiosError, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<MutationResponse>(`${ApiRoutes.outskirtLocations}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outskirtLocations"] });
    },
  });
};

/** A custom hook to toggle an outskirt location's active status via a PATCH request. */
export const useToggleActiveStatus = (): UseMutationResult<
  MutationResponse,
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, AxiosError, string>({
    mutationFn: async (id) => {
      const response = await apiClient.post(`${ApiRoutes.outskirtLocations}/${id}/toggle-active`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outskirtLocations"] });
    },
  });
};
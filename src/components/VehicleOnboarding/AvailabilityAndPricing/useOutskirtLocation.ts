// @/hooks/useOutskirtLocations.ts
"use client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import apiClient from "@/api/APIClient";
import { useAppSelector } from "@/lib/hooks";

// Define the type for the raw API response object
type ApiOutskirtLocation = {
  id: string;
  locationName: string;
  state: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Define the type for the final, clean data object you want to use
export type OutskirtLocation = {
  id: string;
  name: string;
};

/**
 * A custom hook to fetch outskirt locations for a given state.
 *
 * @param {boolean} enabled - A boolean to conditionally enable the query.
 * @returns {UseQueryResult<OutskirtLocation[], Error>} - The result of the query.
 */
export const useOutskirtLocations = (
  enabled: boolean // <-- Add this parameter
): UseQueryResult<OutskirtLocation[], Error> => {
  const http = useHttp(); // This hook isn't being used, you can remove it if it's not needed.

  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
  const state = vehicle?.location?.toLocaleUpperCase();
  
  return useQuery<OutskirtLocation[], Error>({
    queryKey: ["outskirtLocations", state],
    queryFn: async () => {
      // The query will only execute if 'enabled' is true, so no need for an extra `if (!state)` check here.
      const response: AxiosResponse<ApiOutskirtLocation[] | undefined> = await apiClient.get(
        `${ApiRoutes.outskirtLocations}/state/${state}`
      );

      const rawData = response.data ?? [];

      const mappedData: OutskirtLocation[] = rawData.map((item) => ({
        id: item.id,
        name: item.locationName,
      }));

      return mappedData;
    },
    // The `enabled` option is the key to making this conditional.
    // The query will only run if `enabled` is true AND `state` has a value.
    enabled: enabled && !!state, 
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
  });
};
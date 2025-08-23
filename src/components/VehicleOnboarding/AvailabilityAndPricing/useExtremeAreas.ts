"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { useAppSelector } from "@/lib/hooks";

type ExtremeAreaResponse = {
  id: string;
  state: string;
  areas: string[];
};

type ExtremeAreaData = {
  id: string;
  name: string;
};

export const useExtremeAreas = (enabled: boolean) => {
  const http = useHttp();
  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const state = vehicle?.location?.toLowerCase();

  const fetchExtremeAreas = async (): Promise<ExtremeAreaData[]> => {
    if (!state) {
      return [];
    }

    const response = await http.get<ExtremeAreaResponse>(
      `${ApiRoutes.extremeAreas}/state/${state}`
    );

    if (!response) {
      console.error(
        "No response received from extreme areas API for state:",
        state
      );
      return [];
    }

    return response.areas.map((area, index) => ({
      id: `${response.id}-${index}`,
      name: area,
    }));
  };

  return useQuery<ExtremeAreaData[], Error>({
    queryKey: ["extremeAreas", state],
    queryFn: fetchExtremeAreas,
    enabled: enabled && !!state,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

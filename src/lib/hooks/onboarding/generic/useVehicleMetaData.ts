// app/hooks/useVehicleMetaData.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export function useVehicleTypes() {
  return useQuery({
    queryKey: ["vehicle-types"],
    queryFn: async () => {
      const res = await apiClient.get<
        { id: string; name: string; description: string }[]
      >("/public/vehicle-types");
      return res;
    },
  });
}

export function useVehicleMakes() {
  return useQuery({
    queryKey: ["vehicle-makes"],
    queryFn: async () => {
      const res = await apiClient.get<
        { id: string; name: string; code: string }[]
      >("/public/vehicle-makes");
      return res;
    },
  });
}

export function useVehicleModels() {
  return useQuery({
    queryKey: ["vehicle-models"],
    queryFn: async () => {
      const res = await apiClient.get<
        {
          id: string;
          name: string;
          code: string;
          makeName: string;
          makeId: string;
        }[]
      >("/public/vehicle-models");
      return res;
    },
  });
}

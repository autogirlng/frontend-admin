"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import { MOUData, UpdateMOUStatusPayload } from "@/components/dashboard/host-management/types";

export const MOU_KEYS = {
  all: ["mous"] as const,
  host: (hostId: string) => [...MOU_KEYS.all, "host", hostId] as const,
};

export function useGetHostMOUs(hostId: string | null) {
  return useQuery<MOUData[]>({
    queryKey: MOU_KEYS.host(hostId || ""),
    queryFn: () => apiClient.get<MOUData[]>(`/hosts/mou/${hostId}`),
    enabled: !!hostId,
  });
}

export function useDownloadMOU() {
  return useMutation({
    mutationFn: (hostMouId: string) =>
      apiClient.getAndDownloadFile(
        `/hosts/mou/${hostMouId}/download`,
        `MOU_${hostMouId}.pdf`
      ),
    onError: (error: any) => {
      toast.error(error.message || "Failed to download MOU");
    },
  });
}

export function useUpdateMOUStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    MOUData,
    Error,
    { mouId: string; payload: UpdateMOUStatusPayload }
  >({
    mutationFn: ({ mouId, payload }) =>
      apiClient.patch<MOUData>(`/hosts/mou/${mouId}/status`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MOU_KEYS.all });
      toast.success(`MOU status successfully ${data.status.toLowerCase()}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update MOU status");
    },
  });
}
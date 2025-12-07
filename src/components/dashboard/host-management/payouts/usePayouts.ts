"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import { PayoutData } from "./types";

export const PAYOUTS_KEY = "hostPayouts";

export function useGetHostPayouts(
  hostId: string,
  status: string | null,
  page: number = 0
) {
  return useQuery<PayoutData>({
    queryKey: [PAYOUTS_KEY, hostId, status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      else params.append("status", "PENDING");

      params.append("page", String(page));
      params.append("size", "10");

      return apiClient.get<PayoutData>(
        `/admin/payouts/host/${hostId}?${params.toString()}`
      );
    },
    enabled: !!hostId,
    placeholderData: (previousData) => previousData,
  });
}

export function useMarkPayoutPaid() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (bookingId) =>
      apiClient.patch(`/admin/payouts/mark-paid/${bookingId}`, {}),
    onSuccess: () => {
      toast.success("Payout marked as PAID.");
      queryClient.invalidateQueries({ queryKey: [PAYOUTS_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark payout as paid.");
    },
  });
}

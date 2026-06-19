import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  LeaderboardFilters,
  LeaderboardResponse,
  VehicleAnalyticsResponse,
} from "../types/leaderboard";

export function useGetLeaderboard(filters: LeaderboardFilters) {
  return useQuery({
    queryKey: ["leaderboard", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(filters.page));
      params.append("size", String(filters.size));

      if (filters.bookingStatuses)
        params.append("bookingStatuses", filters.bookingStatuses);
      if (filters.ownerType) params.append("ownerType", filters.ownerType);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.latitude && filters.longitude) {
        params.append("latitude", String(filters.latitude));
        params.append("longitude", String(filters.longitude));
        params.append("radiusInKm", String(filters.radiusInKm || 100));
      }

      const endpoint = `/admin/featured-vehicles/leaderboard?${params.toString()}`;
      return await apiClient.get<LeaderboardResponse>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetVehicleAnalytics(
  vehicleId: string | null,
  startDate: string,
  endDate: string,
) {
  return useQuery({
    queryKey: ["vehicleAnalytics", vehicleId, startDate, endDate],
    queryFn: async () => {
      if (!vehicleId) throw new Error("Vehicle ID is required");
      const params = new URLSearchParams({ startDate, endDate });
      const endpoint = `/admin/featured-vehicles/leaderboard/${vehicleId}?${params.toString()}`;

      return await apiClient.get<VehicleAnalyticsResponse>(endpoint);
    },
    enabled: !!vehicleId,
  });
}

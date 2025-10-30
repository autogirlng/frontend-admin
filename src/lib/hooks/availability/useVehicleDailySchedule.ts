// lib/hooks/availability/useVehicleDailySchedule.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import { DailyScheduleResponse } from "@/components/dashboard/availability/availability";

type UseVehicleDailyScheduleProps = {
  vehicleId: string | null;
  date: Date | null;
};

export function useVehicleDailySchedule({
  vehicleId,
  date,
}: UseVehicleDailyScheduleProps) {
  return useQuery<DailyScheduleResponse, Error>({
    queryKey: ["vehicleDailySchedule", vehicleId, date],
    queryFn: async () => {
      if (!vehicleId || !date) {
        throw new Error("Vehicle ID and date are required to fetch schedule.");
      }

      const formattedDate = format(date, "yyyy-MM-dd");
      const endpoint = `/availability/${vehicleId}/daily-schedule?date=${formattedDate}`;

      return apiClient.get<DailyScheduleResponse>(endpoint);
    },
    // ✅ This is key: The query only runs when both vehicleId and date are set
    enabled: !!vehicleId && !!date,
    // Optional: Don't refetch automatically, as this data is specific
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

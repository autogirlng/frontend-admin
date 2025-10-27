"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

// Define the shape of the data returned from the GET endpoint
type VehicleDetails = {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: number;
  hasInsurance: boolean;
  hasTracker: boolean;
};

type VehicleDetailsApiResponse = {
  data: VehicleDetails;
  status: string;
  message: string;
  timestamp: string;
};

export function useVehicleDetails(id: string | null) {
  return useQuery<VehicleDetails, unknown>({
    queryKey: ["vehicleDetails", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      // Get the full response
      const res = await apiClient.get(`/vehicles/${id}`);

      console.log("Full API Response:", res);

      // Check if res is already the parsed data or the full response
      // If your apiClient already returns parsed data:
      if (res && typeof res === "object" && "data" in res) {
        console.log("Extracted Vehicle Details:", res.data);
        return res.data as VehicleDetails;
      }

      // Otherwise return as is
      console.log("Returning response as is:", res);
      return res as VehicleDetails;
    },
    enabled: !!id,
  });
}

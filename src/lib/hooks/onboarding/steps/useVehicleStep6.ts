"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";

type VehiclePhoto = {
  cloudinaryUrl: string;
  isPrimary: boolean;
};
type VehicleDocument = {
  documentType: string;
  cloudinaryUrl: string;
};
type VehicleFeature = {
  id: string;
  name: string;
};
type VehiclePrice = {
  bookingTypeId: string;
  bookingTypeName?: string;
  price: number;
};
type VehicleDiscount = {
  discountDurationId: string;
  discountDurationName?: string;
  percentage: number;
};
type SupportedState = {
  stateId: string;
  stateName?: string;
  surchargeFee: number;
};
type OutOfBoundsArea = {
  id: string;
  name: string;
};

export type FullVehicleDetails = {
  id: string;
  name: string;
  city: string;
  address: string;
  yearOfRelease: number;
  status: string;

  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;

  licensePlateNumber: string | null;
  stateOfRegistration: string | null;
  vehicleColorId: string | null;
  numberOfSeats: number | null;
  description: string | null;
  features: VehicleFeature[] | null;

  photos: VehiclePhoto[] | null;

  documents: VehicleDocument[] | null;

  maxTripDurationUnit: string | null;
  maxTripDurationValue: number | null;
  advanceNoticeUnit: string | null;
  advanceNoticeValue: number | null;
  willProvideDriver: boolean;
  willProvideFuel: boolean;

  pricing: VehiclePrice[] | null;
  discounts: VehicleDiscount[] | null;
  supportedStates: SupportedState[] | null;
  outOfBoundsAreas: OutOfBoundsArea[] | null;

  extraHourlyRate: number | null;
  outskirtFee: number | null;
  extremeFee: number | null;
};

export function useVehicleStep6(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const {
    data: vehicleData,
    isLoading: isLoadingVehicle,
    error: vehicleError,
  } = useQuery({
    queryKey: ["vehicleDetails", vehicleId],
    queryFn: async () => {
      const res = await apiClient.get<FullVehicleDetails>(
        `/vehicles/${vehicleId}`,
      );
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  const { mutate: submitForReview, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      return apiClient.post(`/vehicles/submit-review?id=${vehicleId}`, null);
    },
    onSuccess: () => {
      toast.success("Vehicle submitted for review successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      router.push("/dashboard/vehicle-onboarding");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit for review.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to submit this vehicle for review?")
    ) {
      if (vehicleData?.status === "APPROVED") {
        toast.success("Vehicle submitted for review successfully!");
        router.push("/dashboard/vehicle-onboarding");
        return;
      }
      submitForReview();
    }
  };

  return {
    vehicleData,
    isLoading: isLoadingVehicle || sessionStatus === "loading",
    isSubmitting,
    vehicleError,
    handleSubmit,
  };
}

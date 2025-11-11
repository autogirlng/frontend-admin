// lib/hooks/onboarding/steps/useVehicleStep5.ts
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient"; // Your client
import { Option } from "@/components/generic/ui/Select";

// ... (Type definitions, Initial State, and Helper functions remain unchanged) ...
// --- Type Definitions ---
export type BookingType = {
  id: string;
  name: string;
  durationInMinutes: number;
};
export type GeofenceArea = {
  id: string;
  name: string;
  areaType: "OUTSKIRT" | "EXTREME";
};
export type DiscountDuration = {
  id: string;
  name: string;
  minDays: number;
  maxDays: number;
};
type PublicDataApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};
type VehicleConfigData = {
  maxTripDurationUnit: string | null;
  maxTripDurationValue: number | null;
  advanceNoticeUnit: string | null;
  advanceNoticeValue: number | null;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  supportedBookingTypes: { id: string }[] | null;
  outOfBoundsAreaIds: string[] | null;
  outskirtFee: number | null;
  extremeFee: number | null;
  pricing:
    | {
        bookingTypeId: string;
        price: number;
      }[]
    | null;
  discounts:
    | {
        discountDurationId: string;
        percentage: number;
      }[]
    | null;
  extraHourlyRate: number | null;
};
type DurationState = {
  value: number | "";
  unit: string;
};
type PriceState = { [bookingTypeId: string]: string };
type DiscountState = { [discountDurationId: string]: string };
type Step5FormData = {
  maxTripDuration: DurationState;
  advanceNotice: DurationState;
  willProvideDriver: "yes" | "no" | "";
  willProvideFuel: "yes" | "no" | "";
  supportedBookingTypeIds: string[];
  outOfBoundsAreaIds: string[];
  outskirtFee: string;
  extremeFee: string;
  extraHourlyRate: string;
  pricing: PriceState;
  discounts: DiscountState;
};
type PricePayload = {
  bookingTypeId: string;
  bookingTypeName: string;
  price: number;
  platformFeeType: string;
};
type DiscountPayload = {
  discountDurationId: string;
  percentage: number;
};
type UpdateConfigPayload = {
  maxTripDurationUnit: string;
  maxTripDurationValue: number;
  advanceNoticeUnit: string;
  advanceNoticeValue: number;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  supportedBookingTypeIds: string[];
  outOfBoundsAreaIds: string[];
  outskirtFee: number;
  extremeFee: number;
  extraHourlyRate: number;
  pricing: PricePayload[];
  discounts: DiscountPayload[];
};

// --- Initial State ---
const initialState: Step5FormData = {
  maxTripDuration: { value: "", unit: "DAYS" },
  advanceNotice: { value: "", unit: "DAYS" },
  willProvideDriver: "",
  willProvideFuel: "",
  supportedBookingTypeIds: [],
  outOfBoundsAreaIds: [],
  outskirtFee: "",
  extremeFee: "",
  extraHourlyRate: "",
  pricing: {},
  discounts: {},
};

// --- Helper to safely parse API responses ---
async function fetchApiData<T>(endpoint: string): Promise<T[]> {
  const res = await apiClient.get<T[] | PublicDataApiResponse<T[]>>(endpoint);

  if (!res) {
    throw new Error(`Failed to fetch ${endpoint}: No response`);
  }
  if (Array.isArray(res)) {
    return res; // Unwrapped data
  }
  if (res && "data" in res && Array.isArray(res.data)) {
    return res.data; // Wrapped data
  }
  if (res && "data" in res) {
    return res.data as T[];
  }
  return res as T[];
}

// --- The Hook ---
export function useVehicleStep5(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const [formData, setFormData] = useState<Step5FormData>(initialState);
  const [originalData, setOriginalData] = useState<Step5FormData | null>(null);

  // ... (Data Fetching, Prefill, Mutation, and Form Handlers remain unchanged) ...
  // --- Data Fetching ---
  const { data: bookingTypes, isLoading: isLoadingBookingTypes } = useQuery({
    queryKey: ["bookingTypes"],
    queryFn: () => fetchApiData<BookingType>("/booking-types"),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: geofenceAreas, isLoading: isLoadingGeofence } = useQuery({
    queryKey: ["geofenceAreas"],
    queryFn: () => fetchApiData<GeofenceArea>("/geofence-areas"),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: discountDurations, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discountDurations"],
    queryFn: () => fetchApiData<DiscountDuration>("/discount-durations"),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: vehicleDetails, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicleDetails", vehicleId],
    queryFn: async () => {
      const res = await apiClient.get<VehicleConfigData>(
        `/vehicles/${vehicleId}`
      );
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  // --- Prefill Form ---
  useEffect(() => {
    if (vehicleDetails && bookingTypes && discountDurations && !originalData) {
      const initialPrices: PriceState = {};
      bookingTypes.forEach((bt) => {
        const existing = (vehicleDetails.pricing || []).find(
          (p) => p.bookingTypeId === bt.id
        );
        initialPrices[bt.id] = String(existing?.price || "");
      });

      const initialDiscounts: DiscountState = {};
      discountDurations.forEach((dd) => {
        const existing = (vehicleDetails.discounts || []).find(
          (d) => d.discountDurationId === dd.id
        );
        initialDiscounts[dd.id] = String(existing?.percentage || "");
      });

      const prefilledState: Step5FormData = {
        maxTripDuration: {
          value: vehicleDetails.maxTripDurationValue ?? "",
          unit: vehicleDetails.maxTripDurationUnit || "DAYS",
        },
        advanceNotice: {
          value: vehicleDetails.advanceNoticeValue ?? "",
          unit: vehicleDetails.advanceNoticeUnit || "DAYS",
        },
        willProvideDriver: vehicleDetails.willProvideDriver ? "yes" : "no",
        willProvideFuel: vehicleDetails.willProvideFuel ? "yes" : "no",
        supportedBookingTypeIds:
          (vehicleDetails.supportedBookingTypes || [])
            .map((t) => t.id)
            .sort() || [],
        outOfBoundsAreaIds: (vehicleDetails.outOfBoundsAreaIds || []).sort(),
        outskirtFee: String(vehicleDetails.outskirtFee || ""),
        extremeFee: String(vehicleDetails.extremeFee || ""),
        extraHourlyRate: String(vehicleDetails.extraHourlyRate || ""),
        pricing: initialPrices,
        discounts: initialDiscounts,
      };

      setFormData(prefilledState);
      setOriginalData(prefilledState);
    }
  }, [vehicleDetails, bookingTypes, discountDurations, originalData]);

  // --- Mutation ---
  const { mutate: updateConfiguration, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateConfigPayload) => {
      return apiClient.patch(
        `/vehicles/configuration?id=${vehicleId}`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Configuration saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      // router.push(`/onboarding/step6?id=${vehicleId}`);
      router.push(`/dashboard/onboarding/submit-review?id=${vehicleId}`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save configuration.");
    },
  });

  // --- Form Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (
    field: "willProvideDriver" | "willProvideFuel",
    option: Option | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: option ? option.id : "" }));
  };

  const handleDurationChange = (
    field: "maxTripDuration" | "advanceNotice",
    value: number | "",
    unit: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { value, unit },
    }));
  };

  const handleCheckboxChange = (
    field: "supportedBookingTypeIds" | "outOfBoundsAreaIds",
    id: string,
    isChecked: boolean
  ) => {
    setFormData((prev) => {
      const oldList = prev[field] as string[];
      const newList = isChecked
        ? [...oldList, id]
        : oldList.filter((item) => item !== id);
      newList.sort();
      return { ...prev, [field]: newList };
    });
  };

  const handlePriceChange = (bookingTypeId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [bookingTypeId]: value },
    }));
  };

  const handleDiscountChange = (discountDurationId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      discounts: { ...prev.discounts, [discountDurationId]: value },
    }));
  };

  // --- ✅ MODIFIED Submit Handler ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.info("No changes detected. Proceeding to next step.");
      router.push(`/dashboard/onboarding/submit-review?id=${vehicleId}`);
      return;
    }

    if (!bookingTypes || !discountDurations) {
      toast.error("Data is still loading, please wait.");
      return;
    }

    const payload: UpdateConfigPayload = {
      maxTripDurationUnit: formData.maxTripDuration.unit,
      maxTripDurationValue: Number(formData.maxTripDuration.value || 0),
      advanceNoticeUnit: formData.advanceNotice.unit,
      advanceNoticeValue: Number(formData.advanceNotice.value || 0),
      willProvideDriver: formData.willProvideDriver === "yes",
      willProvideFuel: formData.willProvideFuel === "yes",
      supportedBookingTypeIds: formData.supportedBookingTypeIds,
      outOfBoundsAreaIds: formData.outOfBoundsAreaIds,
      outskirtFee: Number(formData.outskirtFee || 0),
      extremeFee: Number(formData.extremeFee || 0),
      extraHourlyRate: Number(formData.extraHourlyRate || 0),

      // ✅ FIX: Filter prices based on selected booking types
      pricing: Object.entries(formData.pricing)
        // 1. Only include prices for booking types that are in the supported list
        .filter(([id]) => formData.supportedBookingTypeIds.includes(id))
        // 2. Only include prices that have been set (allows "0" but not "")
        .filter(([, price]) => price !== "")
        .map(([id, price]) => ({
          bookingTypeId: id,
          price: Number(price),
          bookingTypeName:
            bookingTypes.find((bt) => bt.id === id)?.name || "Unknown",
          platformFeeType: "AUTOGIRL_FEE",
        })),

      // This logic remains correct for discounts
      discounts: Object.entries(formData.discounts)
        .filter(([, percentage]) => percentage && Number(percentage) > 0)
        .map(([id, percentage]) => ({
          discountDurationId: id,
          percentage: Number(percentage),
        })),
    };

    updateConfiguration(payload);
  };

  // --- Consolidate Loading/Error ---
  const isLoading =
    isLoadingBookingTypes ||
    isLoadingGeofence ||
    isLoadingDiscounts ||
    isLoadingVehicle;
  const isLoadingSession = sessionStatus === "loading";

  // Map dynamic data to Option[] for UI
  const bookingTypeOptions: Option[] =
    bookingTypes?.map((t) => ({ id: t.id, name: t.name })) || [];
  const geofenceAreaOptions: Option[] =
    geofenceAreas?.map((a) => ({ id: a.id, name: a.name })) || [];

  return {
    formData,
    isLoading,
    isLoadingSession,
    isUpdating,
    bookingTypes: bookingTypes || [],
    bookingTypeOptions,
    geofenceAreaOptions,
    discountDurations: discountDurations || [],
    handleInputChange,
    handleSelectChange,
    handleDurationChange,
    handleCheckboxChange,
    handlePriceChange,
    handleDiscountChange,
    handleSubmit,
  };
}

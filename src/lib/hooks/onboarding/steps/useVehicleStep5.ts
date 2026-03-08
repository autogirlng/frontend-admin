"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import { Option } from "@/components/generic/ui/Select";

export type Country = { id: string; name: string };
export type GeoState = { id: string; name: string };
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

type PublicDataApiResponse<T> = { status: string; message: string; data: T };

type VehicleConfigData = {
  id: string;
  vehicleIdentifier: string;
  maxTripDurationUnit: string | null;
  maxTripDurationValue: number | null;
  advanceNoticeUnit: string | null;
  advanceNoticeValue: number | null;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  supportedBookingTypes: { id: string }[] | null;
  outOfBoundsAreas: { id: string; name: string }[] | null;
  outskirtFee: number | null;
  extremeFee: number | null;
  pricing: { bookingTypeId: string; price: number }[] | null;
  discounts: { discountDurationId: string; percentage: number }[] | null;
  supportedStates:
    | {
        id?: string;
        stateId: string;
        stateName?: string;
        surchargeFee: number;
      }[]
    | null;
  extraHourlyRate: number | null;
};

type DurationState = { value: number | ""; unit: string };
type PriceState = { [bookingTypeId: string]: string };
type DiscountState = { [discountDurationId: string]: string };
type StateFeeState = { [stateId: string]: string };

type Step5FormData = {
  maxTripDuration: DurationState;
  advanceNotice: DurationState;
  willProvideDriver: "yes" | "no" | "";
  willProvideFuel: "yes" | "no" | "";
  supportedBookingTypeIds: string[];
  outOfBoundsAreaIds: string[];
  supportedStateIds: string[];
  stateSurchargeFees: StateFeeState;
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
type DiscountPayload = { discountDurationId: string; percentage: number };
type SupportedStatePayload = { stateId: string; surchargeFee: number };

type UpdateConfigPayload = {
  maxTripDurationUnit: string;
  maxTripDurationValue: number;
  advanceNoticeUnit: string;
  advanceNoticeValue: number;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  supportedBookingTypeIds: string[];
  outOfBoundsAreaIds: string[];
  supportedStates: SupportedStatePayload[];
  outskirtFee: number;
  extremeFee: number;
  extraHourlyRate: number;
  pricing: PricePayload[];
  discounts: DiscountPayload[];
};

const initialState: Step5FormData = {
  maxTripDuration: { value: "", unit: "DAYS" },
  advanceNotice: { value: "", unit: "DAYS" },
  willProvideDriver: "",
  willProvideFuel: "",
  supportedBookingTypeIds: [],
  outOfBoundsAreaIds: [],
  supportedStateIds: [],
  stateSurchargeFees: {},
  outskirtFee: "",
  extremeFee: "",
  extraHourlyRate: "",
  pricing: {},
  discounts: {},
};

async function fetchApiData<T>(endpoint: string): Promise<T[]> {
  const res = await apiClient.get<T[] | PublicDataApiResponse<T[]>>(endpoint);
  if (!res) throw new Error(`Failed to fetch ${endpoint}: No response`);
  if (Array.isArray(res)) return res;
  if (res && "data" in res && Array.isArray(res.data)) return res.data;
  if (res && "data" in res) return res.data as T[];
  return res as T[];
}

export function useVehicleStep5(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const [formData, setFormData] = useState<Step5FormData>(initialState);
  const [originalData, setOriginalData] = useState<Step5FormData | null>(null);

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null,
  );
  const [activeGeofenceStateId, setActiveGeofenceStateId] = useState<
    string | null
  >(null);

  const [stateNameMap, setStateNameMap] = useState<Record<string, string>>({});
  const [geofenceNameMap, setGeofenceNameMap] = useState<
    Record<string, string>
  >({});

  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => fetchApiData<Country>("/countries"),
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: states,
    isLoading: isLoadingStates,
    isFetching: isFetchingStates,
  } = useQuery({
    queryKey: ["states", selectedCountryId],
    queryFn: () =>
      fetchApiData<GeoState>(`/states/country/${selectedCountryId}`),
    enabled: !!selectedCountryId,
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: geofenceAreas,
    isLoading: isLoadingGeofence,
    isFetching: isFetchingGeofences,
  } = useQuery({
    queryKey: ["geofenceAreas", activeGeofenceStateId],
    queryFn: () =>
      fetchApiData<GeofenceArea>(
        `/geofence-areas?stateId=${activeGeofenceStateId}`,
      ),
    enabled: !!activeGeofenceStateId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: bookingTypes } = useQuery({
    queryKey: ["bookingTypes"],
    queryFn: () => fetchApiData<BookingType>("/booking-types"),
    staleTime: 1000 * 60 * 60,
  });

  const { data: discountDurations } = useQuery({
    queryKey: ["discountDurations"],
    queryFn: () => fetchApiData<DiscountDuration>("/discount-durations"),
    staleTime: 1000 * 60 * 60,
  });

  const { data: vehicleDetails, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicleDetails", vehicleId],
    queryFn: async () => {
      const res = await apiClient.get<VehicleConfigData>(
        `/vehicles/${vehicleId}`,
      );
      if (!res) throw new Error("Vehicle not found");
      return res;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  useEffect(() => {
    if (states) {
      setStateNameMap((prev) => {
        const next = { ...prev };
        states.forEach((s) => (next[s.id] = s.name));
        return next;
      });
    }
  }, [states]);

  useEffect(() => {
    if (geofenceAreas) {
      setGeofenceNameMap((prev) => {
        const next = { ...prev };
        geofenceAreas.forEach((g) => (next[g.id] = g.name));
        return next;
      });
    }
  }, [geofenceAreas]);

  useEffect(() => {
    if (vehicleDetails && bookingTypes && discountDurations && !originalData) {
      const isHostVehicle = (vehicleDetails.vehicleIdentifier || "").startsWith(
        "HST",
      );

      const initialPrices: PriceState = {};
      bookingTypes.forEach((bt) => {
        const existing = (vehicleDetails.pricing || []).find(
          (p) => p.bookingTypeId === bt.id,
        );
        initialPrices[bt.id] = String(existing?.price || "");
      });

      const initialDiscounts: DiscountState = {};
      discountDurations.forEach((dd) => {
        const existing = (vehicleDetails.discounts || []).find(
          (d) => d.discountDurationId === dd.id,
        );
        initialDiscounts[dd.id] = String(existing?.percentage || "");
      });

      const initialSupportedStateIds: string[] = [];
      const initialStateSurchargeFees: StateFeeState = {};
      const newMap: Record<string, string> = {};

      (vehicleDetails.supportedStates || []).forEach((ss) => {
        initialSupportedStateIds.push(ss.stateId);
        initialStateSurchargeFees[ss.stateId] = String(ss.surchargeFee || 0);
        if (ss.stateName) newMap[ss.stateId] = ss.stateName;
      });

      setStateNameMap((prev) => ({ ...prev, ...newMap }));

      const initialGeofenceIds: string[] = [];
      const initialGeofenceNameMap: Record<string, string> = {};

      (vehicleDetails.outOfBoundsAreas || []).forEach((area) => {
        initialGeofenceIds.push(area.id);
        initialGeofenceNameMap[area.id] = area.name;
      });

      setGeofenceNameMap((prev) => ({ ...prev, ...initialGeofenceNameMap }));

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
        outOfBoundsAreaIds: initialGeofenceIds.sort(),
        supportedStateIds: initialSupportedStateIds.sort(),
        stateSurchargeFees: initialStateSurchargeFees,
        outskirtFee: String(
          Math.max(
            0,
            (vehicleDetails.outskirtFee || 0) - (isHostVehicle ? 5000 : 0),
          ) || "",
        ),
        extremeFee: String(
          Math.max(
            0,
            (vehicleDetails.extremeFee || 0) - (isHostVehicle ? 5000 : 0),
          ) || "",
        ),
        extraHourlyRate: String(vehicleDetails.extraHourlyRate || ""),
        pricing: initialPrices,
        discounts: initialDiscounts,
      };

      setFormData(prefilledState);
      setOriginalData(prefilledState);
    }
  }, [vehicleDetails, bookingTypes, discountDurations, originalData]);

  const { mutate: updateConfiguration, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateConfigPayload) =>
      apiClient.patch(`/vehicles/configuration?id=${vehicleId}`, payload),
    onSuccess: () => {
      toast.success("Configuration saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      router.push(`/dashboard/onboarding/submit-review?id=${vehicleId}`);
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to save configuration."),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (
    field: "willProvideDriver" | "willProvideFuel",
    option: Option | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: option ? option.id : "" }));
  };

  const handleDurationChange = (
    field: "maxTripDuration" | "advanceNotice",
    value: number | "",
    unit: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: { value, unit } }));
  };

  const handleCheckboxChange = (
    field:
      | "supportedBookingTypeIds"
      | "outOfBoundsAreaIds"
      | "supportedStateIds",
    id: string,
    isChecked: boolean,
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

  const handleStateFeeChange = (stateId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stateSurchargeFees: { ...prev.stateSurchargeFees, [stateId]: value },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.info("No changes detected. Proceeding to next step.");
      router.push(`/dashboard/onboarding/submit-review?id=${vehicleId}`);
      return;
    }

    if (!bookingTypes || !discountDurations || !vehicleDetails) {
      toast.error("Data is still loading, please wait.");
      return;
    }

    const isHostVehicle = (vehicleDetails.vehicleIdentifier || "").startsWith(
      "HST",
    );
    const payload: UpdateConfigPayload = {
      maxTripDurationUnit: formData.maxTripDuration.unit,
      maxTripDurationValue: Number(formData.maxTripDuration.value || 0),
      advanceNoticeUnit: formData.advanceNotice.unit,
      advanceNoticeValue: Number(formData.advanceNotice.value || 0),
      willProvideDriver: formData.willProvideDriver === "yes",
      willProvideFuel: formData.willProvideFuel === "yes",
      supportedBookingTypeIds: formData.supportedBookingTypeIds,
      outOfBoundsAreaIds: formData.outOfBoundsAreaIds,
      supportedStates: formData.supportedStateIds.map((id) => ({
        stateId: id,
        surchargeFee: Number(formData.stateSurchargeFees[id] || 0),
      })),
      outskirtFee:
        Number(formData.outskirtFee || 0) + (isHostVehicle ? 5000 : 0),
      extremeFee: Number(formData.extremeFee || 0) + (isHostVehicle ? 5000 : 0),
      extraHourlyRate: Number(formData.extraHourlyRate || 0),
      pricing: Object.entries(formData.pricing)
        .filter(
          ([id]) =>
            formData.supportedBookingTypeIds.includes(id) &&
            formData.pricing[id] !== "",
        )
        .map(([id, price]) => ({
          bookingTypeId: id,
          price: Number(price),
          bookingTypeName:
            bookingTypes.find((bt) => bt.id === id)?.name || "Unknown",
          platformFeeType: isHostVehicle ? "HOST_FEE" : "AUTOGIRL_FEE",
        })),
      discounts: Object.entries(formData.discounts)
        .filter(([, percentage]) => percentage && Number(percentage) > 0)
        .map(([id, percentage]) => ({
          discountDurationId: id,
          percentage: Number(percentage),
        })),
    };
    updateConfiguration(payload);
  };

  const isLoading = isLoadingVehicle;

  return {
    formData,
    isLoading,
    isLoadingSession: sessionStatus === "loading",
    isUpdating,
    bookingTypes: bookingTypes || [],
    bookingTypeOptions:
      bookingTypes?.map((t) => ({ id: t.id, name: t.name })) || [],
    countries: countries || [],
    states: states || [],
    geofenceAreas: geofenceAreas || [],
    discountDurations: discountDurations || [],
    selectedCountryId,
    setSelectedCountryId,
    activeGeofenceStateId,
    setActiveGeofenceStateId,
    stateNameMap,
    geofenceNameMap,
    isFetchingStates,
    isFetchingGeofences,
    handleInputChange,
    handleSelectChange,
    handleDurationChange,
    handleCheckboxChange,
    handlePriceChange,
    handleDiscountChange,
    handleStateFeeChange,
    handleSubmit,
  };
}

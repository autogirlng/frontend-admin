"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import { Option } from "@/components/generic/ui/Select";

type PublicDataApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

type ColorOption = {
  id: string;
  name: string;
  hexCode: string;
};

type FeatureOption = {
  id: string;
  name: string;
};

type VehicleDetails = {
  id: string;
  licensePlateNumber: string | null;
  stateOfRegistration: string | null;
  vehicleColorId: string | null;
  numberOfSeats: number | null;
  description: string | null;
  features: FeatureOption[] | null;
};

type VehicleDetailsApiResponse = {
  status: string;
  message: string;
  data: VehicleDetails;
};

type Step2FormData = {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: string;
  description: string;
  featureIds: string[];
};

type UpdateVehiclePayload = {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: number;
  description: string;
  featureIds: string[];
};

const initialState: Step2FormData = {
  licensePlateNumber: "",
  stateOfRegistration: "",
  vehicleColorId: "",
  numberOfSeats: "",
  description: "",
  featureIds: [],
};

export function useVehicleDetails(vehicleId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState<Step2FormData>(initialState);

  const [originalData, setOriginalData] = useState<Step2FormData | null>(null);

  const {
    data: colors,
    isLoading: isLoadingColors,
    error: colorsError,
  } = useQuery<Option[], Error>({
    queryKey: ["vehicleColors"],
    queryFn: async () => {
      const res = await apiClient.get<
        ColorOption[] | PublicDataApiResponse<ColorOption[]>
      >("/public/vehicle-colors");

      if (!res) {
        console.error("API client returned undefined for vehicleColors");
        throw new Error("Failed to load vehicle colors.");
      }

      let data: ColorOption[];
      if (Array.isArray(res)) {
        data = res;
      } else if (res && "data" in res && Array.isArray(res.data)) {
        data = res.data;
      } else {
        console.error("Unknown response structure for vehicleColors", res);
        throw new Error("Invalid response for vehicle colors.");
      }

      return (data || []).map((c) => ({ id: c.id, name: c.name }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const {
    data: features,
    isLoading: isLoadingFeatures,
    error: featuresError,
  } = useQuery<FeatureOption[], Error>({
    queryKey: ["vehicleFeatures"],
    queryFn: async () => {
      const res = await apiClient.get<
        FeatureOption[] | PublicDataApiResponse<FeatureOption[]>
      >("/public/vehicle-features");

      if (!res) {
        console.error("API client returned undefined for vehicleFeatures");
        throw new Error("Failed to load vehicle features.");
      }

      let data: FeatureOption[];
      if (Array.isArray(res)) {
        data = res;
      } else if (res && "data" in res && Array.isArray(res.data)) {
        data = res.data;
      } else {
        console.error("Unknown response structure for vehicleFeatures", res);
        throw new Error("Invalid response for vehicle features.");
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const {
    data: vehicleDetails,
    isLoading: isLoadingVehicle,
    error: vehicleError,
  } = useQuery<VehicleDetails, Error>({
    queryKey: ["vehicleDetails", vehicleId],
    queryFn: async () => {
      const res = await apiClient.get<
        VehicleDetailsApiResponse | VehicleDetails
      >(`/vehicles/${vehicleId}`);

      if (!res) {
        console.error(
          "API client returned undefined or null for vehicleDetails."
        );
        throw new Error("Vehicle not found or API client failed.");
      }

      if (res && typeof res === "object" && "data" in res) {
        return res.data as VehicleDetails;
      }

      return res as VehicleDetails;
    },
    enabled: !!vehicleId && sessionStatus === "authenticated",
  });

  useEffect(() => {
    if (vehicleDetails) {
      const step2Data: Step2FormData = {
        licensePlateNumber: vehicleDetails.licensePlateNumber || "",
        stateOfRegistration: vehicleDetails.stateOfRegistration || "",
        vehicleColorId: vehicleDetails.vehicleColorId || "",
        numberOfSeats: vehicleDetails.numberOfSeats
          ? String(vehicleDetails.numberOfSeats)
          : "",
        description: vehicleDetails.description || "",
        featureIds: (vehicleDetails.features || []).map((f) => f.id).sort(),
      };

      if (!originalData) {
        setFormData(step2Data);
        setOriginalData(step2Data);
      }
    }
  }, [vehicleDetails, originalData]);

  const { mutate: updateVehicle, isPending: isUpdating } = useMutation<
    unknown,
    Error,
    UpdateVehiclePayload
  >({
    mutationFn: (payload) => {
      return apiClient.patch(`/vehicles?id=${vehicleId}`, payload);
    },
    onSuccess: () => {
      toast.success("Additional Details completed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetails", vehicleId],
      });
      router.push(`/dashboard/onboarding/documents?id=${vehicleId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save details. Please try again.");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (
    field: keyof Step2FormData,
    option: Option | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: option ? option.id : "" }));
  };

  const handleCheckboxChange = (featureId: string, isChecked: boolean) => {
    setFormData((prev) => {
      const newFeatureIds = isChecked
        ? [...prev.featureIds, featureId]
        : prev.featureIds.filter((id) => id !== featureId);

      newFeatureIds.sort();

      return { ...prev, featureIds: newFeatureIds };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.info("No changes detected. Proceeding to next step.");
      router.push(`/dashboard/onboarding/documents?id=${vehicleId}`);
      return;
    }

    if (!formData.licensePlateNumber || !formData.vehicleColorId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload: UpdateVehiclePayload = {
      ...formData,
      numberOfSeats: Number(formData.numberOfSeats) || 0,
    };

    updateVehicle(payload);
  };

  const isLoading = isLoadingColors || isLoadingFeatures || isLoadingVehicle;
  const isLoadingSession = sessionStatus === "loading";

  const error =
    colorsError?.message || featuresError?.message || vehicleError?.message;

  return {
    formData,
    colors: colors || [],
    features: features || [],
    isLoading,
    isLoadingSession,
    isUpdating,
    error: error || null,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit,
  };
}

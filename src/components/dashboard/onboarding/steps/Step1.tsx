"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Step1Data } from "../types/form";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import {
  useVehicleTypes,
  useVehicleMakes,
  useVehicleModels,
} from "@/lib/hooks/onboarding/generic/useVehicleMetaData";
import { useVehicleStep1 } from "@/lib/hooks/onboarding/steps/useVehicleStep1";
import { useVehicleDetails } from "@/lib/hooks/vehicles/useVehicleDetails";
import { useUpdateVehicleStep1 } from "@/lib/hooks/onboarding/steps/useUpdateVehicleStep1";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Stepper from "@/components/generic/Stepper";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

const currentStep = 1;

const years: Option[] = Array.from({ length: 20 }, (_, i) => ({
  id: (2025 - i).toString(),
  name: (2025 - i).toString(),
}));

const initialState: Step1Data = {
  vehicleListingName: "",
  locationCityId: "",
  address: "",
  vehicleTypeId: "",
  vehicleMakeId: "",
  vehicleModelId: "",
  yearOfRelease: "",
  hasInsurance: "",
  hasTracker: "",
};

const errorKeyMapping: Record<string, keyof Step1Data> = {
  name: "vehicleListingName",
  city: "locationCityId",
  vehicleTypeId: "vehicleTypeId",
  vehicleModelId: "vehicleModelId",
  yearOfRelease: "yearOfRelease",
  vehicleMakeId: "vehicleMakeId",
  address: "address",
  hasInsurance: "hasInsurance",
  hasTracker: "hasTracker",
};

export default function Step1() {
  const router = useRouter();
  const [data, setData] = useState<Step1Data>(initialState);
  const [originalData, setOriginalData] = useState<Step1Data>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [originalCoords, setOriginalCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  const updateData = (fields: Partial<Step1Data>) => {
    setData((prev) => ({ ...prev, ...fields }));
    if (Object.keys(fields).length > 0) {
      const newErrors = { ...errors };
      for (const key of Object.keys(fields)) {
        delete newErrors[key];
      }
      setErrors(newErrors);
    }
  };

  // --- Data Fetching Hooks ---
  const { data: vehicleTypes, isLoading: loadingTypes } = useVehicleTypes();
  const { data: vehicleMakes, isLoading: loadingMakes } = useVehicleMakes();
  const { data: vehicleModels, isLoading: loadingModels } = useVehicleModels();

  const { data: vehicleDetails, isLoading: isLoadingDetails } =
    useVehicleDetails(vehicleId);

  const { mutate: createVehicle, isPending: isCreating } = useVehicleStep1();
  const { mutate: updateVehicle, isPending: isUpdating } =
    useUpdateVehicleStep1();

  useEffect(() => {
    if (vehicleDetails && vehicleId) {
      const formData = {
        vehicleListingName: vehicleDetails.name || "",
        locationCityId: vehicleDetails.city || "",
        address: vehicleDetails.address || "",
        vehicleTypeId: vehicleDetails.vehicleTypeId || "",
        vehicleMakeId: vehicleDetails.vehicleMakeId || "",
        vehicleModelId: vehicleDetails.vehicleModelId || "",
        yearOfRelease: vehicleDetails.yearOfRelease
          ? String(vehicleDetails.yearOfRelease)
          : "",
        hasInsurance: vehicleDetails.hasInsurance ? "yes" : "no",
        hasTracker: vehicleDetails.hasTracker ? "yes" : "no",
      };

      const coordsData = {
        latitude: vehicleDetails.latitude,
        longitude: vehicleDetails.longitude,
      };

      console.log("Setting form data to:", formData);
      setData(formData);
      setOriginalData(formData); // Store original data

      if (vehicleDetails.latitude && vehicleDetails.longitude) {
        console.log("Setting coords:", coordsData);
        setCoords(coordsData);
        setOriginalCoords(coordsData); // Store original coords
      }
    } else {
      console.log("❌ Not populating - missing data");
    }
  }, [vehicleDetails, vehicleId, isLoadingDetails]);

  // --- Error Handling Logic ---
  const handleApiError = (err: any) => {
    console.error("API Error:", err);
    const apiErrors = err?.response?.data;

    if (apiErrors && typeof apiErrors === "object") {
      const newErrors: Record<string, string> = {};
      for (const apiKey in apiErrors) {
        const componentKey = errorKeyMapping[apiKey];
        if (componentKey) {
          newErrors[componentKey] = apiErrors[apiKey];
        }
      }
      setErrors(newErrors);
      alert("Please correct the errors highlighted on the form.");
    } else {
      alert(err.message || "An unknown error occurred.");
    }
  };

  const handleSubmit = () => {
    if (!coords) {
      setErrors((prev) => ({
        ...prev,
        address: "Please select a valid address from Google suggestions.",
      }));
      return;
    }

    // ✅ Check if anything has changed when in update mode
    if (vehicleId) {
      const hasDataChanged =
        JSON.stringify(data) !== JSON.stringify(originalData);
      const hasCoordsChanged =
        JSON.stringify(coords) !== JSON.stringify(originalCoords);

      if (!hasDataChanged && !hasCoordsChanged) {
        router.push(`/dashboard/onboarding/details?id=${vehicleId}`);
      }
    }

    const mutationData = {
      ...data,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    if (vehicleId) {
      updateVehicle(
        { ...mutationData, id: vehicleId },
        {
          onSuccess: (res: any) => {
            console.log("Success Response from Update:", res);
            router.push(`/dashboard/onboarding/details?id=${res?.id}`);
          },
          onError: handleApiError,
        }
      );
    } else {
      createVehicle(mutationData, {
        onSuccess: (res: any) => {
          console.log("Success Response from Create:", res);
          router.push(`/dashboard/onboarding/details?id=${res?.id}`);
        },
        onError: handleApiError,
      });
    }
  };

  // ✅ Helper functions to get selected options with proper structure
  const getSelectedVehicleType = (): Option | null => {
    if (!data.vehicleTypeId || !vehicleTypes) return null;
    const type = vehicleTypes.find((t) => t.id === data.vehicleTypeId);
    return type ? { id: type.id, name: type.name } : null;
  };

  const getSelectedVehicleMake = (): Option | null => {
    if (!data.vehicleMakeId || !vehicleMakes) return null;
    const make = vehicleMakes.find((m) => m.id === data.vehicleMakeId);
    return make ? { id: make.id, name: make.name } : null;
  };

  const getSelectedVehicleModel = (): Option | null => {
    if (!data.vehicleModelId || !vehicleModels) return null;
    const model = vehicleModels.find((m) => m.id === data.vehicleModelId);
    return model ? { id: model.id, name: model.name } : null;
  };

  const getSelectedYear = (): Option | null => {
    if (!data.yearOfRelease) return null;
    return years.find((y) => y.id === data.yearOfRelease) || null;
  };

  const getSelectedInsurance = (): Option | null => {
    if (!data.hasInsurance) return null;
    return {
      id: data.hasInsurance,
      name: data.hasInsurance === "yes" ? "Yes" : "No",
    };
  };

  const getSelectedTracker = (): Option | null => {
    if (!data.hasTracker) return null;
    return {
      id: data.hasTracker,
      name: data.hasTracker === "yes" ? "Yes" : "No",
    };
  };

  // Debug: Log current form state
  useEffect(() => {
    console.log("📋 Current form state:", data);
  }, [data]);

  // --- State Computations ---
  const isFormIncomplete =
    Object.values(data).some((value) => value === "") || !coords;

  const isPending = isCreating || isUpdating;
  const isLoading =
    loadingTypes || loadingMakes || loadingModels || isLoadingDetails;

  if (isLoadingDetails && vehicleId) {
    return <CustomLoader />;
  }

  return (
    <div className="relative min-h-screen pb-24 bg-white">
      <CustomBack />
      <Stepper currentStep={currentStep} />
      <main className="max-w-8xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Vehicle Listing Name */}
              <TextInput
                id="vehicleListingName"
                label="Vehicle Listing Name"
                value={data.vehicleListingName}
                onChange={(e) =>
                  updateData({ vehicleListingName: e.target.value })
                }
                error={errors.vehicleListingName}
              />

              {/* City */}
              <TextInput
                id="locationCityId"
                label="City"
                value={data.locationCityId}
                onChange={(e) => updateData({ locationCityId: e.target.value })}
                error={errors.locationCityId}
              />

              {/* Address (Google Maps Autocomplete) */}
              <div className="md:col-span-2">
                <AddressInput
                  id="address"
                  label="Address"
                  value={data.address}
                  onChange={(val) => updateData({ address: val })}
                  error={errors.address}
                  onLocationSelect={(coords) => setCoords(coords)}
                />
              </div>

              {/* Vehicle Type */}
              <Select
                label="Vehicle Type"
                options={
                  loadingTypes
                    ? []
                    : (vehicleTypes || []).map((t) => ({
                        id: t.id,
                        name: t.name,
                      }))
                }
                selected={getSelectedVehicleType()}
                onChange={(option) => updateData({ vehicleTypeId: option.id })}
                error={errors.vehicleTypeId}
              />

              {/* Vehicle Make */}
              <Select
                label="Vehicle Make"
                options={
                  loadingMakes
                    ? []
                    : (vehicleMakes || []).map((m) => ({
                        id: m.id,
                        name: m.name,
                      }))
                }
                selected={getSelectedVehicleMake()}
                onChange={(option) => updateData({ vehicleMakeId: option.id })}
                error={errors.vehicleMakeId}
              />

              {/* Vehicle Model */}
              <Select
                label="Vehicle Model"
                options={
                  loadingModels || !data.vehicleMakeId
                    ? []
                    : (vehicleModels || [])
                        .filter((m) => m.makeId === data.vehicleMakeId)
                        .map((m) => ({
                          id: m.id,
                          name: m.name,
                        }))
                }
                selected={getSelectedVehicleModel()}
                onChange={(option) => updateData({ vehicleModelId: option.id })}
                error={errors.vehicleModelId}
              />

              {/* Year of Release */}
              <Select
                label="Year of Release"
                options={years}
                selected={getSelectedYear()}
                onChange={(option) => updateData({ yearOfRelease: option.id })}
                placeholder="Select year of release"
                error={errors.yearOfRelease}
              />

              {/* Insurance */}
              <Select
                label="Has Insurance?"
                options={[
                  { id: "yes", name: "Yes" },
                  { id: "no", name: "No" },
                ]}
                selected={getSelectedInsurance()}
                onChange={(option) => updateData({ hasInsurance: option.id })}
                error={errors.hasInsurance}
              />

              {/* Tracker */}
              <Select
                label="Has Tracker?"
                options={[
                  { id: "yes", name: "Yes" },
                  { id: "no", name: "No" },
                ]}
                selected={getSelectedTracker()}
                onChange={(option) => updateData({ hasTracker: option.id })}
                error={errors.hasTracker}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <TipsSidebar currentStep={currentStep} />
          </div>
        </div>
      </main>

      {/* Fixed bottom bar for the button */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end py-4">
            <Button
              type="button"
              disabled={isLoading || isPending || isFormIncomplete}
              onClick={handleSubmit}
            >
              {isLoading ? "Loading..." : isPending ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

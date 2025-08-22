// useAvailabilityAndPricingForm.ts
"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
  AvailabilityAndPricing,
  AvailabilityAndPricingValues,
  ErrorResponse,
  VehicleInformation,
} from "@/utils/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useState } from "react";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { LocalRoute } from "@/utils/LocalRoutes";
import { stripNonNumeric } from "@/utils/formatters";

export default function useAvailabilityAndPricingForm({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
  const [showOuskirts, setShowOuskirts] = useState<boolean>(
    Array.isArray(vehicle?.outskirtsLocation) &&
      vehicle.outskirtsLocation.length > 0
  );

  // NEW: State for extreme areas visibility
  const [showExtremeAreas, setShowExtremeAreas] = useState<boolean>(
    Array.isArray(vehicle?.extremeAreasLocation) &&
      vehicle.extremeAreasLocation.length > 0
  );

  const [showDiscounts, setShowDiscounts] = useState<boolean>(
    !!(
      vehicle?.pricing?.discounts?.[0]?.percentage ||
      vehicle?.pricing?.discounts?.[1]?.percentage ||
      vehicle?.pricing?.discounts?.[2]?.percentage
    )
  );

  const initialValues: AvailabilityAndPricingValues = {
    advanceNoticeInDays: vehicle?.tripSettings?.advanceNotice || "",
    minTripDurationInDays: "1 day",
    maxTripDurationInDays: vehicle?.tripSettings?.maxTripDuration || "",
    driverProvided:
      vehicle?.tripSettings?.provideDriver === undefined ||
      vehicle?.tripSettings?.provideDriver === null
        ? ""
        : vehicle?.tripSettings?.provideDriver
        ? "yes"
        : "no",
    fuelProvided:
      vehicle?.tripSettings?.fuelProvided === undefined ||
      vehicle?.tripSettings?.fuelProvided === null
        ? ""
        : vehicle?.tripSettings?.fuelProvided
        ? "yes"
        : "no",
    dailyRate: `${vehicle?.pricing?.dailyRate?.value || ""}`,
    extraHourRate: `${vehicle?.pricing?.extraHoursFee || ""}`,
    airportPickup: `${vehicle?.pricing?.airportPickupFee || ""}`,
    threeDaysDiscount: `${vehicle?.pricing?.discounts[0]?.percentage || ""}`,
    sevenDaysDiscount: `${vehicle?.pricing?.discounts[1]?.percentage || ""}`,
    thirtyDaysDiscount: `${vehicle?.pricing?.discounts[2]?.percentage || ""}`,
    outskirtsLocation: vehicle?.outskirtsLocation || [],
    outskirtsPrice: `${vehicle?.outskirtsPrice || ""}`,
    // NEW: Add initial values for extreme areas
    extremeAreasLocation: vehicle?.extremeAreasLocation || [],
    extremeAreaPrice: `${vehicle?.extremeAreaPrice || ""}`,
  };

  const mapValuesToApiPayload = (values: AvailabilityAndPricingValues) => {
    const parseNumericValue = (value: string) => {
      const cleanValue = stripNonNumeric(value).replace(/,/g, "");
      return parseFloat(cleanValue) || 0;
    };

    return {
      tripSettings: {
        advanceNotice: values.advanceNoticeInDays,
        maxTripDuration: values.maxTripDurationInDays,
        provideDriver: values.driverProvided === "yes",
        fuelProvided: values.fuelProvided === "yes",
      },
      pricing: {
        dailyRate: {
          value: parseNumericValue(values.dailyRate),
          unit: "NGN_KM",
        },
        extraHoursFee: parseNumericValue(values.extraHourRate),
        airportPickupFee: parseNumericValue(values.airportPickup),
        discounts: [
          {
            durationInDays: 3,
            percentage: parseNumericValue(values.threeDaysDiscount),
          },
          {
            durationInDays: 7,
            percentage: parseNumericValue(values.sevenDaysDiscount),
          },
          {
            durationInDays: 30,
            percentage: parseNumericValue(values.thirtyDaysDiscount),
          },
        ],
      },
      outskirtsLocation: values.outskirtsLocation,
      outskirtsPrice: parseFloat(stripNonNumeric(values.outskirtsPrice)),
      // NEW: Add extreme area fields to the API payload
      extremeAreasLocation: values.extremeAreasLocation,
      extremeAreaPrice: parseNumericValue(values.extremeAreaPrice),
    };
  };
  const { host } = useAppSelector((state) => state.host);
  let hostId;
  if (vehicle?.userId) {
    hostId = vehicle?.userId;
  } else {
    hostId = host?.id;
  }
  const saveStep4 = useMutation({
    mutationFn: (values: AvailabilityAndPricing) =>
      http.put<VehicleInformation>(
        `${ApiRoutes.vehicleOnboarding}/${hostId}/step4/${vehicle?.id}`,
        values
      ),
    onSuccess: (data) => {
      dispatch(
        updateVehicleInformation({ ...vehicle, ...data } as VehicleInformation)
      );
      router.push(LocalRoute.fleetPage);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 4"),
  });
  const submitStep4 = useMutation({
    mutationFn: (values: AvailabilityAndPricing) =>
      http.put<VehicleInformation>(
        `${ApiRoutes.vehicleOnboarding}/${hostId}/step4/${vehicle?.id}`,
        values
      ),
    onSuccess: (data) => {
      dispatch(
        updateVehicleInformation(
          // @ts-ignore
          { ...vehicle, ...data }
        )
      );
      setCurrentStep(currentStep + 1);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 4"),
  });

  return {
    submitStep4,
    saveStep4,
    vehicle,
    mapValuesToApiPayload,
    initialValues,
    showOuskirts,
    setShowOuskirts,
    showDiscounts,
    setShowDiscounts,
    // NEW: Export extreme area state and setter
    showExtremeAreas,
    setShowExtremeAreas,
  };
}

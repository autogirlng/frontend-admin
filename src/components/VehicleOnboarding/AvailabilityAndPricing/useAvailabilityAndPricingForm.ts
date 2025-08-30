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

const findBookingPrice = (
  bookingPrices: { type: string; price: number }[] | undefined,
  bookingTypeToFind: string
) => {
  if (!bookingPrices) return "";
  const found = bookingPrices.find((p) => p.type === bookingTypeToFind);
  return found ? `${found.price}` : "";
};

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
    oneHourRate: findBookingPrice(
      vehicle?.pricing?.bookingTypePrices,
      "AN_HOUR"
    ),
    threeHoursRate: findBookingPrice(
      vehicle?.pricing?.bookingTypePrices,
      "THREE_HOURS"
    ),
    sixHoursRate: findBookingPrice(
      vehicle?.pricing?.bookingTypePrices,
      "SIX_HOURS"
    ),
    twelveHoursRate: findBookingPrice(
      vehicle?.pricing?.bookingTypePrices,
      "TWELVE_HOURS"
    ),
    threeDaysDiscount: `${vehicle?.pricing?.discounts[0]?.percentage || ""}`,
    sevenDaysDiscount: `${vehicle?.pricing?.discounts[1]?.percentage || ""}`,
    thirtyDaysDiscount: `${vehicle?.pricing?.discounts[2]?.percentage || ""}`,
    outskirtsLocation: vehicle?.outskirtsLocation || [],
    outskirtsPrice: `${vehicle?.outskirtsPrice || ""}`,
    extremeAreasLocation: vehicle?.extremeAreasLocation || [],
    extremeAreaPrice: `${vehicle?.extremeAreaPrice || ""}`,
  };

  const mapValuesToApiPayload = (values: AvailabilityAndPricingValues) => {
    const parseNumericValue = (value: string) => {
      const cleanValue = stripNonNumeric(value).replace(/,/g, "");
      return parseFloat(cleanValue) || 0;
    };

    const bookingTypePrices = [];
    if (values.oneHourRate) {
      bookingTypePrices.push({
        // Fix 1: Change 'type' back to 'bookingType' to match API expectation
        bookingType: "AN_HOUR",
        price: parseNumericValue(values.oneHourRate),
      });
    }
    if (values.threeHoursRate) {
      bookingTypePrices.push({
        bookingType: "THREE_HOURS",
        price: parseNumericValue(values.threeHoursRate),
      });
    }
    if (values.sixHoursRate) {
      bookingTypePrices.push({
        bookingType: "SIX_HOURS",
        price: parseNumericValue(values.sixHoursRate),
      });
    }
    if (values.twelveHoursRate) {
      bookingTypePrices.push({
        bookingType: "TWELVE_HOURS",
        price: parseNumericValue(values.twelveHoursRate),
      });
    }

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
          currency: null,
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
        bookingTypePrices: bookingTypePrices,
      },
      outskirtsLocation: values.outskirtsLocation,
      outskirtsPrice: parseFloat(stripNonNumeric(values.outskirtsPrice)),
      extremeAreasLocation: values.extremeAreasLocation,
      extremeAreaPrice: parseNumericValue(values.extremeAreaPrice),
      // Fix 2: Use a type assertion to satisfy TypeScript despite the API inconsistency
    } as unknown as AvailabilityAndPricing;
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
      const updatedVehicleData = {
        ...vehicle,
        ...data,
        pricing: {
          ...vehicle?.pricing,
          ...data?.pricing,
        },
      };
      dispatch(
        updateVehicleInformation(updatedVehicleData as VehicleInformation)
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
      const updatedVehicleData = {
        ...vehicle,
        ...data,
        pricing: {
          // @ts-ignore
          ...vehicle?.pricing,
          ...data?.pricing,
        },
      };
      // @ts-ignore
      dispatch(updateVehicleInformation(updatedVehicleData));
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
    showExtremeAreas,
    setShowExtremeAreas,
  };
}

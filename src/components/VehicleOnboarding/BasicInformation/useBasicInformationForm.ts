// @/components/VehicleOnboarding/BasicInformation/useBasicInformationForm.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { debounce, handleErrors } from "@/utils/functions";
import {
  BasicVehicleInformationValues,
  ErrorResponse,
  VehicleInformation,
} from "@/utils/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { LocalRoute } from "@/utils/LocalRoutes";

type GooglePlace = {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export default function useBasicInformationForm({
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
  const [searchAddressQuery, setSearchAddressQuery] = useState("");
  const [googlePlaces, setGooglePlaces] = useState<GooglePlace[]>([]);
  const [searchAddressError, setSearchAddressError] = useState("");
  const [searchAddressLoading, setSearchAddressLoading] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);

  const initialValues: BasicVehicleInformationValues = {
    listingName: vehicle?.listingName || "",
    location: vehicle?.location || "",
    address: vehicle?.address || "",
    longitude: vehicle?.locationMain?.coordinates?.[0]?.toString() || "",
    latitude: vehicle?.locationMain?.coordinates?.[1]?.toString() || "",
    vehicleType: vehicle?.vehicleType || "",
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    yearOfRelease: vehicle?.yearOfRelease || "",
    hasInsurance:
      vehicle?.hasInsurance === undefined || vehicle?.hasInsurance === null
        ? ""
        : vehicle?.hasInsurance
        ? "yes"
        : "no",
    hasTracker:
      vehicle?.hasTracker === undefined || vehicle?.hasTracker === null
        ? ""
        : vehicle?.hasTracker
        ? "yes"
        : "no",
  };

  const fetchPlaces = async (query: string) => {
    setSearchAddressLoading(true);
    setSearchAddressError("");

    try {
      const response = await axios.post(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          textQuery: query,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.location",
          },
        }
      );

      setGooglePlaces(response.data.places || []);
    } catch (err) {
      console.error(err);
      setSearchAddressError("Error fetching places. Please try again later.");
      setGooglePlaces([]);
    } finally {
      setSearchAddressLoading(false);
      setShowAddressList(true);
    }
  };

  const debouncedFetchPlaces = useCallback(
    debounce((query) => {
      fetchPlaces(query);
    }, 1500),
    []
  );

  useEffect(() => {
    if (searchAddressQuery.length >= 1) {
      debouncedFetchPlaces(searchAddressQuery);
    }
  }, [searchAddressQuery, debouncedFetchPlaces]);

  const { host } = useAppSelector((state) => state.host);
  let hostId = vehicle?.userId || host?.id;
  if (!hostId) {
    console.error("No host ID available");
    hostId = "";
  }

  const createApiPayload = (values: BasicVehicleInformationValues) => {
    const payload: any = {
      ...values,
      hasTracker: values.hasTracker === "yes",
      hasInsurance: values.hasInsurance === "yes",
      ...(vehicle?.id && { id: vehicle.id }),

      locationMain: {
        type: "Point",
        coordinates: [
          parseFloat(values.longitude),
          parseFloat(values.latitude),
        ],
      },
    };

    delete payload.latitude;
    delete payload.longitude;

    return payload;
  };

  const saveStep1 = useMutation({
    mutationFn: (values: BasicVehicleInformationValues) => {
      const payload = createApiPayload(values);
      return http.put<VehicleInformation>(
        `${ApiRoutes.vehicleOnboarding}/${hostId}/step1`,
        payload
      );
    },
    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 1 Saved", data);
      dispatch(
        // @ts-ignore
        updateVehicleInformation({ ...vehicle, ...data })
      );
      router.push(LocalRoute.fleetPage);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 1"),
  });

  const submitStep1 = useMutation({
    mutationFn: (values: BasicVehicleInformationValues) => {
      const payload = createApiPayload(values);
      return http.put<VehicleInformation>(
        `${ApiRoutes.vehicleOnboarding}/${hostId}/step1`,
        payload
      );
    },
    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 1 Submitted", data);
      dispatch(
        // @ts-ignore
        updateVehicleInformation({ ...vehicle, ...data })
      );
      setCurrentStep(currentStep + 1);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 1"),
  });

  return {
    submitStep1,
    saveStep1,
    vehicle,
    initialValues,
    searchAddressQuery,
    googlePlaces,
    searchAddressError,
    searchAddressLoading,
    setSearchAddressQuery,
    showAddressList,
    setShowAddressList,
  };
}

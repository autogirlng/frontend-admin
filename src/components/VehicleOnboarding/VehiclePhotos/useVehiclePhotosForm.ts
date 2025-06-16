"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import { photoViewOptions } from "@/utils/data";
import { ErrorResponse, VehiclePhotos } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

export default function useVehiclePhotosForm({
  setPhotoTipIndex,
  currentStep,
  setCurrentStep,
}: {
  setPhotoTipIndex: Dispatch<SetStateAction<number>>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const appendFormData = (values: VehiclePhotos) => {
    const formData = new FormData();
    photoViewOptions.forEach((item) => {
      formData.append(item.name, values[item.name as keyof VehiclePhotos]);
    });
    return formData;
  };

  const initialValues: VehiclePhotos = {
    frontView: vehicle?.VehicleImage?.frontView || "",
    backView: vehicle?.VehicleImage?.backView || "",
    sideView1: vehicle?.VehicleImage?.sideView1 || "",
    sideView2: vehicle?.VehicleImage?.sideView2 || "",
    interior: vehicle?.VehicleImage?.interior || "",
    other: vehicle?.VehicleImage?.other || "",
  };

  const [photoViews, setPhotoViews] = useState(
    photoViewOptions.map((view, index) => ({
      ...view,
      disabled:
        index === 0
          ? false
          : !initialValues[
              photoViewOptions[index - 1].name as keyof VehiclePhotos
            ],
    }))
  );

  useEffect(() => {
    console.log(photoViews);
  }, [photoViews]);

  const { host } = useAppSelector((state) => state.host);
  let hostId;
  if (vehicle?.userId) {
    hostId = vehicle?.userId;
  } else {
    hostId = host?.id;
  }

  const saveStep3 = useMutation({
    mutationFn: (values: FormData) =>
      http.put(
        `${ApiRoutes.vehicleOnboarding}/${hostId}/step3/${vehicle?.id}`,
        values
      ),

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 3 Saved", data);
      dispatch(
        // @ts-ignore
        updateVehicleInformation({ ...vehicle, VehicleImage: data })
      );
      router.push("/listings");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 3"),
  });

  const submitStep3 = useMutation({
    mutationFn: (values: FormData) =>
      http.put(
        `${ApiRoutes.vehicleOnboarding}/${hostId}/step3/${vehicle?.id}`,
        values
      ),

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 3 Submitted", data);
      dispatch(
        // @ts-ignore
        updateVehicleInformation({ ...vehicle, VehicleImage: data })
      );
      setCurrentStep(currentStep + 1);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 3"),
  });

  return {
    initialValues,
    photoViews,
    setPhotoViews,
    submitStep3,
    saveStep3,
    vehicle,
    appendFormData,
    photoViewOptions,
  };
}

"use client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
  DocumentVehicleInformationValues,
  ErrorResponse,
  // VehicleInformation,
} from "@/utils/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useRouter } from "next/navigation";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

export default function useDocumentInformationForm({
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

  const initialValues: DocumentVehicleInformationValues = {
    authorizationLetter: vehicle?.document?.authorizationLetter ?? "",
    insuranceCertificate: vehicle?.document?.insuranceCertificate ?? "",
    maintenanceHistory: vehicle?.document?.maintenanceHistory ?? "",
    proofOfOwnership: vehicle?.document?.proofOfOwnership ?? "",
    vehicleInspectionReport: vehicle?.document?.vehicleInspectionReport ?? "",
    vehicleRegistration: vehicle?.document?.vehicleRegistration ?? "",
  };

  const { host } = useAppSelector((state) => state.host);
  const saveStep5 = useMutation({
    mutationFn: (formData: FormData) => {
      // Expecting FormData
      return http.put(
        `${ApiRoutes.vehicleOnboarding}/${host?.id}/step5/${vehicle?.id}`,
        formData
      );
    },
    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 5 Saved", data);
      dispatch(
        updateVehicleInformation(
          // @ts-ignore
          { ...vehicle, document: data }
        )
      );
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 5 Save"),
  });

  const submitStep5 = useMutation({
    mutationFn: (formData: FormData) => {
      // Expecting FormData
      return http.put(
        `${ApiRoutes.vehicleOnboarding}/${host?.id}/step5/${vehicle?.id}`,
        formData
      );
    },
    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 5 Submitted", data);
      dispatch(
        updateVehicleInformation(
          // @ts-ignore
          { ...vehicle, document: data }
        )
      );
      setCurrentStep(currentStep + 1);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 5 Submit"),
  });

  return {
    submitStep5,
    saveStep5,
    vehicle,
    initialValues,
  };
}

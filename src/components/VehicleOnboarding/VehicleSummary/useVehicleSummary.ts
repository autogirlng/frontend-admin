"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import {
  ErrorResponse,
  MappedInformation,
  VehicleInformation,
} from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import Icons from "@/components/shared/icons";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

type VehiclePerksProp = {
  icon: ReactNode;
  name: string;
  id: string;
  status: boolean;
};

const vehicleSummaryPerks: VehiclePerksProp[] = [
  {
    icon: Icons.ic_driver_provided,
    name: "Driver Provided",
    id: "provideDriver",
    status: false,
  },
  {
    icon: Icons.ic_fuel_station,
    name: "20 ltrs Fuel Included",
    id: "fuelProvided",
    status: false,
  },
  {
    icon: Icons.ic_remove_calendar,
    name: "Free Cancellation",
    id: "freeCancelation",
    status: true,
  },
  // {
  //   icon: Icons.ic_self_drive,
  //   name: "Self Drive",
  //   id: "selfDrive",
  //   status: false,
  // },
  {
    icon: Icons.ic_checkmark_badge,
    name: "Vehicle insured",
    id: "hasInsurance",
    status: false,
  },
  {
    icon: Icons.ic_car_tracker,
    name: "Tracker Enabled",
    id: "hasTracker",
    status: false,
  },
];

export default function useVehicleSummary({
  vehicle,
  currentStep,
  setCurrentStep,
}: {
  vehicle: VehicleInformation | null;
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
}) {
  const http = useHttp();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [perks, setPerks] = useState<VehiclePerksProp[]>(vehicleSummaryPerks);
  const [vehicleDetails, setVehicleDetails] = useState<MappedInformation[]>([]);
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  useEffect(() => {
    if (vehicle) {
      setPerks((prevPerks) =>
        prevPerks.map((perk) => {
          switch (perk.id) {
            case "provideDriver":
              return {
                ...perk,
                status: vehicle?.tripSettings?.provideDriver || false,
              };
            case "fuelProvided":
              return {
                ...perk,
                status: vehicle?.tripSettings?.fuelProvided || false,
              };
            case "hasInsurance":
              return {
                ...perk,
                status: vehicle?.hasInsurance || false,
              };
            case "hasTracker":
              return {
                ...perk,
                status: vehicle?.hasTracker || false,
              };
            default:
              return perk;
          }
        })
      );
      const mappedVehicleDetails: MappedInformation[] = [
        { make: vehicle?.make || "N/A" },
        { model: vehicle?.model || "N/A" },
        { year: vehicle?.yearOfRelease || "N/A" },
        { colour: vehicle?.vehicleColor || "N/A" },
        { city: vehicle?.location || "N/A" },
        { vehicleType: vehicle?.vehicleType || "N/A" },
        { seatingCapacity: vehicle?.numberOfSeats || "N/A" },
      ];

      setVehicleDetails(mappedVehicleDetails);

      const mappedVehicleImages = [
        vehicle?.VehicleImage?.frontView,
        vehicle?.VehicleImage?.backView,
        vehicle?.VehicleImage?.sideView1,
        vehicle?.VehicleImage?.sideView2,
        vehicle?.VehicleImage?.interior,
        vehicle?.VehicleImage?.other,
      ];
      setVehicleImages(mappedVehicleImages);
    }
  }, [vehicle]);

  const { host } = useAppSelector((state) => state.host);
  const submitVehicleOnboarding = useMutation({
    mutationFn: () =>
      http.put<VehicleInformation>(
        `${ApiRoutes.vehicleOnboarding}/${host?.id}/submit-summary/${vehicle?.id}`
      ),

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Submitted for Review Successful", data);
      dispatch(
        updateVehicleInformation(
          // @ts-ignore
          { ...vehicle, ...data }
        )
      );
      router.push(`/dashboard/vehicle-onboarding/success/${vehicle?.id}`);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Submitted for Review"),
  });

  return {
    submitVehicleOnboarding,
    vehicle,
    perks,
    vehicleDetails,
    vehicleImages,
    agreeToTerms,
    setAgreeToTerms,
  };
}

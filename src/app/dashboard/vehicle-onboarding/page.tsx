"use client";
import cn from "classnames";
import BackLink from "@/components/BackLink";
import AdditionalInformation from "@/components/VehicleOnboarding/AdditionalInformation";
import AvailabilityAndPricing from "@/components/VehicleOnboarding/AvailabilityAndPricing";
import BasicVehicleInformation from "@/components/VehicleOnboarding/BasicInformation";
import VehiclePhotos from "@/components/VehicleOnboarding/VehiclePhotos";
import VehicleSummary from "@/components/VehicleOnboarding/VehicleSummary";
import { Stepper } from "@/components/shared/stepper";
import useVehicleOnboarding from "@/hooks/vehicleOnboarding";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import DocumentInformation from "@/components/VehicleOnboarding/DocumentInformation";

const steps = [
  "Basic Details",
  "Additional Details",
  "Documents",
  "Photos",
  "Availability and Pricing",
];

export default function VehicleOnboardingPage() {
  const { isLoading } = useVehicleOnboarding();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleCurrentStep = (step: number) => {
    setCurrentStep(step);
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <main className="pb-[188px] pt-[52px] md:pt-16 px-8 lg:px-[52px] min-h-screen">
      <div
        className={cn(
          "mx-auto space-y-8 md:space-y-[52px]",
          currentStep === 5
            ? "max-w-[1020px] 3xl:max-w-[1120px]"
            : "max-w-[1492px]"
        )}
      >
        <div className="space-y-8">
          <BackLink backLink="/dashboard" />
          <h2 className="text-h5 md:text-h3 3xl:text-4xl text-black">
            {currentStep === 5 ? "Summary" : "Vehicle Onboarding"}
          </h2>
        </div>
        <Stepper steps={steps} currentStep={currentStep}>
          {currentStep === 0 && (
            <BasicVehicleInformation
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={handleCurrentStep}
            />
          )}
          {currentStep === 1 && (
            <AdditionalInformation
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={handleCurrentStep}
            />
          )}
          {/* upload docs */}
          {currentStep === 2 && (
            <DocumentInformation
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={handleCurrentStep}
            />
          )}
          {currentStep === 3 && (
            <VehiclePhotos
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={handleCurrentStep}
            />
          )}
          {currentStep === 4 && (
            <AvailabilityAndPricing
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={handleCurrentStep}
            />
          )}
          {currentStep === 5 && (
            <VehicleSummary
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={handleCurrentStep}
            />
          )}
        </Stepper>
      </div>
    </main>
  );
}

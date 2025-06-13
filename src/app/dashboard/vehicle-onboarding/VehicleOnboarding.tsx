// VehicleOnboardingPage.tsx
"use client";

import cn from "classnames";
import BackLink from "@/components/BackLink";
import AdditionalInformation from "@/components/VehicleOnboarding/AdditionalInformation";
import AvailabilityAndPricing from "@/components/VehicleOnboarding/AvailabilityAndPricing";
import BasicVehicleInformation from "@/components/VehicleOnboarding/BasicInformation";
import VehiclePhotos from "@/components/VehicleOnboarding/VehiclePhotos";
import VehicleSummary from "@/components/VehicleOnboarding/VehicleSummary";
import { Stepper } from "@/components/shared/stepper";
import useVehicleOnboarding from "@/hooks/vehicleOnboarding"; // <-- This hook uses useSearchParams
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState, Suspense } from "react"; // Suspense import is removed from here
import DocumentInformation from "@/components/VehicleOnboarding/DocumentInformation";
import HostInformationCard from "@/components/cards/HostCard";
// import { LocalRoute } from "@/utils/LocalRoutes";
import { useAppSelector } from "@/lib/hooks";
import { LocalRoute } from "@/utils/LocalRoutes";

const steps = [
  "Basic Details",
  "Additional Details",
  "Documents",
  "Photos",
  "Availability and Pricing",
];

export default function VehicleOnboardingPage() {
  const { isLoading, data } = useVehicleOnboarding();

  const { host } = useAppSelector((state) => state.host);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleCurrentStep = (step: number) => {
    setCurrentStep(step);
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  console.log("Vehicle Onboarding Data:", data);

  return (
    <Suspense>
      {/* is NOT needed here because this whole component is already "use client" */}
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
            <BackLink backLink={LocalRoute.dashboardPage} />
            <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
              <h2 className="text-h5 md:text-h3 3xl:text-4xl text-black">
                {currentStep === 5 ? "Summary" : "Vehicle Onboarding"}
              </h2>
              {/* {data != null ? (
              // <HostInformationCard
              //   name={`${data?.user?.lastName} ${data.user?.firstName ?? "-"}`}
              //   email={data?.user?.email ?? "-"}
              //   businessName={data?.user?.businessName ?? "-"}
              //   businessLocation={data?.user?.businessAddress ?? "-"}
              // />
            ) : ( */}
              <HostInformationCard
                name={`${host?.lastName} ${host?.firstName ?? "-"}`}
                email={host?.email ?? "-"}
                businessName={host?.businessName ?? "-"}
                businessLocation={host?.businessAddress ?? "-"}
              />
              {/* )} */}
            </div>
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
            {/* upload photos */}
            {currentStep === 3 && (
              <VehiclePhotos
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={handleCurrentStep}
              />
            )}
            {/* availability and pricing */}
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
    </Suspense>
  );
}

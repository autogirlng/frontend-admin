import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import VehicleOnboardingPage from "./VehicleOnboarding";

export default function VehicleOnboardingRoutePage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <VehicleOnboardingPage />
    </Suspense>
  );
}

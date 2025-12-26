import { Suspense } from "react";
import VehicleOnboarding from "@/components/dashboard/vehicle-onboarding/VehicleOnboarding";
import CustomLoader from "@/components/generic/CustomLoader";

export default function VehicleOnboardingPage() {
  return (
    <Suspense fallback={<CustomLoader />}>
      <VehicleOnboarding />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import VehicleOnboarding from "@/components/dashboard/onboarding/VehicleOnboarding";
import CustomLoader from "@/components/generic/CustomLoader";

export default function VehicleOnboardingPage() {
  return (
    <Suspense fallback={<CustomLoader />}>
      <VehicleOnboarding />
    </Suspense>
  );
}

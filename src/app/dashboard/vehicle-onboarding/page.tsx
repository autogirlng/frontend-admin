// app/vehicle-onboarding/page.tsx (or wherever this route's page file is)
// This file is a Server Component by default. DO NOT add "use client"; here.

import { Suspense } from "react"; // Import Suspense from React// Assuming VehicleOnboardingPage is in the same directory, or adjust path
import { FullPageSpinner } from "@/components/shared/spinner"; // Assuming you want to use this for fallback
import VehicleOnboardingPage from "./VehicleOnboarding";

export default function VehicleOnboardingRoutePage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <VehicleOnboardingPage />
    </Suspense>
  );
}

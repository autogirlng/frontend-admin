import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import HostOnboardingComponent from "@/components/host/HostOnboarding";

export default function HostOnboardingPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <HostOnboardingComponent />
    </Suspense>
  );
}

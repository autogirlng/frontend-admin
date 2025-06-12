import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import HostOnboardingComponent from "@/components/host/HostOnboarding";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function HostOnboardingPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <DashboardLayout title="Host Onboarding" currentPage="Host">
        <HostOnboardingComponent />
      </DashboardLayout>
    </Suspense>
  );
}

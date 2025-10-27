// app/components/steps/Step4.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Stepper from "@/components/generic/Stepper";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Button from "@/components/generic/ui/Button";
import {
  useVehicleDocuments,
  documentList, // Import the list from the hook
} from "@/lib/hooks/onboarding/steps/useVehicleStep4"; // Our new hook
import FileUploadCard from "@/components/generic/ui/FileUploadCardCustom";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

const currentStep = 3; // This is Step 4

// --- Child Form Component ---
function DocumentUploadForm({ vehicleId }: { vehicleId: string }) {
  const {
    docStates,
    isLoading,
    isLoadingSession,
    isSubmitting,
    updateDocumentState,
    handleSubmit,
  } = useVehicleDocuments(vehicleId);

  if (isLoading || isLoadingSession) {
    return <CustomLoader />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      <div className="lg:col-span-2">
        <fieldset disabled={isSubmitting} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentList.map((docConfig) => {
              const state = docStates[docConfig.type];
              if (!state) return null; // Don't render if state isn't initialized

              return (
                <FileUploadCard
                  key={docConfig.type}
                  label={docConfig.label}
                  isCompulsory={docConfig.isCompulsory}
                  docState={state}
                  onStateChange={(newState) =>
                    updateDocumentState(docConfig.type, newState)
                  }
                />
              );
            })}
          </div>

          <div className="md:col-span-2 flex justify-between gap-4 pt-4">
            <Link
              href={`/dashboard/onboarding/details?id=${vehicleId}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-[#0096FF] text-sm font-medium shadow-sm text-white bg-[#0096FF] hover:bg-[#007ACC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Additional Details
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Saving..." : "Photos"}
            </Button>
          </div>
        </fieldset>
      </div>
      <div className="lg:col-span-1">
        <TipsSidebar currentStep={currentStep} />
      </div>
    </form>
  );
}

// --- Main Page Component ---
function Step4Content() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  if (!vehicleId) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: No vehicle ID found in the URL.
      </div>
    );
  }

  return <DocumentUploadForm vehicleId={vehicleId} />;
}

export default function Step4() {
  return (
    <div className="relative min-h-screen pb-24 bg-white">
      <Stepper currentStep={currentStep} />
      <main className="max-w-8xl mt-8">
        <Suspense fallback={<CustomLoader />}>
          <Step4Content />
        </Suspense>
      </main>
    </div>
  );
}

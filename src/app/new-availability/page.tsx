"use client";
import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import AvailabilityLayout from "@/components/dashboard/avaliability/Availibility";

export default function SearchVehiclesPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <AvailabilityLayout type="search" />
    </Suspense>
  );
}

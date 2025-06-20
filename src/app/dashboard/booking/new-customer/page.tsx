"use client";
import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import NewCustomerLayout from "@/components/bookings/new-customer/NewCustomerLayout";

export default function SearchVehiclesPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <NewCustomerLayout />

    </Suspense>
  );
}

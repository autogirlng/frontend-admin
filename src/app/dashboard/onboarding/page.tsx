"use client";
import React from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/components/shared/icons";
import VehicleOnboardingStats from "@/components/tables/VehicleOnboarding/VehicleOnboardingStats";
import VehicleOnboarding from "@/components/tables/VehicleOnboarding";
import { LocalRoute } from "@/utils/LocalRoutes";

const VehicleOnboardingPage = () => {
  return (
    <DashboardLayout title="Vehicle Onboarding" currentPage="Onboarding">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11  ">
        <Link href={LocalRoute.selectHostPage}>
          <DashboardSectionTitle
            icon={Icons.ic_add}
            title="Vehicle Onboarding"
          />
        </Link>
        <VehicleOnboardingStats />
        <VehicleOnboarding />
      </div>
    </DashboardLayout>
  );
};

export default VehicleOnboardingPage;

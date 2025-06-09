"use client";
import React from "react";
// import { useTable, useSortBy, useFilters } from "react-table"; // These are commented out, assuming they are not currently in use for this page.
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link"; // Keep if you plan to use it elsewhere on the page
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/components/shared/icons"; // Keep if you plan to use it elsewhere on the page
import VehicleOnboardingStats from "@/components/tables/VehicleOnboarding/VehicleOnboardingStats"; // Keep if you plan to use it elsewhere on the page
import VehicleOnboarding from "@/components/tables/VehicleOnboarding"; // Keep if you plan to use it elsewhere on the page
import { LocalRoute } from "@/utils/LocalRoutes"; // Keep if you plan to use it elsewhere on the page

// Import the Settings component (which now contains the tab logic)
import Settings from "@/components/settings"; // Adjust this path based on where you save Settings.tsx

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings" currentPage="Settings">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        {/* The DashboardSectionTitle might be redundant if the Settings component already has a title, but keeping it for now as per your original structure */}
        <DashboardSectionTitle title="Settings" />

        {/* Integrate the Settings component here */}
        <Settings />
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

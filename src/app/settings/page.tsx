"use client";
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";

import Settings from "@/components/settings";

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings" currentPage="Settings">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        <DashboardSectionTitle title="Settings" />
        <Settings />
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

"use client";
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LocalRoute } from "@/utils/LocalRoutes";
import Button from "@/components/shared/button";
import HostFull from "@/components/tables/Host";

const HostViewAllPage = () => {
  return (
    <DashboardLayout title="Host View All" currentPage="Host View All">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11  ">
        <HostFull />
      </div>
    </DashboardLayout>
  );
};

export default HostViewAllPage;

"use client";
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/components/shared/icons";
import { LocalRoute } from "@/utils/LocalRoutes";
import Button from "@/components/shared/button";
import HostIndex from "@/components/tables/Host/HostIndex";

const HostPage = () => {
  return (
    <DashboardLayout title="Host" currentPage="Host">
      <div className="space-y-5 2xl:space-y-[52px] py-8 2xl:py-11  ">
        <div className="flex justify-between items-center  flex-col md:flex-row ">
          <DashboardSectionTitle
            icon={Icons.ic_activity}
            title=" Host Metrics"
          />

          <Button
            color="primary"
            className="flex gap-2 justify-center text-sm w-sm text-nowrap items-center"
          >
            {Icons.ic_add}
            <Link href={LocalRoute.addNewHostPage}>New Host</Link>
          </Button>
        </div>

        <HostIndex />
      </div>
    </DashboardLayout>
  );
};

export default HostPage;

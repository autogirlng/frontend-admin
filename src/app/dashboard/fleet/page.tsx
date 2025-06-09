"use client";
import React from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/components/shared/icons";
import { LocalRoute } from "@/utils/LocalRoutes";
import FleetStats from "@/components/tables/Fleet/FleetStats";
import Fleet from "@/components/tables/Fleet";
import Button from "@/components/shared/button";

const FleetPage = () => {
  return (
    <DashboardLayout title="Fleet" currentPage="Fleet">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11  ">
        <div className="flex justify-between items-center  flex-col md:flex-row ">
          <DashboardSectionTitle
            icon={Icons.ic_activity}
            title="Fleet Metrics"
          />

          <Button
            color="primary"
            className="flex gap-1 justify-center text-sm text-nowrap items-center"
          >
            <Link href={LocalRoute.availabilityPage}>
              View Available Vehicles
            </Link>
          </Button>
        </div>
        <FleetStats />
        <Fleet />
      </div>
    </DashboardLayout>
  );
};

export default FleetPage;

"use client";

import React from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import StatusCard from "@/app/components/dashboard/StatusCard";
//import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const VehicleOnboardingPage = () => {
  const Statdata = [
    {
      title: "Pending Listings",
      count: 4000,
      tooltip: "Listings waiting for approval",
    },
    {
      title: "Requires Update",
      count: 402,
      tooltip: "Submissions needing changes",
    },
    {
      title: "Rejected Submissions",
      count: 96,
      tooltip: "Submissions that were denied",
    },
    {
      title: "Approved Submissions",
      count: 2,
      tooltip: "Submissions successfully approved",
    },
    { title: "Drafts", count: 12, tooltip: "Saved drafts yet to be submitted" },
  ];

  //   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //     useTable({ columns, data }, useSortBy, useFilters);

  return (
    <DashboardLayout title="Vehicle Onboarding" currentPage="Onboarding">
      <div className="  ">
        <h2 className="text-lg font-medium mb-4">+ Vehicle Onboarding</h2>
        <div className=" grid grid-cols-3 md:grid-cols-5 gap-4">
          {Statdata.map((item) => (
            <StatusCard key={item.title} {...item} />
          ))}
        </div>
        {/* <VehicleTable /> */}
      </div>
    </DashboardLayout>
  );
};

export default VehicleOnboardingPage;

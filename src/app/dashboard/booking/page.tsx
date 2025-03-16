"use client";

// import React, { useMemo } from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import StatusCard from "@/app/components/dashboard/StatusCard";
import { FaLine } from "react-icons/fa";
import BookingAnalytics from "./BookingAnalytics";
import Tabs from "@/app/components/core/Tabs";

//import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Booking = () => {
  const Statdata = [
    {
      title: "Total Building",
      count: 4000,
      // tooltip: "Listings waiting for approval",
    },
    {
      title: "Pending Approvals",
      count: 402,
      // tooltip: "Submissions needing changes",
    },
    {
      title: "Rejected Bookings",
      count: 96,
      // tooltip: "Submissions that were denied",
    },
    {
      title: "Approved Requests",
      count: 2,
      // tooltip: "Submissions successfully approved",
    },
    {
      title: "Approved ",
      count: 2,
      // tooltip: "Submissions successfully approved",
    },
  ];

  return (
    <DashboardLayout title="Booking" currentPage="Bookings">
      <div className="flex flex-col space-y-2  ">
        <SectionHeader />
        <div className=" grid grid-cols-2 md:grid-cols-5 gap-4">
          {Statdata.map((item) => (
            <StatusCard key={item.title} {...item} />
          ))}
        </div>
        <Tabs
          tabs={[
            {
              title: "Upcoming",
              component: <BookingAnalytics />,
              badgeCount: 10,
            },
            { title: "History", component: <BookingAnalytics /> },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Booking;

const SectionHeader = ({ title = "Booking Analytics" }) => {
  return (
    <div className="flex items-center ">
      <FaLine className="text-gray-50 mr-1" />
      <h2 className="text-[#344054]">{title}</h2>
    </div>
  );
};

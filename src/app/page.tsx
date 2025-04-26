"use client";

// import React, { useMemo } from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";

import { FaTicket } from "react-icons/fa6";
import PerfomanceCard from "./components/dashboard/PerfomanceCard";
import BookingsCarousel from "./components/dashboard/BookingCarousel";
import MostBookedVehicles from "./components/dashboard/BookedVehicles";
import { LocalRoute } from "./utils/LocalRoutes";
//import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Home = () => {
  const Statdata = [
    {
      title: "Total Number  Of Host ",
      count: 4000,
      // tooltip: "Listings waiting for approval",
    },
    {
      title: "Total Number Of Customers",
      count: 402,
      // tooltip: "Submissions needing changes",
    },
    {
      title: "Total Onboarded Vehicles",
      count: 96,
      // tooltip: "Submissions that were denied",
    },
    {
      title: "Total Number Of Clients",
      count: 2,
      // tooltip: "Submissions successfully approved",
    },
  ];

  //   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //     useTable({ columns, data }, useSortBy, useFilters);

  return (
    <DashboardLayout title="Vehicle Onboarding" currentPage="Dashboard">
      <div className="flex flex-col gap-3  ">
        {/* Perfomance Card */}
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        {/* Bookings */}
        <SectionHeader title="Bookings" />
        <BookingsCarousel />
        {/* Most Book Vehicles  */}
        <MostBookedVehicles />
      </div>
    </DashboardLayout>
  );
};

export default Home;

const SectionHeader = ({ title = "Platform Activity", showFilter = true }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#101928]">
        <FaTicket className="text-[#0673FF]" />
        <span>{title}</span>
      </div>

      {showFilter && (
        <div className=" flex items-center justify-center space-x-2  px-2 py-1 text-sm text-[#344054]">
          View All
        </div>
      )}
    </div>
  );
};

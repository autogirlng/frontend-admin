"use client";

// import React, { useMemo } from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import StatusCard from "@/app/components/dashboard/StatusCard";
import { FaChevronDown } from "react-icons/fa";
import CarCard from "./components/dashboard/CarCard";

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
      <div className="flex flex-col space-y-2  ">
        <SectionHeader />
        <div className=" grid grid-cols-3 md:grid-cols-4 gap-4">
          {Statdata.map((item) => (
            <StatusCard key={item.title} {...item} />
          ))}
        </div>

        <div className=" grid grid-cols-2 gap-4">
          {Statdata.slice(2, 5).map((item) => (
            <StatusCard key={item.title} {...item} />
          ))}
        </div>
        <SectionHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 ">
          <CarCard
            location="Lagos"
            imageUrl="/images/reset-password.png"
            title="Toyota Corolla 2015"
            price="NGN 20,000/day"
            type="Sedan"
            totalImages={6}
          />
          <CarCard
            location="Lagos"
            imageUrl="/images/auth-bg.jpeg"
            title="Toyota Corolla 2015"
            price="NGN 20,000/day"
            type="Sedan"
            totalImages={6}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;

const SectionHeader = ({ title = "Platform Activity", showFilter = true }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[#344054]">{title}</h2>

      {showFilter && (
        <div className="shadow flex items-center justify-center space-x-2 rounded px-2 py-1 text-[#344054]">
          All
          <FaChevronDown />
        </div>
      )}
    </div>
  );
};

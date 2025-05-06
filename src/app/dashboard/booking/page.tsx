"use client";

// import React, { useMemo } from "react";
// import { useTable, useSortBy, useFilters } from "react-table";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusCard from "@/components/dashboard/StatusCard";
import { FaLine } from "react-icons/fa";
import BookingAnalytics from "./BookingAnalytics";
import Tabs from "@/components/core/Tabs";
import ActivityCard from "@/components/shared/activityCard";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/utils/Icon";

//import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Booking = () => {
  const Statdata = [
    {
      title: "Pending Listing",
      value: "_",
      isLoading: false,
      className: "min-w-[180px] w-full",
    },
    {
      title: "Approvals",
      value: "_",
      isLoading: false,
      className: "min-w-[180px] w-full",
    },
    {
      title: "Rejected",
      value: "_",
      isLoading: false,
      className: "min-w-[180px] w-full",
    },
    {
      title: "In Review",
      value: "_",
      isLoading: false,
      className: "min-w-[180px] w-full",
    },
    {
      title: "Drafts",
      value: "_",
      isLoading: false,
      className: "min-w-[180px] w-full",
    },
  ];

  return (
    <DashboardLayout title="Booking" currentPage="Bookings">
      <div className="flex flex-col space-y-2  ">
        <DashboardSectionTitle title="Vehicle Onboarding" icon={Icons.ic_add} />
        <div className=" grid grid-cols-2 md:grid-cols-5 gap-4">
          {Statdata.map((item) => (
            <ActivityCard key={item.title} {...item} />
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

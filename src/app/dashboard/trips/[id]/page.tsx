"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React from "react";
import BackButton from "@/components/core/button/BackButton";
import TripsTable from "@/components/dashboard/trips/TripTable";
import Button from "@/components/core/button/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {};

function TripsPages({}: Props) {
  return (
    <DashboardLayout currentPage="dashboard" title="">
      {/* full height layout */}
      <div className=" w-full flex flex-col min-h-screen space-y-4">
        <div className="space-y-2">
          <BackButton />
          <h4 className="text-[48px] font-bold text-black">1 July 2025</h4>
          <div className="overflow-x-scroll">
            <TripsTable />
          </div>
        </div>

        {/* bottom navigator pushed to bottom */}
        <div className="sticky bottom-0 bg-white z-10 py-4 px-3 flex justify-between items-center ">
          <Button radius="rounded" variant="outlined" color="white">
            <div className="flex justify-between items-center gap-2 text-xs text-gray-700">
              <FaChevronLeft /> Previous Day
            </div>
          </Button>
          <Button radius="rounded" color="primary">
            <div className="flex justify-between items-center gap-2 text-xs">
              Next Day <FaChevronRight />
            </div>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TripsPages;

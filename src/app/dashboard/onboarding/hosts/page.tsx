"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SelectHost from "@/components/tables/selectHost";
import { FaChevronLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

import { useAppSelector } from "@/lib/hooks";
import { LocalRoute } from "@/utils/LocalRoutes";

const HostPage = () => {
  const router = useRouter();

  const { host } = useAppSelector((state) => state.host);
  const isHostSelected = host !== null && host !== undefined;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content Container */}
      <div className="max-w-6xl w-full mx-auto space-y-5 py-4 px-4 sm:px-6 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => router.back()}
            className="text-[#005EFF] flex items-center hover:underline"
          >
            <FaChevronLeft className="mr-1" /> Cancel
          </button>
        </div>

        {/* Content Area with Auto Scroll */}
        <div className="flex-grow overflow-auto p-1">
          {" "}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Host</h2>
          <SelectHost />
        </div>
      </div>

      {/* Footer - Stays at Bottom */}
      <div className="sticky bottom-0 left-0 w-full py-3 px-4 bg-grey-100  z-50 shadow-md flex justify-end">
        <Button
          disabled={!isHostSelected}
          onClick={() => {
            router.push(LocalRoute.vehicleOnboardingPage);
          }}
          className={
            isHostSelected
              ? "bg-[#005EFF] rounded-full px-8 py-4 text-white hover:bg-[#0049CC]"
              : "bg-grey-300 rounded-full px-8 py-4  text-grey-500 cursor-not-allowed"
          }
        >
          {"Next  >"}
        </Button>
      </div>
    </div>
  );
};

export default HostPage;

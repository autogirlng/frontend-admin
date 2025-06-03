"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { FaChevronLeft } from "react-icons/fa6";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content Container */}
      <div className="max-w-5xl w-full mx-auto space-y-5 py-4 px-4 sm:px-6 flex flex-col flex-grow">
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
        <div className="flex-grow overflow-auto p-1">{children}</div>
      </div>

      {/* Footer - Stays at Bottom */}
      <div className="sticky bottom-0 left-0 w-full py-3 px-4 bg-grey-100 shadow-md flex justify-end"></div>
    </div>
  );
};

export default PageLayout;

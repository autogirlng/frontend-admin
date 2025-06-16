"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Info, Plus, ChevronRight } from "lucide-react";
import FilterComponent from "./FilterComponent";

interface BookingMetricProps {
  title: string;
  count: number;
  amount: string;
  rides: number;
  blueRatio: number;
  orangeRatio: number;
  tooltipText?: string;
}

const BookingMetricCard: React.FC<BookingMetricProps> = ({
  title,
  count,
  amount,
  rides,
  blueRatio,
  orangeRatio,
  tooltipText = `Information about ${title.toLowerCase()}`,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-[#344054] text-sm">{title}</span>
        <div
          className="relative"
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >
          <Info size={16} className="text-gray-400 cursor-pointer" />
          {isTooltipVisible && (
            <div className="absolute z-10 bg-white border border-gray-200 text-[#344054] text-xs rounded py-1 px-2 left-6 -top-2 w-40 shadow-lg">
              {tooltipText}
            </div>
          )}
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold">
        {count.toLocaleString()}
      </div>
      <div className="flex items-center text-[#344054] text-xs md:text-sm">
        <span className="truncate">{amount}</span>
        <span className="mx-1 flex-shrink-0">•</span>
        <span className="flex-shrink-0">{rides.toLocaleString()} rides</span>
      </div>
      <Progress value={blueRatio} secondaryValue={orangeRatio} />
    </div>
  );
};

interface ProgressProps {
  value?: number;
  secondaryValue?: number;
  className?: string;
}

const Progress = ({
  value = 0,
  secondaryValue = 0,
  className = "",
}: ProgressProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const progressRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;

      // Position the tooltip near the cursor but not exactly on it (to avoid flickering)
      setPosition({
        x: e.clientX - rect.left,
        y: rect.height + 10, // 10px below the progress bar
      });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      ref={progressRef}
    >
      <div
        className={`w-full h-1.5 bg-gray-200 rounded-full overflow-hidden bg-[#FFA119] ${className}`}
      >
        <div className="flex h-full">
          <div
            className="h-full bg-[#0673FF] transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>

      {isHovered && (
        <div
          className="absolute z-10 bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[120px]"
          style={{
            left: `${Math.min(90, Math.max(10, position.x - 60))}px`,
            top: `${position.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#0673FF] mr-2"></div>
                <span className="text-gray-600">Primary:</span>
              </div>
              <span className="font-medium">{value}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#FFA119] mr-2"></div>
                <span className="text-gray-600">Secondary:</span>
              </div>
              <span className="font-medium">{secondaryValue}%</span>
            </div>
          </div>
          {/* Small arrow pointing to the progress bar */}
          <div
            className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"
            style={{ zIndex: -1 }}
          ></div>
        </div>
      )}
    </div>
  );
};

const BookingMetrics: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("this_month");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const newBookingDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter options
  const filterOptions = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "this_week", label: "This Week" },
    { id: "last_week", label: "Last Week" },
    { id: "this_month", label: "This Month" },
    { id: "last_month", label: "Last Month" },
    { id: "custom", label: "Custom Range" },
  ];

  // Get the selected filter label
  const getSelectedFilterLabel = () => {
    const option = filterOptions.find((option) => option.id === selectedFilter);
    return option ? option.label : "Filter";
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }

      if (
        newBookingDropdownRef.current &&
        !newBookingDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNewBookingOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, newBookingDropdownRef]);

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2 sm:mb-2">
        <h1 className="text-lg sm:text-xl font-medium text-[#344054]">
          Booking Metrics
        </h1>
        <div className="flex flex-wrap w-full sm:w-auto justify-end gap-2">
          {/* Filter Component */}
          <FilterComponent />

          {/* New Booking Button with Dropdown */}
          <div
            className="relative w-full sm:w-auto"
            ref={newBookingDropdownRef}
          >
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#0673FF] text-white rounded-lg"
              style={{ fontSize: 13 }}
              onClick={() => setIsNewBookingOpen(!isNewBookingOpen)}
            >
              <Plus size={16} />
              <span>New Booking</span>
            </button>

            {isNewBookingOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-lg z-20 py-1 border border-[#0673FF]">
                <div className="px-6 py-4">
                  <h2
                    className="text-xl font-bold text-[#1D2739] mb-2"
                    style={{ fontSize: 17 }}
                  >
                    New Booking
                  </h2>
                  <div className="border-t border-[#D0D5DD] my-4"></div>

                  <div className="mb-6 cursor-pointer" onClick={() => router.push('/dashboard/booking/new-customer')}>
                    <h3
                      className="text-lg font-medium flex flex-row justify-between  text-[#1D2739] mb-1 "
                      style={{ fontSize: 15, fontWeight: "bold", }}
                    >
                      <span>Create Booking</span> <ChevronRight />
                    </h3>
                    <p className="text-[#1D2739] mb-2" style={{ fontSize: 12 }}>
                      Create booking all within the muvment platform.
                    </p>
                  </div>

                  <div className="border-t border-[#D0D5DD] my-4"></div>

                  <div>
                    <h3
                      className="text-lg font-medium text-[#1D2739] mb-1"
                      style={{ fontSize: 15, fontWeight: "bold" }}
                    >
                      Copy Form Link
                    </h3>
                    <p className="text-[#1D2739] mb-2" style={{ fontSize: 12 }}>
                      Share booking Form with offline users
                    </p>
                    <div className="flex justify-between items-center">
                      <div></div>
                      <button
                        className="bg-[#F0F2F5] text-[#344054] px-4 py-2 rounded-md text-sm"
                        style={{ borderRadius: 30 }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="bg-gray-50 p-6 sm:p-4 md:p-6 rounded-lg shadow-md"
        style={{ borderRadius: 20, paddingTop: 35, paddingBottom: 35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className="font-medium bg-[#EDF8FF] text-sm md:text-base"
            style={{
              padding: "8px 12px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src="/icons/coupon.svg" className="w-5 h-5 mr-2" />
            Bookings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <BookingMetricCard
            title="Total Bookings"
            count={2000}
            amount="₦400,000,000"
            rides={4000}
            blueRatio={50}
            orangeRatio={20}
            tooltipText="Information about total bookings across all statuses"
          />
          <BookingMetricCard
            title="Ongoing Bookings"
            count={100}
            amount="₦2,000,000"
            rides={300}
            blueRatio={35}
            orangeRatio={0}
            tooltipText="Information about bookings that are currently active"
          />
          <BookingMetricCard
            title="Completed Bookings"
            count={1800}
            amount="₦380,000,000"
            rides={3500}
            blueRatio={40}
            orangeRatio={20}
            tooltipText="Information about bookings that have been successfully completed"
          />
          <BookingMetricCard
            title="Canceled Bookings"
            count={100}
            amount="₦18,000,000"
            rides={200}
            blueRatio={20}
            orangeRatio={0}
            tooltipText="Information about bookings that have been canceled"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingMetrics;

/* 

<div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 min-w-0 sm:min-w-32"
              style={{ fontSize: 13 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <div className="flex items-center gap-2 truncate">
                <Filter size={16} className="flex-shrink-0" />
                <span className="truncate">{getSelectedFilterLabel()}</span>
              </div>
              <ChevronDown
                size={16}
                className={`flex-shrink-0 transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1 w-full sm:w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedFilter === option.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedFilter(option.id);
                      setIsFilterOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

*/

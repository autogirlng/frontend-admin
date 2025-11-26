"use client";

// ✅ 1. Added useEffect to imports
import React, { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import TextInput from "../../generic/ui/TextInput";
import CustomLoader from "../../generic/CustomLoader";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { DatePickerWithRange } from "./DatePickerWithRange";
import DailyScheduleModal from "./DailyScheduleModal";

import { useVehicleAvailability } from "../../../lib/hooks/availability/useVehicleAvailability";
import { useDebounce } from "../../../lib/hooks/set-up/company-bank-account/useDebounce";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function AvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ✅ 2. FIX: Reset pagination to 0 whenever search or date range changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm, dateRange]);

  const {
    data: availabilityData,
    isLoading,
    isError,
    error,
  } = useVehicleAvailability({
    searchTerm: debouncedSearchTerm,
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    page: page,
  });

  const handleCellClick = (vehicleId: string, date: Date) => {
    setSelectedVehicleId(vehicleId);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedVehicleId(null);
      setSelectedDate(null);
    }, 300);
  };

  const getPaginationGroup = () => {
    const total = availabilityData?.totalPages || 0;
    const current = page + 1;
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="py-3 max-w-8xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Vehicle Availability</h1>

      {/* --- Controls --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          id="search"
          label="Search Vehicles"
          placeholder="e.g., Toyota Avenesis or M001"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date Range
          </label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      {/* --- Calendar Display --- */}
      <div className="mt-6">
        {isLoading && <CustomLoader />}
        {isError && (
          <div className="text-red-600 p-4 border border-red-300 rounded-md">
            Error: {error?.message || "Failed to fetch availability."}
          </div>
        )}
        {availabilityData &&
          availabilityData.content.length > 0 &&
          dateRange?.from &&
          dateRange?.to && (
            <AvailabilityCalendar
              vehicles={availabilityData.content}
              startDate={dateRange.from}
              endDate={dateRange.to}
              onCellClick={handleCellClick}
            />
          )}
        {availabilityData && availabilityData.content.length === 0 && (
          <p className="text-center text-gray-500">
            No vehicles found for this search or date range.
          </p>
        )}
      </div>

      {availabilityData && availabilityData.totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center justify-center h-9 w-9 sm:w-auto sm:px-4 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {getPaginationGroup().map((item, index) => {
              if (item === "...") {
                return (
                  <div
                    key={`dots-${index}`}
                    className="flex h-9 w-9 items-center justify-center"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                );
              }

              const isCurrent = item === page + 1;

              return (
                <button
                  key={item}
                  onClick={() => setPage((item as number) - 1)}
                  className={`
              h-9 w-9 flex items-center justify-center text-sm font-medium transition-colors
              ${
                isCurrent
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
              }
            `}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setPage((p) => Math.min(availabilityData.totalPages - 1, p + 1))
            }
            disabled={page === availabilityData.totalPages - 1}
            className="flex items-center justify-center h-9 w-9 sm:w-auto sm:px-4 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </button>
        </div>
      )}

      <DailyScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicleId={selectedVehicleId}
        date={selectedDate}
      />
    </div>
  );
}

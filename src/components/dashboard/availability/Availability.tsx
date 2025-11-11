// app/dashboard/availability/page.tsx
"use client";

import React, { useState } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

// Components
import TextInput from "../../generic/ui/TextInput"; // Assuming you have this
import CustomLoader from "../../generic/CustomLoader";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { DatePickerWithRange } from "./DatePickerWithRange"; // Adjust path
import DailyScheduleModal from "./DailyScheduleModal"; // Adjust path

// Hooks
import { useVehicleAvailability } from "../../../lib/hooks/availability/useVehicleAvailability"; // Adjust path
import { useDebounce } from "../../../lib/hooks/set-up/company-bank-account/useDebounce";

export default function AvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6), // Default to a 7-day view
  });

  // ✅ State for the daily schedule modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

  // ✅ Handlers for opening/closing the modal
  const handleCellClick = (vehicleId: string, date: Date) => {
    setSelectedVehicleId(vehicleId);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset selection after a short delay
    setTimeout(() => {
      setSelectedVehicleId(null);
      setSelectedDate(null);
    }, 300);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
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
              onCellClick={handleCellClick} // ✅ Pass the click handler
            />
          )}
        {availabilityData && availabilityData.content.length === 0 && (
          <p className="text-center text-gray-500">
            No vehicles found for this search or date range.
          </p>
        )}
      </div>

      {/* --- Pagination (Basic) --- */}
      {availabilityData && availabilityData.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {availabilityData.currentPage + 1} of{" "}
            {availabilityData.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(availabilityData.totalPages - 1, p + 1))
            }
            disabled={page === availabilityData.totalPages - 1}
            className="px-4 py-2 bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Render the modal */}
      <DailyScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicleId={selectedVehicleId}
        date={selectedDate}
      />
    </div>
  );
}

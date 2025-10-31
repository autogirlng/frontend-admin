// app/dashboard/vehicles/[vehicleId]/bookings/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Toaster, toast } from "react-hot-toast";
import { AlertCircle, Eye, Filter } from "lucide-react";

// Types
import { VehicleBookingSegment } from "../details/types";
import { BookingType } from "@/components/set-up-management/bookings-types/types"; // Adjust path

import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";

// Reusable Components
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { DatePickerWithRange } from "../../availability/DatePickerWithRange";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import Button from "@/components/generic/ui/Button";
import {
  useGetVehicleBookingsPaginated,
  useGetVehicleDetails,
} from "@/lib/hooks/vehicle-onboarding/details/useVehicleDetailsPage";

// Enums for filters
export enum BookingStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  CONFIRMED = "CONFIRMED",
  FAILED_AVAILABILITY = "FAILED_AVAILABILITY",
  CANCELLED_BY_USER = "CANCELLED_BY_USER",
  CANCELLED_BY_HOST = "CANCELLED_BY_HOST",
  CANCELLED_BY_ADMIN = "CANCELLED_BY_ADMIN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

// Helper to convert enums to <Select> options
const enumToOptions = (e: object): Option[] =>
  Object.entries(e).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, " "),
  }));

const bookingStatusOptions: Option[] = enumToOptions(BookingStatus);

// Helper to format currency
const formatPrice = (price: number) => {
  return `₦${price.toLocaleString()}`;
};

export default function VehicleBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.vehicleId as string;

  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(0);

  // Filter States
  const [filters, setFilters] = useState({
    bookingStatus: null as string | null,
    bookingTypeId: null as string | null,
    dateRange: null as DateRange | null,
  });

  // --- API Hooks ---
  // Fetch vehicle details for the header
  const { data: vehicle, isLoading: isLoadingVehicle } =
    useGetVehicleDetails(vehicleId);

  // Fetch paginated bookings
  const {
    data: paginatedData,
    isLoading: isLoadingBookings,
    isError,
    isPlaceholderData,
  } = useGetVehicleBookingsPaginated(vehicleId, {
    page: currentPage,
    bookingStatus: filters.bookingStatus,
    bookingTypeId: filters.bookingTypeId,
    startDate: filters.dateRange?.from || null,
    endDate: filters.dateRange?.to || null,
  });

  // Fetch booking types for the filter dropdown
  const { data: bookingTypes = [] } = useGetBookingTypes();

  // --- Derived Data ---
  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const bookingTypeOptions: Option[] = bookingTypes.map((bt: BookingType) => ({
    id: bt.id,
    name: bt.name,
  }));
  const isLoading = isLoadingVehicle || (isLoadingBookings && !paginatedData);

  // --- Event Handlers ---
  const handleFilterChange = (
    key: "bookingStatus" | "bookingTypeId",
    value: string | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: dateRange || null }));
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      bookingStatus: null,
      bookingTypeId: null,
      dateRange: null,
    });
    setCurrentPage(0);
  };

  // --- Table Column Definitions ---
  const columns: ColumnDefinition<VehicleBookingSegment>[] = [
    {
      header: "Booking ID",
      accessorKey: "bookingId",
      cell: (item) => (
        <span className="font-mono text-sm">
          {item.bookingId.split("-")[0]}...
        </span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customerName",
    },
    {
      header: "Booking Type",
      accessorKey: "bookingType",
    },
    {
      header: "Duration",
      accessorKey: "duration",
    },
    {
      header: "Booked On",
      accessorKey: "createdAt",
      cell: (item) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item) => (
        <span className="font-semibold">{formatPrice(item.price)}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "bookingStatus",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.bookingStatus === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : item.bookingStatus === "PENDING_PAYMENT"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.bookingStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "segmentId", // Use a unique key
      cell: (item) => (
        <Button
          variant="secondary"
          className="w-auto px-3 py-1.5 text-xs"
          onClick={() => router.push(`/dashboard/bookings/${item.bookingId}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
          <p className="text-lg text-gray-600 mt-1">
            {vehicle
              ? `Viewing all bookings for ${vehicle.name} (${vehicle.vehicleIdentifier})`
              : "Loading vehicle details..."}
          </p>
        </div>

        {/* --- Filter Section --- */}
        <div className="p-4 bg-gray-50 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Booking Status"
              hideLabel
              placeholder="All Booking Statuses"
              options={bookingStatusOptions}
              selected={
                filters.bookingStatus
                  ? {
                      id: filters.bookingStatus,
                      name: filters.bookingStatus.replace(/_/g, " "),
                    }
                  : null
              }
              onChange={(option) =>
                handleFilterChange("bookingStatus", option.id)
              }
            />
            <Select
              label="Booking Type"
              hideLabel
              placeholder="All Booking Types"
              options={bookingTypeOptions}
              selected={
                filters.bookingTypeId
                  ? bookingTypeOptions.find(
                      (bt) => bt.id === filters.bookingTypeId
                    )
                  : null
              }
              onChange={(option) =>
                handleFilterChange("bookingTypeId", option.id)
              }
            />
            <DatePickerWithRange
              date={filters.dateRange || undefined}
              setDate={handleDateChange}
            />
          </div>
          <Button
            variant="secondary"
            className="w-auto px-4 mt-4"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>

        {/* --- Table Display --- */}
        {isLoading && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load bookings.</span>
          </div>
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No bookings found for this vehicle with the selected filters.</p>
          </div>
        )}

        {!isError && (bookings.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={bookings}
              columns={columns}
              getUniqueRowId={(item) => item.segmentId} // segmentId is unique
            />
          </div>
        )}

        {/* --- Pagination --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>
    </>
  );
}

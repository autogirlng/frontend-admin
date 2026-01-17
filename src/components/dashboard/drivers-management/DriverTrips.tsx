"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Toaster } from "react-hot-toast";
import { AlertCircle, Eye, Filter } from "lucide-react";
import { BookingType } from "@/components/set-up-management/bookings-types/types";
import { useGetDriverTrips } from "@/lib/hooks/drivers-management/useDriverTrips";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { DatePickerWithRange } from "../availability/DatePickerWithRange";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import Button from "@/components/generic/ui/Button";
import { BookingStatus, Trip, TripStatus } from "./trip-types";
import { useGetDriverDetails } from "@/lib/hooks/drivers-management/useDrivers";

const enumToOptions = (e: object): Option[] =>
  Object.entries(e).map(([key, value]) => ({ id: value, name: key }));

const tripStatusOptions: Option[] = enumToOptions(TripStatus);
const bookingStatusOptions: Option[] = enumToOptions(BookingStatus);

export default function DriverTripsPage() {
  const router = useRouter();
  const params = useParams();
  const driverId = params.driverId as string;

  const [currentPage, setCurrentPage] = useState(0);

  const [filters, setFilters] = useState({
    bookingStatus: null as string | null,
    tripStatus: null as string | null,
    bookingTypeID: null as string | null,
    dateRange: null as DateRange | null,
  });

  const { data: driverDetails } = useGetDriverDetails(driverId);
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetDriverTrips({
    driverId,
    page: currentPage,
    bookingStatus: filters.bookingStatus,
    tripStatus: filters.tripStatus,
    bookingTypeID: filters.bookingTypeID,
    startDate: filters.dateRange?.from || null,
    endDate: filters.dateRange?.to || null,
  });

  const { data: bookingTypes = [] } = useGetBookingTypes();

  const trips = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const bookingTypeOptions: Option[] = bookingTypes.map((bt: BookingType) => ({
    id: bt.id,
    name: bt.name,
  }));

  const handleFilterChange = (
    key: "bookingStatus" | "tripStatus" | "bookingTypeID",
    value: string | null,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: dateRange || null }));
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      bookingStatus: null,
      tripStatus: null,
      bookingTypeID: null,
      dateRange: null,
    });
    setCurrentPage(0);
  };

  const columns: ColumnDefinition<Trip>[] = [
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.customerName}</div>
          <div className="text-gray-500">{item.customerPhoneNumber}</div>
        </div>
      ),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleName",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.vehicleName}</div>
          <div className="text-gray-500">{item.vehicleIdentifier}</div>
        </div>
      ),
    },
    {
      header: "Trip Details",
      accessorKey: "startDateTime",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">
            {format(new Date(item.startDateTime), "MMM d, yyyy, h:mm a")}
          </div>
          <div className="text-gray-500">{item.bookingTypeName}</div>
        </div>
      ),
    },
    {
      header: "Trip Status",
      accessorKey: "tripStatus",
      cell: (item) => (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {item.tripStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Booking Status",
      accessorKey: "bookingStatus",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.bookingStatus === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.bookingStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Driver Trip History
          </h1>
          <div className="text-lg text-gray-600 mt-1">
            {driverDetails && (
              <p className="text-gray-500 mt-1">
                Viewing trips for{" "}
                <span className="font-semibold text-gray-800">
                  {driverDetails.fullName}
                </span>{" "}
                ({driverDetails.driverIdentifier})
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Trip Status"
              hideLabel
              placeholder="All Trip Statuses"
              options={tripStatusOptions}
              selected={
                filters.tripStatus
                  ? { id: filters.tripStatus, name: filters.tripStatus }
                  : null
              }
              onChange={(option) => handleFilterChange("tripStatus", option.id)}
            />
            <Select
              label="Booking Status"
              hideLabel
              placeholder="All Booking Statuses"
              options={bookingStatusOptions}
              selected={
                filters.bookingStatus
                  ? { id: filters.bookingStatus, name: filters.bookingStatus }
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
                filters.bookingTypeID
                  ? bookingTypeOptions.find(
                      (bt) => bt.id === filters.bookingTypeID,
                    )
                  : null
              }
              onChange={(option) =>
                handleFilterChange("bookingTypeID", option.id)
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

        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load trips.</span>
          </div>
        )}
        {!isLoading && !isError && trips.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No trips found for this driver with the selected filters.</p>
          </div>
        )}

        {!isError && (trips.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={trips}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

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

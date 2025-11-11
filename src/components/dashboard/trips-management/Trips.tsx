// app/dashboard/trips/page.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Toaster, toast } from "react-hot-toast";
import {
  AlertCircle,
  Eye,
  Filter,
  User,
  UserCheck,
  Car,
  Download, // ✅ NEW
  FileText, // ✅ NEW
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx"; // ✅ NEW

import { BookingType } from "@/components/set-up-management/bookings-types/types";

// Hooks
import {
  useGetTrips,
  useDownloadTripInvoice, // ✅ NEW
  useDownloadTripReceipt, // ✅ NEW
} from "@/lib/hooks/trips-management/useTrips";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";

// Reusable Components
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { DatePickerWithRange } from "../availability/DatePickerWithRange";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";

// Modals
import { AssignDriverModal } from "./AssignDriverModal";
import { AssignAgentsModal } from "./AssignAgentsModal";
import { BookingStatus, Trip, TripStatus } from "./types";

// Helper function to convert enums to <Select> options
const enumToOptions = (e: object): Option[] =>
  Object.entries(e).map(([key, value]) => ({ id: value, name: key }));

const tripStatusOptions: Option[] = enumToOptions(TripStatus);
const bookingStatusOptions: Option[] = enumToOptions(BookingStatus);

export default function TripsPage() {
  const router = useRouter();

  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState<"assignDriver" | "assignAgents" | null>(
    null
  );
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Filter States
  const [filters, setFilters] = useState({
    bookingStatus: null as string | null,
    tripStatus: null as string | null,
    bookingTypeId: null as string | null,
    dateRange: null as DateRange | null,
  });

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetTrips({
    page: currentPage,
    bookingStatus: filters.bookingStatus,
    tripStatus: filters.tripStatus,
    bookingTypeId: filters.bookingTypeId,
    startDate: filters.dateRange?.from || null,
    endDate: filters.dateRange?.to || null,
  });

  const { data: bookingTypes = [] } = useGetBookingTypes();
  // ✅ Instantiate new hooks
  const downloadInvoiceMutation = useDownloadTripInvoice();
  const downloadReceiptMutation = useDownloadTripReceipt();

  // --- Derived Data ---
  const trips = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const bookingTypeOptions: Option[] = bookingTypes.map((bt: BookingType) => ({
    id: bt.id,
    name: bt.name,
  }));
  // ✅ Combine all loading states
  const isActionLoading =
    isPlaceholderData ||
    downloadInvoiceMutation.isPending ||
    downloadReceiptMutation.isPending;

  // --- Event Handlers ---
  const handleFilterChange = (
    key: "bookingStatus" | "tripStatus" | "bookingTypeId",
    value: string | null
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
      bookingTypeId: null,
      dateRange: null,
    });
    setCurrentPage(0);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedTrip(null);
  };

  const openModal = (type: "assignDriver" | "assignAgents", trip: Trip) => {
    setSelectedTrip(trip);
    setModal(type);
  };

  // --- Table Column Definitions ---
  // ✅ UPDATED getTripActions
  const getTripActions = (trip: Trip): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "View Trip Details",
        icon: Eye,
        onClick: () => {
          router.push(`/dashboard/trips/${trip.id}`);
        },
      },
      {
        label: "Assign Driver",
        icon: Car,
        onClick: () => openModal("assignDriver", trip),
      },
      {
        label: "Assign Agents",
        icon: UserCheck,
        onClick: () => openModal("assignAgents", trip),
      },
      {
        label: "Download Invoice",
        icon: FileText,
        onClick: () =>
          downloadInvoiceMutation.mutate({ bookingId: trip.bookingId }),
      },
    ];

    // ✅ Only add Receipt if booking is confirmed or completed
    if (
      trip.bookingStatus === "CONFIRMED" ||
      trip.bookingStatus === "COMPLETED"
    ) {
      actions.push({
        label: "Download Receipt",
        icon: Download,
        onClick: () =>
          downloadReceiptMutation.mutate({ bookingId: trip.bookingId }),
      });
    }

    return actions;
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
      header: "Driver",
      accessorKey: "driverName",
      cell: (item) =>
        item.driverName ? (
          <div>
            <div className="font-medium text-gray-900">{item.driverName}</div>
            <div className="text-gray-500">{item.driverPhoneNumber}</div>
          </div>
        ) : (
          <span className="text-gray-400">Not Assigned</span>
        ),
    },
    {
      header: "Agents",
      accessorKey: "customerAgentName",
      cell: (item) => (
        <div>
          <div className="text-sm">
            <span className="font-medium">Customer: </span>
            {item.customerAgentName || "N/A"}
          </div>
          <div className="text-sm">
            <span className="font-medium">Ops: </span>
            {item.operationsAgentName || "N/A"}
          </div>
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
      header: "Booking",
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
      cell: (item) => <ActionMenu actions={getTripActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage all trips on the platform.
          </p>
        </div>

        {/* --- Filter Section --- */}
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
        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load trips.</span>
          </div>
        )}
        {!isLoading && !isError && trips.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No trips found for the selected filters.</p>
          </div>
        )}

        {!isError && (trips.length > 0 || isLoading) && (
          <div
            className={clsx(
              "transition-opacity",
              isActionLoading ? "opacity-50" : "" // ✅ Use combined loading state
            )}
          >
            <CustomTable
              data={trips}
              columns={columns}
              getUniqueRowId={(item) => item.id}
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

      {/* --- Modals --- */}
      {modal === "assignDriver" && selectedTrip && (
        <AssignDriverModal trip={selectedTrip} onClose={closeModal} />
      )}

      {modal === "assignAgents" && selectedTrip && (
        <AssignAgentsModal trip={selectedTrip} onClose={closeModal} />
      )}
    </>
  );
}

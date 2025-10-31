"use client";

import React, { useState, useMemo } from "react";
import {
  useGetBookingSegments,
  useDownloadInvoice,
} from "@/lib/hooks/booking-management/useBookings";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { BookingSegment, BookingStatus } from "./types";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { Loader2, AlertCircle, View, Download, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomLoader from "@/components/generic/CustomLoader";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Helper Functions & Constants ---

// Create options for the Booking Status filter
const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  ...Object.values(BookingStatus).map((status) => ({
    id: status,
    name: formatStatus(status),
  })),
];

// Helper to format the status for display
function formatStatus(status: string) {
  return (status || "")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper to format price
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
}

// Helper for date formatting
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Main Page Component ---
export default function BookingsPage() {
  const router = useRouter();
  // --- Filter State ---
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Option | null>(null);
  const [bookingTypeFilter, setBookingTypeFilter] = useState<Option | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetBookingSegments({
    page: currentPage,
    status: statusFilter?.id || "",
    bookingTypeId: bookingTypeFilter?.id || "",
    startDate,
    endDate,
  });

  const { data: bookingTypes, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();

  const downloadInvoiceMutation = useDownloadInvoice();

  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // Memoize options for the Booking Type filter
  const bookingTypeOptions: Option[] = useMemo(() => {
    if (!bookingTypes) return [{ id: "", name: "Loading..." }];
    return [
      { id: "", name: "All Booking Types" },
      ...bookingTypes.map((bt) => ({ id: bt.id, name: bt.name })),
    ];
  }, [bookingTypes]);

  // --- Define Actions for the Menu ---
  const getBookingActions = (booking: BookingSegment): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "View Booking",
        icon: View,
        onClick: () => {
          toast.success(`Viewing ${booking.customerName} bookings`);
          router.push(`/dashboard/bookings/${booking.bookingId}`);
        },
      },
    ];

    // Conditionally add the Download Invoice action
    if (booking.bookingStatus === BookingStatus.PENDING_PAYMENT) {
      actions.push({
        label: "Download Invoice",
        icon: Download,
        onClick: () => {
          if (downloadInvoiceMutation.isPending) return;
          downloadInvoiceMutation.mutate({ bookingId: booking.bookingId });
        },
      });
    }

    return actions;
  };

  // --- Define Columns for the Table ---
  const columns: ColumnDefinition<BookingSegment>[] = [
    {
      header: "Customer",
      accessorKey: "customerName",
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleName",
      cell: (item) => (
        <div>
          <div className="font-medium">{item.vehicleName}</div>
          <div className="text-xs text-gray-500">{item.vehicleId}</div>
        </div>
      ),
    },
    {
      header: "Booking Type",
      accessorKey: "bookingType",
    },
    {
      header: "Status",
      accessorKey: "bookingStatus",
      cell: (item) => {
        const status = formatBookingStatus(item.bookingStatus);
        return (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.classes}`}
          >
            {status.name}
          </span>
        );
      },
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item) => (
        <span className="font-mono">{formatPrice(item.price)}</span>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (item) => (
        <span className="text-sm">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "segmentId",
      cell: (item) => <ActionMenu actions={getBookingActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all bookings on the platform.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard/bookings/create"
              className="bg-[#0096FF] flex py-3 px-6 text-white flex-wrap hover:bg-[#007ACC]"
            >
              <Plus className="mr-3" /> Create a Booking
            </Link>
          </div>
        </div>

        {/* --- Filters --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select
            label="Status"
            hideLabel
            placeholder="Filter by status"
            options={statusOptions}
            selected={statusFilter}
            onChange={(option) => {
              setStatusFilter(option);
              setCurrentPage(0);
            }}
          />
          <Select
            label="Booking Type"
            hideLabel
            placeholder={
              isLoadingBookingTypes ? "Loading types..." : "Filter by type"
            }
            options={bookingTypeOptions}
            selected={bookingTypeFilter}
            onChange={(option) => {
              setBookingTypeFilter(option);
              setCurrentPage(0);
            }}
            disabled={isLoadingBookingTypes}
          />
          <TextInput
            label="Start Date"
            id="start-date"
            hideLabel
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(0);
            }}
            className="text-gray-500"
          />
          <TextInput
            label="End Date"
            id="end-date"
            hideLabel
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(0);
            }}
            className="text-gray-500"
          />
        </div>

        {/* --- Table Display --- */}
        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load bookings.</span>
          </div>
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No bookings found for the selected filters.</p>
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
              getUniqueRowId={(item) => item.segmentId}
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

export function formatBookingStatus(status: BookingStatus) {
  const formatted = {
    name: "Unknown",
    classes: "bg-gray-100 text-gray-800",
  };

  // Format the name
  formatted.name = (status || "")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

  // Assign color classes
  switch (status) {
    case BookingStatus.COMPLETED:
    case BookingStatus.CONFIRMED:
      formatted.classes = "bg-green-100 text-green-800";
      break;
    case BookingStatus.IN_PROGRESS:
    case BookingStatus.PENDING_PAYMENT:
      formatted.classes = "bg-yellow-100 text-yellow-800";
      break;
    case BookingStatus.FAILED_AVAILABILITY:
    case BookingStatus.CANCELLED_BY_USER:
    case BookingStatus.CANCELLED_BY_HOST:
    case BookingStatus.CANCELLED_BY_ADMIN:
    case BookingStatus.NO_SHOW:
      formatted.classes = "bg-red-100 text-red-800";
      break;
  }

  return formatted;
}

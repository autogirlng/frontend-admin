"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Toaster, toast } from "react-hot-toast";
import { AlertCircle, Eye, Filter, Search, CheckCircle } from "lucide-react";

// Types
import { Booking, BookingStatus } from "./types";

// Hooks
import {
  useGetFinanceBookings,
  useConfirmOfflinePayment,
} from "@/lib/hooks/finance/useFinanceBookings";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";

// Reusable Components
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { DatePickerWithRange } from "../../availability/DatePickerWithRange";
import TextInput from "@/components/generic/ui/TextInput";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomBack from "@/components/generic/CustomBack";

// Helper to format currency
const formatPrice = (price: number) => {
  return `₦${price.toLocaleString()}`;
};

// Helper function to convert enums to <Select> options
const enumToOptions = (e: object): Option[] =>
  Object.entries(e).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, " "),
  }));

const bookingStatusOptions: Option[] = enumToOptions(BookingStatus);

// ✅ NEW: Options for the new filter
const paymentMethodOptions: Option[] = [
  { id: "ONLINE", name: "Online" },
  { id: "OFFLINE", name: "Offline" },
];

export default function FinanceBookingsPage() {
  const router = useRouter();

  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ UPDATED filters state
  const [filters, setFilters] = useState({
    bookingStatus: null as string | null,
    paymentMethod: null as string | null, // ✅ ADDED
    dateRange: null as DateRange | null,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetFinanceBookings({
    page: currentPage,
    bookingStatus: filters.bookingStatus,
    startDate: filters.dateRange?.from || null,
    endDate: filters.dateRange?.to || null,
    searchTerm: debouncedSearchTerm,
    paymentMethod: filters.paymentMethod, // ✅ ADDED
  });

  const confirmPaymentMutation = useConfirmOfflinePayment();

  // --- Derived Data ---
  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Event Handlers ---
  // ✅ UPDATED to be generic
  const handleFilterChange = (
    key: "bookingStatus" | "paymentMethod",
    value: string | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: dateRange || null }));
    setCurrentPage(0);
  };

  // ✅ UPDATED clearFilters
  const clearFilters = () => {
    setFilters({
      bookingStatus: null,
      paymentMethod: null, // ✅ ADDED
      dateRange: null,
    });
    setSearchTerm("");
    setCurrentPage(0);
  };

  const openConfirmModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedBooking(null);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmPayment = () => {
    if (!selectedBooking) return;
    confirmPaymentMutation.mutate(selectedBooking.bookingId, {
      onSuccess: closeConfirmModal,
    });
  };

  // --- Table Column Definitions ---
  // ✅ UPDATED getBookingActions
  const getBookingActions = (booking: Booking): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "View Booking Details",
        icon: Eye,
        onClick: () => {
          toast.success(`Viewing booking ${booking.bookingId}`);
          // router.push(`/dashboard/bookings/${booking.bookingId}`);
        },
      },
    ];

    // ✅ UPDATED: Now checks for OFFLINE payment method
    if (
      booking.bookingStatus === BookingStatus.PENDING_PAYMENT &&
      booking.paymentMethod === "OFFLINE"
    ) {
      actions.push({
        label: "Confirm Offline Payment",
        icon: CheckCircle,
        onClick: () => openConfirmModal(booking),
      });
    }

    return actions;
  };

  const columns: ColumnDefinition<Booking>[] = [
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
      header: "Host",
      accessorKey: "hostName",
    },
    {
      header: "Trip Start",
      accessorKey: "firstSegmentStarts",
      cell: (item) =>
        item.firstSegmentStarts
          ? format(new Date(item.firstSegmentStarts), "MMM d, yyyy, h:mm a")
          : "N/A",
    },
    {
      header: "Total Price",
      accessorKey: "totalPrice",
      cell: (item) => (
        <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
      ),
    },
    // ✅ NEW Column
    {
      header: "Payment",
      accessorKey: "paymentMethod",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.paymentMethod === "ONLINE"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.paymentMethod}
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
      accessorKey: "actions" as keyof Booking, // Use type assertion
      cell: (item) => <ActionMenu actions={getBookingActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Accountant Records of Bookings
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            View and manage all bookings on the platform.
          </p>
        </div>

        {/* --- Filter Section --- */}
        <div className="p-4 bg-gray-50 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          {/* ✅ UPDATED grid classes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <TextInput
                label="Search"
                id="search"
                hideLabel
                type="text"
                placeholder="Search by Customer, Host, Vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                style={{ paddingLeft: 35 }}
              />
            </div>
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
            {/* ✅ NEW Select for Payment Method */}
            <Select
              label="Payment Method"
              hideLabel
              placeholder="All Payment Methods"
              options={paymentMethodOptions}
              selected={
                filters.paymentMethod
                  ? {
                      id: filters.paymentMethod,
                      name: filters.paymentMethod,
                    }
                  : null
              }
              onChange={(option) =>
                handleFilterChange("paymentMethod", option.id)
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
              getUniqueRowId={(item) => item.bookingId}
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
      {isConfirmModalOpen && selectedBooking && (
        <ActionModal
          title="Confirm Offline Payment"
          message={
            <>
              Are you sure you want to manually confirm payment for booking{" "}
              <strong className="text-gray-900">
                {selectedBooking.bookingId}
              </strong>
              ?
            </>
          }
          actionLabel="Yes, Confirm"
          onClose={closeConfirmModal}
          onConfirm={handleConfirmPayment}
          isLoading={confirmPaymentMutation.isPending}
          variant="primary"
        />
      )}
    </>
  );
}

// app/dashboard/finance/bookings/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Toaster, toast } from "react-hot-toast";
import {
  AlertCircle,
  Eye,
  Filter,
  Search,
  CheckCircle,
  ClipboardCopy,
  CheckCheck,
  Download,
} from "lucide-react";

// Types
import { Booking, BookingStatus } from "./types";

// Hooks
import {
  useGetFinanceBookings,
  useConfirmOfflinePayment,
  useBulkConfirmOfflinePayment,
  useDownloadInvoice, // ✅ NEW
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
import clsx from "clsx";
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
  const [selectedBookingIds, setSelectedBookingIds] = useState(
    new Set<string>()
  );

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    bookingStatus: null as string | null,
    paymentMethod: null as string | null,
    dateRange: null as DateRange | null,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      // 'block: "start"' ensures it aligns to the top of the container
      // This works even if the scroll is inside a div (not the window)
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback just in case
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

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
    paymentMethod: filters.paymentMethod,
  });

  const confirmPaymentMutation = useConfirmOfflinePayment();
  const bulkConfirmMutation = useBulkConfirmOfflinePayment();
  const downloadInvoiceMutation = useDownloadInvoice(); // ✅ Instantiate new hook

  // --- Derived Data ---
  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Event Handlers ---
  const handleFilterChange = (
    key: "bookingStatus" | "paymentMethod",
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
      paymentMethod: null,
      dateRange: null,
    });
    setSearchTerm("");
    setCurrentPage(0);
    setSelectedBookingIds(new Set());
  };

  // --- Selection Handlers ---
  const isRowSelectable = (booking: Booking): boolean => {
    return (
      booking.bookingStatus === BookingStatus.PENDING_PAYMENT &&
      booking.paymentMethod === "OFFLINE"
    );
  };

  const handleRowSelect = (bookingId: string | number) => {
    setSelectedBookingIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId as string)) {
        newSet.delete(bookingId as string);
      } else {
        newSet.add(bookingId as string);
      }
      return newSet;
    });
  };

  const handleSelectAll = (areAllSelected: boolean) => {
    if (areAllSelected) {
      const allSelectableIds = bookings
        .filter(isRowSelectable)
        .map((b) => b.bookingId);
      setSelectedBookingIds(new Set(allSelectableIds));
    } else {
      setSelectedBookingIds(new Set());
    }
  };

  // --- Modal Handlers ---
  const openConfirmModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsConfirmModalOpen(true);
  };

  const openBulkConfirmModal = () => {
    setSelectedBooking(null);
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

  const handleBulkConfirmPayment = () => {
    bulkConfirmMutation.mutate(
      { bookingIds: Array.from(selectedBookingIds) },
      {
        onSuccess: () => {
          closeConfirmModal();
          setSelectedBookingIds(new Set());
        },
      }
    );
  };

  // --- Table Column Definitions ---
  // ✅ UPDATED getBookingActions
  const getBookingActions = (booking: Booking): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "View Booking Details",
        icon: Eye,
        onClick: () => {
          router.push(`/dashboard/bookings/${booking.bookingId}`);
        },
      },
      {
        label: "Download Invoice",
        icon: Download,
        onClick: () =>
          downloadInvoiceMutation.mutate({
            bookingId: booking.bookingId,
            invoiceNumber: booking.invoiceNumber,
          }),
      },
    ];

    if (isRowSelectable(booking)) {
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
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">
            {item.invoiceNumber || "N/A"}
          </span>
          {item.invoiceNumber && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.invoiceNumber!);
                toast.success("Copied to clipboard!");
              }}
              className="text-gray-400 hover:text-[#0096FF]"
              title="Copy invoice number"
            >
              <ClipboardCopy className="h-4 w-4" />
            </button>
          )}
        </div>
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
      header: "Total Price",
      accessorKey: "totalPrice",
      cell: (item) => (
        <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
      ),
    },
    {
      header: "Payment",
      accessorKey: "paymentMethod",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.paymentMethod === "ONLINE"
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
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.bookingStatus === "CONFIRMED"
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
      header: "Date",
      accessorKey: "createdAt",
      cell: (item) => format(new Date(item.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      accessorKey: "actions" as keyof Booking,
      cell: (item) => <ActionMenu actions={getBookingActions(item)} />,
    },
  ];

  const hasSelectedItems = selectedBookingIds.size > 0;
  const isLoadingTable = isPlaceholderData || downloadInvoiceMutation.isPending; // ✅ Add download pending

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
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
        {/* ... (filter section is unchanged) ... */}
        <div className="p-4 bg-gray-50 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
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

        {/* --- Bulk Action Bar --- */}
        {hasSelectedItems && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 mb-4">
            <span className="font-medium text-blue-800">
              {selectedBookingIds.size} item(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="w-auto"
                onClick={() => setSelectedBookingIds(new Set())}
              >
                Deselect All
              </Button>
              <Button
                variant="primary"
                className="w-auto"
                onClick={openBulkConfirmModal}
                isLoading={bulkConfirmMutation.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Confirm ({selectedBookingIds.size})
              </Button>
            </div>
          </div>
        )}

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
          // ✅ UPDATED loading state
          <div
            className={clsx(
              "transition-opacity",
              isLoadingTable ? "opacity-50" : ""
            )}
          >
            <CustomTable
              data={bookings}
              columns={columns}
              getUniqueRowId={(item) => item.bookingId}
              selectedRowIds={selectedBookingIds}
              onRowSelect={(rowId, rowData) => handleRowSelect(rowId)}
              onSelectAll={handleSelectAll}
              isRowSelectable={isRowSelectable}
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
      {isConfirmModalOpen && (
        <ActionModal
          title={
            hasSelectedItems
              ? "Confirm Bulk Payment"
              : "Confirm Offline Payment"
          }
          message={
            hasSelectedItems ? (
              <>
                Are you sure you want to manually confirm payment for{" "}
                <strong className="text-gray-900">
                  {selectedBookingIds.size} selected bookings
                </strong>
                ? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to manually confirm payment for booking{" "}
                <strong className="text-gray-900">
                  {selectedBooking?.invoiceNumber || selectedBooking?.bookingId}
                </strong>
                ?
              </>
            )
          }
          actionLabel={
            hasSelectedItems
              ? `Yes, Confirm ${selectedBookingIds.size}`
              : "Yes, Confirm"
          }
          onClose={closeConfirmModal}
          onConfirm={
            hasSelectedItems ? handleBulkConfirmPayment : handleConfirmPayment
          }
          isLoading={
            confirmPaymentMutation.isPending || bulkConfirmMutation.isPending
          }
          variant="primary"
        />
      )}
    </>
  );
}

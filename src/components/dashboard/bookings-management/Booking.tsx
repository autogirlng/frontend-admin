"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  useGetBookingSegments,
  useDownloadInvoice,
  useDownloadReceipt,
  useCancelBooking,
  useDeleteBooking,
  useGetVehiclesForDropdown,
  useMoveBooking,
  useAllocateVehicle,
} from "@/lib/hooks/booking-management/useBookings";
import {
  usePreviewInvoiceBlob,
  usePreviewReceiptBlob,
} from "@/lib/hooks/finance/usePayments";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { BookingSegment, BookingStatus } from "./types";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import {
  Search,
  AlertCircle,
  View,
  Download,
  Plus,
  Copy,
  Ban,
  Trash2,
  X,
  ArrowRightLeft,
  FileText,
  Car,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomLoader from "@/components/generic/CustomLoader";
import { DatePickerWithRange } from "../availability/DatePickerWithRange";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Button from "@/components/generic/ui/Button";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import { DocumentPreviewModal } from "../finance/PreviewModal";

const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  ...Object.values(BookingStatus).map((status) => ({
    id: status,
    name: formatStatus(status),
  })),
];

function formatStatus(status: string) {
  return (status || "")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBookingStatus(status: BookingStatus) {
  const formatted = {
    name: formatStatus(status),
    classes: "bg-gray-100 text-gray-800",
  };

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

export default function BookingsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Option | null>(null);
  const [bookingTypeFilter, setBookingTypeFilter] = useState<Option | null>(
    null,
  );
  const [previewConfig, setPreviewConfig] = useState<{
    type: "invoice" | "receipt";
    booking: BookingSegment;
  } | null>(null);

  const previewInvoiceBlob = usePreviewInvoiceBlob();
  const previewReceiptBlob = usePreviewReceiptBlob();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveVehicleSearch, setMoveVehicleSearch] = useState("");

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateVehicleSearch, setAllocateVehicleSearch] = useState("");

  const debouncedMoveSearch = useDebounce(moveVehicleSearch, 500);
  const debouncedAllocateSearch = useDebounce(allocateVehicleSearch, 500);

  const [cancelReason, setCancelReason] = useState("");

  const [targetVehicleId, setTargetVehicleId] = useState<string>("");
  const [waivePriceDiff, setWaivePriceDiff] = useState<boolean>(false);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, statusFilter, bookingTypeFilter, dateRange]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetBookingSegments({
    page: currentPage,
    status: statusFilter?.id || "",
    bookingTypeId: bookingTypeFilter?.id || "",
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    searchTerm: debouncedSearchTerm,
  });

  const { data: bookingTypes, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();

  const activeSearchTerm = showAllocateModal
    ? debouncedAllocateSearch
    : debouncedMoveSearch;

  const { data: availableVehicles, isLoading: isLoadingVehicles } =
    useGetVehiclesForDropdown(debouncedMoveSearch);

  const downloadInvoiceMutation = useDownloadInvoice();
  const downloadReceiptMutation = useDownloadReceipt();
  const cancelBookingMutation = useCancelBooking();
  const deleteBookingMutation = useDeleteBooking();
  const moveBookingMutation = useMoveBooking();

  const allocateVehicleMutation = useAllocateVehicle();

  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const bookingTypeOptions: Option[] = useMemo(() => {
    if (!bookingTypes) return [{ id: "", name: "Loading..." }];
    return [
      { id: "", name: "All Booking Types" },
      ...bookingTypes.map((bt) => ({ id: bt.id, name: bt.name })),
    ];
  }, [bookingTypes]);

  const vehicleOptions: Option[] = useMemo(() => {
    if (!availableVehicles) return [];
    return availableVehicles.map((v) => ({
      id: v.id,
      name: `${v.name} (${v.vehicleIdentifier})`,
    }));
  }, [availableVehicles]);

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    // setCurrentPage(0);
  };

  const handleCopyInvoice = (invoiceNumber: string) => {
    navigator.clipboard.writeText(invoiceNumber);
    toast.success("Invoice number copied!");
  };

  const initiateCancel = (id: string) => {
    setSelectedBookingId(id);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const initiateDelete = (id: string) => {
    setSelectedBookingId(id);
    setShowDeleteModal(true);
  };

  const initiateMove = (id: string) => {
    setSelectedBookingId(id);
    setTargetVehicleId("");
    setWaivePriceDiff(false);
    setShowMoveModal(true);
  };

  const initiateAllocate = (id: string) => {
    setSelectedBookingId(id);
    setTargetVehicleId("");
    setShowAllocateModal(true);
  };

  const confirmMove = () => {
    if (!selectedBookingId || !targetVehicleId) {
      toast.error("Please select a new vehicle.");
      return;
    }
    moveBookingMutation.mutate(
      {
        bookingId: selectedBookingId,
        newVehicleId: targetVehicleId,
        waivePriceDifference: waivePriceDiff,
      },
      {
        onSuccess: () => {
          setShowMoveModal(false);
          setSelectedBookingId(null);
          setTargetVehicleId("");
        },
      },
    );
  };

  const confirmAllocate = () => {
    if (!selectedBookingId || !targetVehicleId) {
      toast.error("Please select a vehicle.");
      return;
    }
    allocateVehicleMutation.mutate(
      { bookingId: selectedBookingId, vehicleId: targetVehicleId },
      {
        onSuccess: () => {
          setShowAllocateModal(false);
          setSelectedBookingId(null);
          setTargetVehicleId("");
        },
      },
    );
  };

  const confirmCancel = () => {
    if (!selectedBookingId) return;
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }
    cancelBookingMutation.mutate(
      { bookingId: selectedBookingId, reason: cancelReason },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          setSelectedBookingId(null);
        },
      },
    );
  };

  const confirmDelete = () => {
    if (!selectedBookingId) return;
    deleteBookingMutation.mutate(selectedBookingId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedBookingId(null);
      },
    });
  };

  const getBookingActions = (booking: BookingSegment): ActionMenuItem[] => {
    const canDownloadInvoice = [
      BookingStatus.PENDING_PAYMENT,
      BookingStatus.CONFIRMED,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
    ].includes(booking.bookingStatus);

    const canDownloadReceipt = [
      BookingStatus.CONFIRMED,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
    ].includes(booking.bookingStatus);

    const isCancelled = [
      BookingStatus.CANCELLED_BY_ADMIN,
      BookingStatus.CANCELLED_BY_HOST,
      BookingStatus.CANCELLED_BY_USER,
    ].includes(booking.bookingStatus);

    const isActive = [
      BookingStatus.PENDING_PAYMENT,
      BookingStatus.CONFIRMED,
    ].includes(booking.bookingStatus);

    const actions: ActionMenuItem[] = [
      {
        label: "View Booking",
        icon: View,
        onClick: () => {
          router.push(`/dashboard/bookings/${booking.bookingId}`);
        },
      },
      {
        label: "View Invoice",
        icon: View,
        onClick: () => setPreviewConfig({ type: "invoice", booking }),
      },
      {
        label: "Download Invoice",
        icon: Download,
        onClick: () => {
          if (canDownloadInvoice) {
            if (downloadInvoiceMutation.isPending) return;
            const toastId = toast.loading("Downloading invoice...");
            downloadInvoiceMutation.mutate({
              bookingId: booking.bookingId,
              toastId,
            });
          } else {
            toast.error("Invoice not available for this status.");
          }
        },
      },
      ...(canDownloadReceipt
        ? [
            {
              label: "View Receipt",
              icon: View,
              onClick: () => setPreviewConfig({ type: "receipt", booking }),
            },
            {
              label: "Download Receipt",
              icon: Download,
              disabled: downloadReceiptMutation.isPending,
              onClick: () => {
                const toastId = toast.loading("Downloading receipt...");
                downloadReceiptMutation.mutate({
                  bookingId: booking.bookingId,
                  toastId,
                });
              },
            },
          ]
        : []),
    ];

    const isServicePricing = booking.bookingCategory === "SERVICE_PRICING";
    const isUnassigned =
      booking.vehicleId === "N/A" ||
      booking.vehicleName === "Vehicle not Assigned" ||
      !booking.vehicleId;

    if (isServicePricing && isUnassigned && isActive) {
      actions.unshift({
        label: "Allocate Vehicle",
        icon: Car,
        onClick: () => initiateAllocate(booking.bookingId),
      });
    }

    if (isActive && !isUnassigned) {
      actions.push({
        label: "Transfer Vehicle",
        icon: ArrowRightLeft,
        onClick: () => initiateMove(booking.bookingId),
      });
    }

    if (!isCancelled && booking.bookingStatus !== BookingStatus.COMPLETED) {
      actions.push({
        label: "Cancel Trip",
        icon: Ban,
        onClick: () => initiateCancel(booking.bookingId),
        danger: true,
      });
    }

    actions.push({
      label: "Delete Record",
      icon: Trash2,
      onClick: () => initiateDelete(booking.bookingId),
      danger: true,
    });

    return actions;
  };

  const columns: ColumnDefinition<BookingSegment>[] = [
    {
      header: "Invoice",
      accessorKey: "invoiceNumber",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-gray-700">
            {item.invoiceNumber || "N/A"}
          </span>
          {item.invoiceNumber && (
            <button
              onClick={() => handleCopyInvoice(item.invoiceNumber!)}
              className="text-gray-400 hover:text-[#0096FF] transition-colors p-1 rounded hover:bg-blue-50"
              title="Copy Invoice Number"
            >
              <Copy className="h-3.5 w-3.5" />
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
          <div className="font-medium">{item.vehicleName}</div>
          <div
            className="text-xs text-gray-500 truncate w-32"
            title={item.vehicleId}
          >
            {item.vehicleId}
          </div>
        </div>
      ),
    },
    {
      header: "Booking Type",
      accessorKey: "bookingTypeName",
      cell: (item) => {
        const isSP = item.bookingCategory === "SERVICE_PRICING";

        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 whitespace-nowrap">
              {item.bookingTypeName}
            </span>
            <div className="relative group flex items-center">
              <span
                className={clsx(
                  "cursor-help px-1.5 py-0.5 rounded text-[9px] font-extrabold border leading-none uppercase tracking-wide select-none",
                  isSP
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-blue-50 text-blue-700 border-blue-200",
                )}
              >
                {isSP ? "SP" : "N"}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-max z-50">
                <div className="bg-gray-900 text-white text-[10px] rounded px-2 py-1 shadow-lg relative">
                  {isSP ? "Service Pricing Booking" : "Normal Booking"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        );
      },
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
      <main className="py-3 max-w-8xl mx-auto relative">
        <div ref={topRef} />
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="my-1">
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all bookings on the platform.
            </p>
          </div>
          <div className="my-1">
            <Link
              href="/dashboard/bookings/create"
              className="bg-[#0096FF] flex py-2 px-6 my-1 text-white flex-wrap hover:bg-[#007ACC] items-center"
            >
              <Plus className="mr-2 h-5 w-5" /> Create a Booking
            </Link>
            <Link
              href="/dashboard/bookings/consolidated-invoice"
              className="bg-[#7796FF] flex py-2 px-6 my-1 text-white flex-wrap hover:bg-[#007ACC] items-center"
            >
              <Plus className="mr-2 h-5 w-5" /> Consolidated Invoice
            </Link>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Bookings"
            id="search"
            hideLabel
            type="text"
            placeholder="Search by customer name, vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select
            label="Status"
            hideLabel
            placeholder="Filter by status"
            options={statusOptions}
            selected={statusFilter}
            onChange={(option) => {
              setStatusFilter(option);
              // setCurrentPage(0);
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
              // setCurrentPage(0);
            }}
            disabled={isLoadingBookingTypes}
          />
          <DatePickerWithRange date={dateRange} setDate={handleDateChange} />
        </div>

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
          <div className={clsx(isPlaceholderData && "opacity-60")}>
            <CustomTable
              data={bookings}
              columns={columns}
              getUniqueRowId={(item) => item.segmentId}
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

      {previewConfig && (
        <DocumentPreviewModal
          title={
            previewConfig.type === "invoice"
              ? "Invoice Preview"
              : "Receipt Preview"
          }
          onClose={() => setPreviewConfig(null)}
          fetchDocument={async () => {
            const bookingId = previewConfig.booking.bookingId;

            if (previewConfig.type === "invoice") {
              return await previewInvoiceBlob.mutateAsync({ bookingId });
            } else {
              return await previewReceiptBlob.mutateAsync({ bookingId });
            }
          }}
        />
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <Ban className="w-5 h-5" /> Cancel Booking
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              <TextAreaInput
                label="Reason for Cancellation"
                id="cancelReason"
                placeholder="e.g. Customer requested cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelBookingMutation.isPending}
                className="w-[200px] my-1"
              >
                Close
              </Button>
              <Button
                variant="danger"
                onClick={confirmCancel}
                isLoading={cancelBookingMutation.isPending}
                className="w-[200px] my-1"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Record
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h4 className="text-gray-900 font-medium text-lg">
                Are you absolutely sure?
              </h4>
              <p className="text-sm text-gray-500 mt-2">
                This will permanently delete the booking record and all
                associated data. This action <strong>cannot</strong> be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteBookingMutation.isPending}
                className="w-[200px] my-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={deleteBookingMutation.isPending}
                className="w-[200px] my-1"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" /> Transfer Booking
              </h3>
              <button
                onClick={() => {
                  setShowMoveModal(false);
                  setMoveVehicleSearch("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
                Search and select a new vehicle to move this booking to.
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vehicle name or plate..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={moveVehicleSearch}
                  onChange={(e) => setMoveVehicleSearch(e.target.value)}
                />
              </div>

              <Select
                label="Select Vehicle"
                hideLabel
                options={vehicleOptions}
                selected={vehicleOptions.find((v) => v.id === targetVehicleId)}
                onChange={(opt) => setTargetVehicleId(opt.id)}
                placeholder={
                  isLoadingVehicles
                    ? "Loading results..."
                    : "Select from results"
                }
                disabled={isLoadingVehicles}
              />
              <div
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer"
                onClick={() => setWaivePriceDiff(!waivePriceDiff)}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${
                    waivePriceDiff
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {waivePriceDiff && (
                    <X className="w-3 h-3 text-white rotate-45" />
                  )}
                </div>
                <div>
                  <label className="font-medium text-gray-900 cursor-pointer text-sm">
                    Waive Price Difference
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    If checked, the customer will not be charged extra.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowMoveModal(false)}
                disabled={moveBookingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmMove}
                isLoading={moveBookingMutation.isPending}
              >
                Confirm Transfer
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
                <Car className="w-5 h-5" /> Allocate Vehicle
              </h3>
              <button
                onClick={() => {
                  setShowAllocateModal(false);
                  setAllocateVehicleSearch("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-indigo-700">
                This booking currently has no vehicle. Search for an APPROVED
                vehicle to assign.
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or identifier..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={allocateVehicleSearch}
                  onChange={(e) => setAllocateVehicleSearch(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
              </div>

              <Select
                label="Select Vehicle"
                hideLabel
                options={vehicleOptions}
                selected={vehicleOptions.find((v) => v.id === targetVehicleId)}
                onChange={(opt) => setTargetVehicleId(opt.id)}
                placeholder={
                  isLoadingVehicles
                    ? "Searching..."
                    : vehicleOptions.length === 0 && debouncedAllocateSearch
                      ? "No vehicles found"
                      : "Select a vehicle"
                }
                disabled={isLoadingVehicles}
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowAllocateModal(false)}
                disabled={allocateVehicleMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmAllocate}
                isLoading={allocateVehicleMutation.isPending}
              >
                Confirm Allocation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

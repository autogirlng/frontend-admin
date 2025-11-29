// app/dashboard/finance/payments/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Toaster, toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient"; 
import {
  AlertCircle,
  Eye,
  Filter,
  Search,
  Ticket,
  Vote,
  ClipboardCopy,
  CheckCheck,
  Download, // ✅ Import
  FileText, // ✅ Import
} from "lucide-react";
import clsx from "clsx"; // ✅ Import
import * as XLSX from "xlsx";

// Hooks
import {
  useGetPayments,
  useDownloadInvoice, // ✅ Import
  useDownloadPaymentReceipt, // ✅ Import
  usePreviewInvoiceBlob,
  usePreviewReceiptBlob,
} from "@/lib/hooks/finance/usePayments";
import {
  useConfirmOfflinePayment,
  useBulkConfirmOfflinePayment,
} from "@/lib/hooks/finance/useFinanceBookings";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import {
  PaginatedResponse
} from "@/components/dashboard/finance/types";

// Reusable Components
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { DatePickerWithRange } from "../availability/DatePickerWithRange";
import TextInput from "@/components/generic/ui/TextInput";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import { DocumentPreviewModal } from "./PreviewModal";
import { PaymentDetailModal } from "./PaymentDetailModal";
import { Payment, PaymentStatus } from "./types";
import Link from "next/link";

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

const paymentStatusOptions: Option[] = enumToOptions(PaymentStatus);

export default function PaymentsPage() {
  const router = useRouter();

  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  // State tracks which document type (and payment ID) we are previewing
  const [previewConfig, setPreviewConfig] = useState<{
    type: "invoice" | "receipt";
    payment: Payment;
  } | null>(null);

  // In your PaymentsPage component (add these states near the top)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    payment: Payment | null;  // ← now nullable
    mode: "single" | "bulk";
  }>({ isOpen: false, payment: null, mode: "single" });

  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(new Set());

  // const approveOfflinePayment = useApproveOfflinePayment();
  const confirmPaymentMutation = useConfirmOfflinePayment();
  const bulkConfirmMutation = useBulkConfirmOfflinePayment();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: null as string | null,
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
  } = useGetPayments({
    page: currentPage,
    paymentStatus: filters.paymentStatus,
    startDate: filters.dateRange?.from || null,
    endDate: filters.dateRange?.to || null,
    searchTerm: debouncedSearchTerm,
  });

  // ✅ Instantiate new hooks
  const downloadInvoiceMutation = useDownloadInvoice();
  const downloadReceiptMutation = useDownloadPaymentReceipt();

  const previewInvoiceBlob = usePreviewInvoiceBlob();
  const previewReceiptBlob = usePreviewReceiptBlob();

  // --- Derived Data ---
  const payments = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // Fetch ALL filtered payments (ignoring pagination)
  const fetchAllFilteredPayments = async () => {
    const params = new URLSearchParams();

    params.append("page", "0");
    params.append("size", "10000"); // large size so all results fit

    // Date range
    if (filters.dateRange?.from) {
      params.append("startDate", format(filters.dateRange.from, "yyyy-MM-dd"));
    }

    if (filters.dateRange?.to) {
      params.append("endDate", format(filters.dateRange.to, "yyyy-MM-dd"));
    }

    // Search term (not stored inside filters)
    if (debouncedSearchTerm.trim() !== "") {
      params.append("searchTerm", debouncedSearchTerm.trim());
    }

    const endpoint = `/admin/payments?${params.toString()}`;
    const res = await apiClient.get<PaginatedResponse<Payment>>(endpoint);

    // your API returns: content[], totalPages, ...
    return res.content ?? [];
  };


  // --- Event Handlers ---
  const handleFilterChange = (key: "paymentStatus", value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };
  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: dateRange || null }));
    setCurrentPage(0);
  };
  // --- Selection Handlers ---
  const isRowSelectable = (payment: Payment): boolean => {
    return payment.paymentStatus === "PENDING" && payment.paymentProvider === "OFFLINE";
  };

  const handleRowSelect = (rowId: string | number, rowData: Payment) => {
    const id = rowId.toString();
    setSelectedPaymentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (areAllSelected: boolean) => {
    if (areAllSelected) {
      const allSelectableIds = payments
        .filter(isRowSelectable)
        .map((p) => p.id);
      setSelectedPaymentIds(new Set(allSelectableIds));
    } else {
      setSelectedPaymentIds(new Set());
    }
  };
  const handleExportSuccessfulPayments = async () => {
    toast.loading("Preparing export...", { id: "export" });

    // Fetch ALL data (ignoring pagination)
    const allPayments = await fetchAllFilteredPayments();

    const successfulPayments = allPayments.filter(
      (p) => p.paymentStatus === "SUCCESSFUL"
    );

    if (successfulPayments.length === 0) {
      toast.error("No successful payments match the current filters", { id: "export" });
      return;
    }

    // Build export period text
    let period = "All_Time";
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const from = format(filters.dateRange.from, "dd-MMM-yyyy");
      const to = format(filters.dateRange.to, "dd-MMM-yyyy");
      period = `${from}_to_${to}`;
    }

    const filename = `Successful_Payments_${period}.xlsx`;

    // Prepare export data
    const exportData = successfulPayments.map((p) => ({
      "Customer Name": p.userName || "Guest",
      "Booking Ref": p.bookingRef || "-",
      Amount: `₦${p.totalPayable.toLocaleString()}`,
      "Invoice Number": p.invoiceNumber || "-",
      "Payment Date": format(new Date(p.createdAt), "dd MMM yyyy, HH:mm"),
      Vehicle: p.vehicleName,
      Provider: p.paymentProvider,
      Status: p.paymentStatus,
    }));

    // Build Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    ws["!cols"] = [
      { wch: 22 }, // Customer Name
      { wch: 18 }, // Booking Ref
      { wch: 15 }, // Amount
      { wch: 20 }, // Invoice Number
      { wch: 24 }, // Payment Date
      { wch: 22 }, // Vehicle
      { wch: 14 }, // Provider
      { wch: 12 }, // Status
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, filename);

    toast.success(
      <div className="text-sm">
        <strong>Export Complete!</strong>
        <br />
        {successfulPayments.length} successful payments
        <br />
        Period: <strong>{period.replace(/_/g, " ")}</strong>
      </div>,
      { id: "export" }
    );
  };

  const clearFilters = () => {
    setFilters({
      paymentStatus: null,
      dateRange: null,
    });
    setSearchTerm("");
    setCurrentPage(0);
  };
  const closeModal = () => {
    setSelectedPaymentId(null);
  };


  // --- Table Column Definitions ---
  // ✅ UPDATED Action Menu
  const getPaymentActions = (payment: Payment): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "View Details",
        icon: Eye,
        onClick: () => setSelectedPaymentId(payment.id),
      },
      {
        label: "View Booking",
        icon: Ticket,
        onClick: () => {
          router.push(`/dashboard/bookings/${payment.bookingId}`);
        },
      },
      {
        label: "View Invoice",
        icon: FileText,
        onClick: () => setPreviewConfig({ type: "invoice", payment }),
      },
      {
        label: "Download Invoice",
        icon: FileText,
        onClick: () =>
          downloadInvoiceMutation.mutate({
            bookingId: payment.bookingId,
            invoiceNumber: payment.invoiceNumber,
            userName: payment.userName
          }),
      },
    ];

    if (payment.paymentStatus === "SUCCESSFUL") {
      // ✅ Preview Receipt Action
      actions.push({
        label: "View Receipt",
        icon: FileText,
        onClick: () => setPreviewConfig({ type: "receipt", payment }),
      });
    }

    // Only add "Download Receipt" if payment was successful
    if (payment.paymentStatus === "SUCCESSFUL") {
      actions.push({
        label: "Download Receipt",
        icon: Download,
        onClick: () =>
          downloadReceiptMutation.mutate({
            bookingId: payment.bookingId,
            invoiceNumber: payment.invoiceNumber,
            userName: payment.userName
          }),
      });
    }

    // Only show for PENDING offline payments
    if (payment.paymentStatus === "PENDING" && payment.paymentProvider === "OFFLINE") {
      actions.push({
        label: "Approve Payment",
        icon: Vote,
        onClick: () => {
          setConfirmModal({ isOpen: true, payment, mode: "single" });
        },
        disabled: confirmPaymentMutation.isPending,
      });
    }

    return actions;
  };

  const columns: ColumnDefinition<Payment>[] = [
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
      header: "Customer Name",
      accessorKey: "userName",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.userName}</div>
          <div className="text-gray-500">{item.userPhone}</div>
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
      header: "Amount",
      accessorKey: "totalPayable",
      cell: (item) => (
        <span className="font-semibold">{formatPrice(item.totalPayable)}</span>
      ),
    },
    {
      header: "Provider",
      accessorKey: "paymentProvider",
    },
    {
      header: "Status",
      accessorKey: "paymentStatus",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.paymentStatus === "SUCCESSFUL"
              ? "bg-green-100 text-green-800"
              : item.paymentStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.paymentStatus.replace(/_/g, " ")}
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
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getPaymentActions(item)} />,
    },
  ];

  // ✅ Combine all mutation loading states
  const isActionLoading =
    isPlaceholderData ||
    downloadInvoiceMutation.isPending ||
    downloadReceiptMutation.isPending;

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-lg text-gray-600 mt-1">
              View and manage all payments on the platform.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/finance/bookings"
              className="text-sm font-medium text-white px-6 py-3 bg-[#0096FF]" 
            >
              View Bookings
            </Link>
            <Button
              onClick={handleExportSuccessfulPayments}
              variant="primary"
              size="smd"
              className="w-auto min-w-[140px] whitespace-nowrap"
              disabled={isLoading || payments.length === 0}
            >
              Export Payments
            </Button>
          </div>
        </div>

        {/* --- Filter Section --- */}
        <div className="p-4 bg-gray-50 border border-gray-200 mb-6">
          {" "}
          {/* Added rounded-lg */}
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <TextInput
                label="Search"
                id="search"
                hideLabel
                type="text"
                placeholder="Search by Customer Name, Invoice Number, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                style={{ paddingLeft: 35 }}
              />
            </div>
            <Select
              label="Payment Status"
              hideLabel
              placeholder="All Payment Statuses"
              options={paymentStatusOptions}
              selected={
                filters.paymentStatus
                  ? {
                      id: filters.paymentStatus,
                      name: filters.paymentStatus.replace(/_/g, " "),
                    }
                  : null
              }
              onChange={(option) =>
                handleFilterChange("paymentStatus", option.id)
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
            <span className="font-semibold">Failed to load payments.</span>
          </div>
        )}
        {!isLoading && !isError && payments.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No payments found for the selected filters.</p>
          </div>
        )}

        {/* ADD THIS BULK BAR HERE */}
        {selectedPaymentIds.size > 0 && (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 mb-6 rounded-lg">
            <span className="font-medium text-green-800">
              {selectedPaymentIds.size} pending offline payment(s) selected
            </span>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedPaymentIds(new Set())}
              >
                Deselect All
              </Button>
              <Button
                variant="primary"
                onClick={() => setConfirmModal({ isOpen: true, payment: null, mode: "bulk" })}
                isLoading={bulkConfirmMutation.isPending}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Approve Selected ({selectedPaymentIds.size})
              </Button>
            </div>
          </div>
        )}

        {!isError && (payments.length > 0 || isLoading) && (
          <div
            className={clsx(
              "transition-opacity",
              isActionLoading ? "opacity-50" : "" // ✅ Use combined loading state
            )}
          >
            <CustomTable
              data={payments}
              columns={columns}
              getUniqueRowId={(item) => item.id}
              selectedRowIds={selectedPaymentIds}
              onRowSelect={handleRowSelect}
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
      {selectedPaymentId && (
        <PaymentDetailModal
          paymentId={selectedPaymentId}
          onClose={closeModal}
        />
      )}

      {/* ✅ Document Preview Modal */}
      {previewConfig && (
        <DocumentPreviewModal
          title={
            previewConfig.type === "invoice" ? "Invoice Preview" : "Receipt Preview"
          }
          onClose={() => setPreviewConfig(null)}
          fetchDocument={async () => {
            const bookingId = previewConfig.payment.bookingId;

            if (previewConfig.type === "invoice") {
              // mutateAsync returns the Blob directly
              return await previewInvoiceBlob.mutateAsync({ bookingId });
            } else {
              return await previewReceiptBlob.mutateAsync({ bookingId });
            }
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.mode === "bulk"
            ? `Bulk Approve ${selectedPaymentIds.size} Offline Payments`
            : "Approve Offline Payment"
        }
        message={
          confirmModal.mode === "bulk" ? (
            <div className="space-y-2">
              <p>Are you sure you want to approve the offline payments for:</p>

              {/* Beautiful card — same exact style as single */}
              <div className="bg-gray-50 rounded-lg p-4 font-medium text-gray-900 border border-gray-200 max-h-64 overflow-y-auto">
                {(() => {
                  const selectedPayments = payments
                    .filter((p) => selectedPaymentIds.has(p.id))
                    .sort((a, b) => (a.userName || "").localeCompare(b.userName || ""));

                  const displayed = selectedPayments.slice(0, 5);
                  const remaining = selectedPayments.length - displayed.length;

                  return (
                    <>
                      {displayed.map((p) => (
                        <div key={p.id} className="py-2 border-b border-gray-200 last:border-0">
                          <p className="text-base font-medium">
                            {p.userName || "Guest"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Booking: <span className="font-mono">{p.bookingRef}</span> 
                            Amount : <span>₦ {p.totalPayable?.toLocaleString()}</span>
                          </p>
                        </div>
                      ))}

                      {remaining > 0 && (
                        <p className="pt-3 text-center text-sm font-medium text-gray-600">
                          and <strong>{remaining}</strong> other{remaining > 1 ? "s" : ""}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>

              <p className="mt-4 text-sm text-gray-700">
                This will mark all <strong>{selectedPaymentIds.size}</strong> payments as{" "}
                <strong className="text-green-600">SUCCESSFUL</strong> and generate receipts.
              </p>
              <p className="text-xs text-gray-500">This action cannot be undone.</p>
            </div>
          ) : confirmModal.payment ? (
            <div className="space-y-2">
              <p>Are you sure you want to approve the offline payment for:</p>
              <div className="bg-gray-50 rounded-lg p-4 font-medium text-gray-900 border border-gray-200">
                <p className="text-lg">{confirmModal.payment.userName || "Guest"}</p>
                <p className="text-sm text-gray-600">
                  Booking Ref: <span className="font-mono">{confirmModal.payment.bookingRef}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Amount: ₦{confirmModal.payment.totalPayable?.toLocaleString()}
                </p>
              </div>
              <p className="mt-3 text-sm">
                This action will mark the payment as <strong>SUCCESSFUL</strong> and generate a receipt.
              </p>
            </div>
          ) : (
            "Loading..."
          )
        }
        confirmLabel={
          confirmModal.mode === "bulk"
            ? `Approve ${selectedPaymentIds.size} Payments`
            : "Approve Payment"
        }
        onConfirm={() => {
          if (confirmModal.mode === "bulk") {
            const bookingIds = payments
              .filter((p) => selectedPaymentIds.has(p.id))
              .map((p) => p.bookingId);

            bulkConfirmMutation.mutate(
              { bookingIds },
              {
                onSuccess: () => {
                  toast.success(`Approved ${bookingIds.length} payments successfully!`);
                  setConfirmModal({ isOpen: false, payment: null, mode: "single" });
                  setSelectedPaymentIds(new Set());
                },
                onError: () => {
                  toast.error("Bulk approval failed");
                },
              }
            );
          } else if (confirmModal.payment) {
            confirmPaymentMutation.mutate(confirmModal.payment.bookingId,
              {
                onSuccess: () => {
                  toast.success(
                    <div>
                      <strong>Payment Approved Successfully!</strong>
                      <br />
                      Customer: <strong>{confirmModal.payment?.userName || "Guest"}</strong>
                      <br />
                      Invoice: <span className="font-mono">{confirmModal.payment?.invoiceNumber}</span>
                    </div>
                  );
                  setConfirmModal({ isOpen: false, payment: null, mode: "single" });
                },
                onError: () => {
                  toast.error("Failed to approve payment.");
                },
              }
            );
          }
        }}
        onCancel={() => {
          setConfirmModal({ isOpen: false, payment: null, mode: "single" });
          if (confirmModal.mode === "bulk") {
            setSelectedPaymentIds(new Set());
          }
        }}
        isLoading={confirmPaymentMutation.isPending || bulkConfirmMutation.isPending}
        variant={confirmModal.mode === "bulk" ? "primary" : "primary"}
      />
    </>
  );
}

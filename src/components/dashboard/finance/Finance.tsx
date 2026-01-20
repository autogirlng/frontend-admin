"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Toaster, toast } from "react-hot-toast";
import {
  Eye,
  Ticket,
  Vote,
  View,
  ClipboardCopy,
  CheckCheck,
  Download,
  FileText,
  Plus,
  Edit,
  ExternalLink,
  Coins,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import {
  useGetPayments,
  useDownloadInvoice,
  useDownloadPaymentReceipt,
  usePreviewInvoiceBlob,
  usePreviewReceiptBlob,
} from "@/lib/hooks/finance/usePayments";
import { usePaymentExport } from "./payments/hooks/usePaymentExport";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";

import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { DocumentPreviewModal } from "./PreviewModal";
import { PaymentDetailModal } from "./PaymentDetailModal";
import { UpdateBookingModal } from "./UpdateBookingModal";
import { PaymentFilters } from "./payments/PaymentFilters";
import { PaymentApprovalModal } from "./payments/PaymentApprovalModal";

import { Payment } from "./types";
import { formatPrice } from "./payments/utils";

export default function PaymentsPage() {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filters, setFilters] = useState<{
    paymentStatus: string | null;
    paymentMethod: string | null;
    dateRange: DateRange | null;
  }>({
    paymentStatus: null,
    paymentMethod: null,
    dateRange: null,
  });

  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(
    new Set(),
  );

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [paymentToUpdate, setPaymentToUpdate] = useState<Payment | null>(null);
  const [previewConfig, setPreviewConfig] = useState<{
    type: "invoice" | "receipt";
    payment: Payment;
  } | null>(null);

  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    payment: Payment | null;
    mode: "single" | "bulk";
  }>({
    isOpen: false,
    payment: null,
    mode: "single",
  });

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetPayments({
    page: currentPage,
    size: pageSize,
    paymentStatus: filters.paymentStatus,
    paymentMethod: filters.paymentMethod,
    startDate: filters.dateRange?.from || null,
    endDate: filters.dateRange?.to || null,
    searchTerm: debouncedSearchTerm,
  });

  const downloadInvoiceMutation = useDownloadInvoice();
  const downloadReceiptMutation = useDownloadPaymentReceipt();
  const previewInvoiceBlob = usePreviewInvoiceBlob();
  const previewReceiptBlob = usePreviewReceiptBlob();

  const { handleExportPayments, isExporting } = usePaymentExport({
    filters,
    searchTerm: debouncedSearchTerm,
  });

  const payments = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm]);

  const handleFilterChange = (
    key: "paymentStatus" | "paymentMethod",
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
    setFilters({ paymentStatus: null, paymentMethod: null, dateRange: null });
    setSearchTerm("");
    setCurrentPage(0);
  };

  const isRowSelectable = (payment: Payment) =>
    (payment.paymentStatus === "PENDING" ||
      payment.paymentStatus === "PARTIALLY_PAID") &&
    payment.paymentProvider === "OFFLINE";

  const handleRowSelect = (rowId: string | number) => {
    const id = rowId.toString();
    setSelectedPaymentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
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
        onClick: () => router.push(`/dashboard/bookings/${payment.bookingId}`),
      },
      {
        label: "View Invoice",
        icon: View,
        onClick: () => setPreviewConfig({ type: "invoice", payment }),
      },
      {
        label: "Download Invoice",
        icon: FileText,
        onClick: () =>
          downloadInvoiceMutation.mutate({
            bookingId: payment.bookingId,
            invoiceNumber: payment.invoiceNumber,
            userName: payment.userName,
          }),
      },
    ];

    if (payment.paymentImage && payment.paymentImage !== "string") {
      actions.push({
        label: "View Payment Proof",
        icon: ExternalLink,
        onClick: () => window.open(payment.paymentImage!, "_blank"),
      });
    }

    if (payment.paymentStatus === "PENDING") {
      actions.push({
        label: "Update Booking",
        icon: Edit,
        onClick: () => setPaymentToUpdate(payment),
      });
    }

    if (
      payment.paymentStatus === "SUCCESSFUL" ||
      payment.paymentStatus === "PARTIALLY_PAID"
    ) {
      actions.push({
        label: "View Receipt",
        icon: View,
        onClick: () => setPreviewConfig({ type: "receipt", payment }),
      });
      actions.push({
        label: "Download Receipt",
        icon: Download,
        onClick: () =>
          downloadReceiptMutation.mutate({
            bookingId: payment.bookingId,
            invoiceNumber: payment.invoiceNumber,
            userName: payment.userName,
          }),
      });
    }

    if (
      (payment.paymentStatus === "PENDING" ||
        payment.paymentStatus === "PARTIALLY_PAID") &&
      payment.paymentProvider === "OFFLINE"
    ) {
      actions.push({
        label:
          payment.paymentStatus === "PARTIALLY_PAID"
            ? "Update Balance"
            : "Approve Payment",
        icon: payment.paymentStatus === "PARTIALLY_PAID" ? Coins : Vote,
        onClick: () =>
          setApprovalModal({ isOpen: true, payment, mode: "single" }),
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
                toast.success("Copied!");
              }}
              className="text-gray-400 hover:text-[#0096FF]"
            >
              <ClipboardCopy className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: "userName",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.userName}</div>
          <div className="text-gray-500 text-xs">{item.userPhone}</div>
        </div>
      ),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleName",
      cell: (item) => (
        <div>
          <div
            className="font-medium text-gray-900 truncate max-w-[150px]"
            title={item.vehicleName}
          >
            {item.vehicleName}
          </div>
          <div
            className="text-gray-500 truncate max-w-[150px]"
            title={item.vehicleIdentifier}
          >
            {item.vehicleIdentifier}
          </div>
        </div>
      ),
    },
    {
      header: "Payment Info",
      accessorKey: "totalPayable",
      cell: (item) => {
        const isPartial =
          item.amountPaid &&
          item.amountPaid < item.totalPayable &&
          item.amountPaid > 0;
        const percentage = isPartial
          ? Math.round((item.amountPaid! / item.totalPayable) * 100)
          : 0;

        return (
          <div className="flex flex-col min-w-[120px]">
            <span className="font-semibold text-gray-900">
              {formatPrice(item.totalPayable)}
            </span>
            {isPartial && (
              <div className="w-full mt-1">
                <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                  <span>Paid: {formatPrice(item.amountPaid!)}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-orange-500 h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
            {item.amountPaid === item.totalPayable && item.amountPaid > 0 && (
              <span className="text-[10px] text-green-600 flex items-center gap-1">
                <CheckCheck className="w-3 h-3" /> Fully Paid
              </span>
            )}
          </div>
        );
      },
    },
    { header: "Provider", accessorKey: "paymentProvider" },
    {
      header: "Status",
      accessorKey: "paymentStatus",
      cell: (item) => {
        let bgClass = "bg-gray-100 text-gray-800";
        if (item.paymentStatus === "SUCCESSFUL")
          bgClass = "bg-green-100 text-green-800";
        else if (item.paymentStatus === "PENDING")
          bgClass = "bg-yellow-100 text-yellow-800";
        else if (item.paymentStatus === "PARTIALLY_PAID")
          bgClass = "bg-orange-100 text-orange-800 border border-orange-200";
        else if (
          item.paymentStatus === "FAILED" ||
          item.paymentStatus === "ABANDONED"
        )
          bgClass = "bg-red-100 text-red-800";

        return (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${bgClass}`}
          >
            {item.paymentStatus.replace(/_/g, " ")}
          </span>
        );
      },
    },
    {
      header: "Timestamps",
      accessorKey: "createdAt",
      cell: (item) => {
        const createdDate = new Date(item.createdAt);
        return (
          <div className="flex flex-col text-xs">
            <span className="text-gray-500">
              Created:{" "}
              <span className="text-gray-900">
                {format(createdDate, "MMM d, HH:mm")}
              </span>
            </span>
            {item.paidAt ? (
              <span className="text-green-600 mt-1">
                Paid: {format(new Date(item.paidAt), "MMM d, HH:mm")}
              </span>
            ) : (
              <span className="text-gray-400 italic mt-1">Not Paid</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getPaymentActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        <div className="flex items-center justify-between mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-lg text-gray-600 mt-1">
              View and manage all payments on the platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard/finance/bookings"
                className="text-sm font-medium text-white px-6 py-3 bg-[#0096FF] my-1 rounded hover:bg-[#007ACC]"
              >
                View Bookings
              </Link>
              <Button
                onClick={handleExportPayments}
                variant="primary"
                size="smd"
                className="w-auto min-w-[140px] whitespace-nowrap my-1"
                disabled={isLoading || payments.length === 0}
              >
                Export Payments
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href="/dashboard/bookings/consolidated-invoice"
                className="bg-[#7796FF] flex py-2 px-6 my-1 text-white hover:bg-[#007ACC] items-center rounded"
              >
                <Plus className="mr-2 h-5 w-5" /> Consolidated Invoice
              </Link>
            </div>
          </div>
        </div>

        <PaymentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleDateChange={handleDateChange}
          clearFilters={clearFilters}
        />

        {selectedPaymentIds.size > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-900">
                  {selectedPaymentIds.size} selected
                </p>
                <p className="text-sm text-green-700">
                  Ready for approval (Defaults to Full Payment)
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedPaymentIds(new Set())}
              >
                Deselect All
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  setApprovalModal({
                    isOpen: true,
                    payment: null,
                    mode: "bulk",
                  })
                }
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Approve All ({selectedPaymentIds.size})
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="px-3 py-1.5 border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#0096FF]"
            >
              {[10, 25, 50, 75, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
          <span className="text-sm text-gray-600">
            Showing{" "}
            <strong>
              {paginatedData ? currentPage * pageSize + 1 : 0} -{" "}
              {paginatedData
                ? Math.min(
                    (currentPage + 1) * pageSize,
                    paginatedData.totalItems,
                  )
                : 0}
            </strong>{" "}
            of <strong>{paginatedData?.totalItems || 0}</strong>
          </span>
        </div>

        {isLoading && !paginatedData && <CustomLoader />}
        {!isLoading && !isError && payments.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No payments found.</p>
          </div>
        )}
        {!isError && (payments.length > 0 || isLoading) && (
          <div
            className={clsx(
              "transition-opacity",
              isPlaceholderData || isExporting ? "opacity-50" : "",
            )}
          >
            <CustomTable
              data={payments}
              columns={columns}
              getUniqueRowId={(item) => item.id}
              selectedRowIds={selectedPaymentIds}
              onRowSelect={(id) => handleRowSelect(id)}
              onSelectAll={handleSelectAll}
              isRowSelectable={isRowSelectable}
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

      {selectedPaymentId && (
        <PaymentDetailModal
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}

      {previewConfig && (
        <DocumentPreviewModal
          title={
            previewConfig.type === "invoice"
              ? "Invoice Preview"
              : "Receipt Preview"
          }
          onClose={() => setPreviewConfig(null)}
          fetchDocument={async () => {
            const bookingId = previewConfig.payment.bookingId;
            return previewConfig.type === "invoice"
              ? await previewInvoiceBlob.mutateAsync({ bookingId })
              : await previewReceiptBlob.mutateAsync({ bookingId });
          }}
        />
      )}

      <PaymentApprovalModal
        isOpen={approvalModal.isOpen}
        mode={approvalModal.mode}
        payment={approvalModal.payment}
        selectedPayments={payments.filter((p) => selectedPaymentIds.has(p.id))}
        onClose={() => setApprovalModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={() => {
          setApprovalModal((prev) => ({ ...prev, isOpen: false }));
          setSelectedPaymentIds(new Set());
        }}
      />

      {paymentToUpdate && (
        <UpdateBookingModal
          bookingId={paymentToUpdate.bookingId}
          onClose={() => setPaymentToUpdate(null)}
        />
      )}
    </>
  );
}

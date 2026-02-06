"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

import { useGetHostPayouts, useMarkPayoutPaid } from "./usePayouts";
import { PayoutBooking } from "./types";

import CustomLoader from "@/components/generic/CustomLoader";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionMenu } from "@/components/generic/ui/ActionMenu";
import Select, { Option } from "@/components/generic/ui/Select";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import Button from "@/components/generic/ui/Button";
import { DownloadHostInvoiceModal } from "../DownloadHostInvoiceModal";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);

const statusOptions: Option[] = [
  { id: "PENDING", name: "Pending Payouts" },
  { id: "PAID", name: "Paid Payouts" },
];

export default function HostPayout() {
  const params = useParams();
  const hostId = params.hostId as string;

  const topRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Option>(statusOptions[0]);
  const [selectedBooking, setSelectedBooking] = useState<PayoutBooking | null>(
    null,
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDownloadHostInvoiceModalOpen, setIsDownloadHostInvoiceModalOpen] =
    useState(false);

  const {
    data: payoutData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetHostPayouts(hostId, statusFilter.id, currentPage);

  const markPaidMutation = useMarkPayoutPaid();

  const bookings = payoutData?.bookings?.content || [];
  const totalPages = payoutData?.bookings?.totalPages || 0;

  const handleMarkPaid = () => {
    if (!selectedBooking) return;
    markPaidMutation.mutate(selectedBooking.bookingId, {
      onSuccess: () => {
        setIsConfirmModalOpen(false);
        setSelectedBooking(null);
      },
    });
  };

  const openConfirmModal = (booking: PayoutBooking) => {
    setSelectedBooking(booking);
    setIsConfirmModalOpen(true);
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const columns: ColumnDefinition<PayoutBooking>[] = [
    {
      header: "Invoice",
      accessorKey: "invoiceNumber",
      cell: (item) => (
        <span className="font-mono text-sm">{item.invoiceNumber}</span>
      ),
    },
    {
      header: "Date",
      accessorKey: "bookingDate",
      cell: (item) => format(new Date(item.bookingDate), "MMM d, yyyy"),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleName",
    },
    {
      header: "Base Price",
      accessorKey: "basePrice",
      cell: (item) => (
        <span className="text-gray-600">{formatPrice(item.basePrice)}</span>
      ),
    },
    {
      header: "Deductions",
      accessorKey: "adminDeduction",
      cell: (item) => (
        <span className="text-red-600 text-sm">
          - {formatPrice(item.adminDeduction)}
        </span>
      ),
    },
    {
      header: "Host Payout",
      accessorKey: "toPayToHost",
      cell: (item) => (
        <span className="font-bold text-gray-900">
          {formatPrice(item.toPayToHost)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "hostPaymentStatus",
      cell: (item) => (
        <span
          className={clsx(
            "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1",
            item.hostPaymentStatus === "PAID"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800",
          )}
        >
          {item.hostPaymentStatus === "PAID" ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {item.hostPaymentStatus}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "bookingId",
      cell: (item) => {
        if (item.hostPaymentStatus === "PAID") return null;

        return (
          <ActionMenu
            actions={[
              {
                label: "Mark as Paid",
                icon: CheckCircle,
                onClick: () => openConfirmModal(item),
              },
            ]}
          />
        );
      },
    },
  ];

  if (isLoading && !payoutData) return <CustomLoader />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-red-600">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Failed to load payout data.</p>
        <CustomBack />
      </div>
    );
  }

  return (
    <main className="max-w-8xl mx-auto space-y-8 pb-10">
      <Toaster position="top-right" />

      <div className="flex justify-between">
        <div>
          <CustomBack />
          <h1 className="text-3xl font-bold text-gray-900">Host Payouts</h1>
        </div>
        <Button
          onClick={() => setIsDownloadHostInvoiceModalOpen(true)}
          variant="primary"
          size="smd"
          className="w-auto min-w-[140px] h-[50px] whitespace-nowrap my-1"
          // disabled={isLoading || payments.length === 0}
        >
          Download Host Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Pending Payout
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(payoutData?.totalAmountToPay || 0)}
          </p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Paid Out
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(payoutData?.totalPaidToHost || 0)}
          </p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Earnings
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(payoutData?.totalAmountHostHaveMade || 0)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Payment History
          </h2>
          <div className="w-48">
            <Select
              label="Status"
              hideLabel
              options={statusOptions}
              selected={statusFilter}
              onChange={(option) => {
                setStatusFilter(option);
                setCurrentPage(0);
              }}
            />
          </div>
        </div>

        <div className="bg-white overflow-hidden">
          {bookings.length > 0 ? (
            <div className={clsx(isPlaceholderData && "opacity-50")}>
              <div ref={topRef} />
              <CustomTable
                data={bookings}
                columns={columns}
                getUniqueRowId={(item) => item.bookingId}
              />
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No payouts found for this status.</p>
            </div>
          )}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </div>

      {isDownloadHostInvoiceModalOpen && (
        <DownloadHostInvoiceModal
          isOpen={isDownloadHostInvoiceModalOpen}
          onClose={() => setIsDownloadHostInvoiceModalOpen(false)}
          hostId={hostId}
        />
      )}

      {isConfirmModalOpen && selectedBooking && (
        <ActionModal
          title="Confirm Payout"
          message={
            <>
              Are you sure you want to mark invoice{" "}
              <strong className="text-gray-900">
                {selectedBooking.invoiceNumber}
              </strong>{" "}
              as PAID? This will update the host's balance.
            </>
          }
          actionLabel="Mark as Paid"
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleMarkPaid}
          isLoading={markPaidMutation.isPending}
          variant="primary"
        />
      )}
    </main>
  );
}

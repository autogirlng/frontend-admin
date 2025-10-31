// app/dashboard/finance/payments/PaymentDetailModal.tsx
"use client";

import React from "react";
import { X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useGetPaymentDetails } from "@/lib/hooks/finance/usePayments";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";

interface PaymentDetailModalProps {
  paymentId: string;
  onClose: () => void;
}

// Helper for data pairs
const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-900 break-words">
      {value || <span className="text-gray-400">N/A</span>}
    </p>
  </div>
);

// Helper to format currency
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "N/A";
  return `₦${price.toLocaleString()}`;
};

// ✅ --- NEW: Status Badge Helper ---
const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = "bg-gray-100 text-gray-800"; // Default

  switch (status) {
    case "SUCCESSFUL":
      colorClasses = "bg-green-100 text-green-800";
      break;
    case "PENDING":
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
    case "FAILED":
    case "ABANDONED":
      colorClasses = "bg-red-100 text-red-800";
      break;
  }

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full inline-block ${colorClasses}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};
// ✅ --- END NEW COMPONENT ---

export function PaymentDetailModal({
  paymentId,
  onClose,
}: PaymentDetailModalProps) {
  const { data: payment, isLoading, isError } = useGetPaymentDetails(paymentId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-10">
          <CustomLoader />
        </div>
      );
    }

    if (isError || !payment) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load payment details.</span>
        </div>
      );
    }

    // ✅ Logic for financial status color
    const isPaid = payment.paymentStatus === "SUCCESSFUL";
    const amountPaid = payment.amountPaid ?? 0;
    const isAmountMismatch = isPaid && amountPaid < payment.totalPayable;

    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Payment ID" value={payment.id} />
          <DetailItem label="Booking ID" value={payment.bookingId} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* ✅ UPDATED: Use the StatusBadge component */}
          <DetailItem
            label="Payment Status"
            value={<StatusBadge status={payment.paymentStatus} />}
          />
          <DetailItem
            label="Payment Provider"
            value={payment.paymentProvider}
          />
        </div>
        <DetailItem
          label="Transaction Reference"
          value={payment.transactionReference}
        />
        <hr />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem
            label="Total Payable"
            value={formatPrice(payment.totalPayable)}
          />
          {/* ✅ UPDATED: Add color coding for amount paid */}
          <div>
            <p className="text-sm font-medium text-gray-500">Amount Paid</p>
            <p
              className={`text-base font-semibold ${
                isPaid ? "text-green-600" : "text-gray-900"
              } ${isAmountMismatch ? "text-red-600" : ""}`}
            >
              {formatPrice(payment.amountPaid)}
              {isAmountMismatch && (
                <span className="text-xs font-normal ml-2">(Mismatch)</span>
              )}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem
            label="Created At"
            value={format(new Date(payment.createdAt), "MMM d, yyyy, h:mm a")}
          />
          <DetailItem
            label="Paid At"
            value={
              payment.paidAt
                ? format(new Date(payment.paidAt), "MMM d, yyyy, h:mm a")
                : "N/A"
            }
          />
        </div>
        <hr />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Vehicle Name" value={payment.vehicleName} />
          <DetailItem
            label="Vehicle Identifier"
            value={payment.vehicleIdentifier}
          />
          <DetailItem label="Vehicle ID" value={payment.vehicleId} />
          <DetailItem label="User ID" value={payment.userId} />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Payment Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

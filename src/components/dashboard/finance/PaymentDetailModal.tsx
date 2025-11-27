"use client";

import React from "react";
import Link from "next/link";
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
    <div className="text-base font-semibold text-gray-900 wrap-break-words">
      {value || <span className="text-gray-400">N/A</span>}
    </div>
  </div>
);

// Helper to format currency
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "N/A";
  return `₦${price.toLocaleString()}`;
};

// Status Badge Helper
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
      className={`px-3 py-1 text-sm font-semibold rounded-full inline-block ${colorClasses}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};

export function PaymentDetailModal({
  paymentId,
  onClose,
}: PaymentDetailModalProps) {
  const { data: payment, isLoading, isError } = useGetPaymentDetails(paymentId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-10 h-64">
          <CustomLoader />
        </div>
      );
    }

    if (isError || !payment) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-10 text-red-600 h-64">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load payment details.</span>
        </div>
      );
    }

    // Logic for financial status color
    const isPaid = payment.paymentStatus === "SUCCESSFUL";
    const amountPaid = payment.amountPaid ?? 0;
    const isAmountMismatch = isPaid && amountPaid < payment.totalPayable;

    return (
      <div className="space-y-6 p-6 overflow-y-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Payment ID" value={payment.bookingRef} />
          <DetailItem 
            label="Booking ID" 
            value={
              <Link 
                href={`/dashboard/bookings/${payment.bookingId}`}
                className="text-gray-900 hover:text-gray-900 hover:underline transition-colors"
              >
                {payment.invoiceNumber}
              </Link>
            } 
          />
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
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

        {/* Financial Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem
            label="Total Payable"
            value={formatPrice(payment.totalPayable)}
          />
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

        {/* Dates Section */}
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

        <hr/>

        {/* Vehicle Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Vehicle Name" value={
              <Link 
                href={`/dashboard/vehicles-onboarding/${payment.vehicleId}`}
                className="text-gray-900 hover:text-gray-900 hover:underline transition-colors"
              >
                {payment.vehicleName}
              </Link>
            }  />
          <DetailItem
            label="Vehicle Identifier"
            value={payment.vehicleIdentifier}
          />
        </div>

        <hr/>

        {/* Customer Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem 
            label="Customer Name" 
            value={payment.userName} 
          />
          <DetailItem
            label="Customer Email"
            value={payment.userEmail}
          />
          <DetailItem label="Customer Phone Number" value={payment.userPhone} />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg md:max-w-xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-white shrink-0">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">
            Payment Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t shrink-0">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
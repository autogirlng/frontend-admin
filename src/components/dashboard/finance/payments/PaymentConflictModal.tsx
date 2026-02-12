"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  X,
  AlertTriangle,
  CalendarClock,
  ExternalLink,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Button from "@/components/generic/ui/Button";
import { useCheckBookingConflicts } from "@/lib/hooks/finance/useFinanceBookings";
import { Payment } from "../types";

interface PaymentConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  payment: Payment;
}

export function PaymentConflictModal({
  isOpen,
  onClose,
  onProceed,
  payment,
}: PaymentConflictModalProps) {
  const {
    data: conflicts = [],
    isLoading,
    isError,
  } = useCheckBookingConflicts(isOpen ? payment.bookingId : null);

  const hasProceeded = useRef(false);

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      conflicts.length === 0 &&
      !hasProceeded.current
    ) {
      hasProceeded.current = true;
      onProceed();
    }
  }, [isLoading, isError, conflicts, onProceed]);

  if (!isOpen) return null;

  const hasConflicts = conflicts.length > 0;

  if (isLoading || (!hasConflicts && !isError)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white p-8 flex flex-col items-center justify-center gap-4 min-w-[300px]">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            Verifying schedule availability...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-100">
              <CalendarClock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Schedule Conflict
              </h3>
              <p className="text-xs text-gray-500">Booking overlaps detected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-800 text-sm">
                Warning: {conflicts.length} Conflict
                {conflicts.length > 1 ? "s" : ""} Found
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                Approving this payment means the vehicle is booked for this time
                slot. Please review below.
              </p>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {conflicts.map((conflict) => (
              <Link
                key={conflict.bookingId}
                href={`/dashboard/bookings/${conflict.bookingId}`}
                target="_blank"
                className="flex flex-col p-3 border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer relative"
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                    {conflict.invoiceNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      conflict.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {conflict.status}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {conflict.customerName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" />
                      {format(
                        new Date(conflict.earliestStart),
                        "MMM d, HH:mm",
                      )}{" "}
                      - {format(new Date(conflict.latestEnd), "HH:mm")}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {conflict.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-[170px] py-2 text-xs px-3"
          >
            Cancel Approval
          </Button>

          <Button
            variant="danger"
            onClick={onProceed}
            className="w-[150px] py-2 text-xs px-3 flex items-center justify-center gap-1"
          >
            Ignore & Approve Anyway
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

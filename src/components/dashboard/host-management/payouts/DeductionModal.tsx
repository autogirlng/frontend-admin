"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import Button from "@/components/generic/ui/Button";
import Select, { Option } from "@/components/generic/ui/Select";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import TextInput from "@/components/generic/ui/TextInput";
import type { DeductionPayload, DeductionType } from "@/lib/types/deductions";
import { formatPrice } from "@/lib/utils/price-format";

import type { PayoutBooking } from "./types";

const deductionTypeOptions: Option[] = [
  { id: "LATE_CANCELLATION", name: "Late Cancellation" },
  { id: "POLICY_VIOLATION", name: "Policy Violation" },
  { id: "DAMAGE_CLAIM", name: "Damage Claim" },
  { id: "CHARGEBACK", name: "Chargeback" },
  { id: "TAX_ADJUSTMENT", name: "Tax Adjustment" },
  { id: "OTHER", name: "Other" },
];

interface DeductionModalProps {
  hostId: string;
  booking: PayoutBooking;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (payload: DeductionPayload) => void;
}

export function DeductionModal({
  hostId,
  booking,
  isLoading,
  onClose,
  onDelete,
  onSubmit,
}: DeductionModalProps) {
  const initialType = useMemo(
    () =>
      deductionTypeOptions.find((option) => option.id === booking.deductionType) ??
      deductionTypeOptions[0],
    [booking.deductionType],
  );
  const [amount, setAmount] = useState(
    booking.adminDeduction > 0 ? String(booking.adminDeduction) : "",
  );
  const [type, setType] = useState<Option>(initialType);
  const [notes, setNotes] = useState(booking.deductionNotes ?? "");
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(booking.deductionId);

  useEffect(() => {
    setAmount(booking.adminDeduction > 0 ? String(booking.adminDeduction) : "");
    setType(initialType);
    setNotes(booking.deductionNotes ?? "");
    setError(null);
  }, [booking, initialType]);

  const handleSubmit = () => {
    const normalizedAmount = Number(amount);

    if (!hostId || !booking.bookingId) {
      setError("Missing host or booking information for this deduction.");
      return;
    }

    if (!type?.id) {
      setError("Select a deduction type.");
      return;
    }

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setError("Enter a deduction amount greater than zero.");
      return;
    }

    setError(null);
    onSubmit({
      hostId,
      bookingId: booking.bookingId,
      type: type.id as DeductionType,
      amount: normalizedAmount,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white p-4 shadow-xl sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
          aria-label="Close deduction modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-8">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            {isEditing ? "Update Deduction" : "Create Deduction"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {booking.invoiceNumber} - current deduction{" "}
            <span className="font-semibold text-gray-900">
              {formatPrice(booking.adminDeduction || 0)}
            </span>
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <TextInput
            id="deduction-amount"
            label="Amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter deduction amount"
          />
          <Select
            label="Deduction Type"
            options={deductionTypeOptions}
            selected={type}
            onChange={setType}
            placeholder="Select deduction type"
          />
          <TextAreaInput
            id="deduction-notes"
            label="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add deduction notes..."
            rows={4}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="danger"
                onClick={onDelete}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-[160px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full sm:w-[180px]"
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

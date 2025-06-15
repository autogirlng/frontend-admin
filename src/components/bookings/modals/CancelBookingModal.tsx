import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import BookingModalLayout from "./BookingModalLayout";
import { ModalHeader } from "./ModalHeader";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onConfirm?: (data: CancelBookingData) => void;
}

interface CancelBookingData {
  reason: string;
  cancelledBy: "Admin" | "Host" | "Customer";
  document?: File;
}

const cancellationReasons = [
  "Customer Request",
  "Host Unavailable",
  "Vehicle Issues",
  "Payment Issues",
  "Other",
];

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [cancelledBy, setCancelledBy] = useState<"Admin" | "Host" | "Customer">("Admin");
  const [document, setDocument] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm?.({
      reason,
      cancelledBy,
      document: document || undefined,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  return (
    <BookingModalLayout isOpen={isOpen}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <ModalHeader 
          LucideIcon={X}
          iconColor="#F83B3B"
          iconBackgroundColor="#FEE2E2"
          headerText="Cancel Booking"
          modalContent="Please provide the reason for cancellation"
        />
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Cancellation
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              {cancellationReasons.map((r) => (
                <option key={r} value={r.toLowerCase().replace(" ", "_")}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter any additional details..."
            />
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <button
              type="submit"
              disabled={!reason}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Cancellation
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </BookingModalLayout>
  );
}; 
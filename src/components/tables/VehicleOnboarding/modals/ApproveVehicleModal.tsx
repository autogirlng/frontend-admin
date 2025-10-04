"use client";

import { useState } from "react";
import { VehicleOnboardingTable } from "@/utils/types";
import { CheckCircle, X } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";
import TextArea from "@/components/shared/textarea";

interface ApproveVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleOnboardingTable | null;
  onApprove: (vehicleId: string, reason?: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function ApproveVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onApprove,
  isLoading = false,
}: ApproveVehicleModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen || !vehicle) return null;

  const handleApprove = async () => {
    const success = await onApprove(vehicle.vehicleId, reason);
    if (success) {
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-grey-200 w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-grey-400 hover:text-grey-600"
          aria-label="Close modal"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-grey-900">Approve Vehicle</h3>
          <p className="text-grey-600 text-sm">
            Are you sure you want to approve this vehicle?
          </p>
          
          <div className="w-full text-left">
            <p className="text-sm font-medium text-grey-700 mb-2">Vehicle Details:</p>
            <div className="bg-grey-50 rounded-lg p-3 space-y-1 text-sm">
              <p><span className="font-medium">ID:</span> {vehicle.vehicleId}</p>
              <p><span className="font-medium">Make & Model:</span> {vehicle.makeAndModel}</p>
              <p><span className="font-medium">Host:</span> {vehicle.host}</p>
              <p><span className="font-medium">Location:</span> {vehicle.location}</p>
            </div>
          </div>

          <div className="w-full">
            <TextArea
              id="reason"
              name="reason"
              label="Approval Reason (Optional)"
              placeholder="Enter approval reason..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              disabled={isLoading}
              variant="outlined"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg text-grey-600 bg-grey-100 hover:bg-grey-200 transition-colors text-sm font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="px-6 py-2 flex items-center space-x-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading && <Spinner  />}
            <span>Approve Vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
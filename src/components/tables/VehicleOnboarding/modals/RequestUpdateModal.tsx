"use client";

import { useState } from "react";
import { VehicleOnboardingTable } from "@/utils/types";
import { MessageSquare, X } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";
import TextArea from "@/components/shared/textarea";

interface RequestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleOnboardingTable | null;
  onRequestUpdate: (vehicleId: string, message: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function RequestUpdateModal({
  isOpen,
  onClose,
  vehicle,
  onRequestUpdate,
  isLoading = false,
}: RequestUpdateModalProps) {
  const [message, setMessage] = useState("");

  if (!isOpen || !vehicle) return null;

  const handleRequestUpdate = async () => {
    if (!message.trim()) {
      return;
    }
    const success = await onRequestUpdate(vehicle.vehicleId, message);
    if (success) {
      setMessage("");
    }
  };

  const handleClose = () => {
    setMessage("");
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
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-grey-900">Request Update</h3>
          <p className="text-grey-600 text-sm">
            Send a message to the host requesting additional information or updates.
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
              id="message"
              name="message"
              label="Message to Host"
              placeholder="Please provide details about what information or updates you need..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              disabled={isLoading}
              variant="outlined"
              required
              error={!message.trim() ? "Message is required" : undefined}
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
            onClick={handleRequestUpdate}
            className="px-6 py-2 flex items-center space-x-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !message.trim()}
          >
            {isLoading && <Spinner/>}
            <span>Send Request</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
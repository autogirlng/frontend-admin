"use client";

import { useState } from "react";
import { VehicleOnboardingTable } from "@/utils/types";
import { CheckCircle, XCircle, MessageSquare, X, ChevronUp } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";

interface MobileActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleOnboardingTable | null;
  actionType: 'approve' | 'reject' | 'requestUpdate' | null;
  onApprove: (vehicleId: string, reason?: string) => Promise<boolean>;
  onReject: (vehicleId: string, reason: string) => Promise<boolean>;
  onRequestUpdate: (vehicleId: string, message: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function MobileActionModal({
  isOpen,
  onClose,
  vehicle,
  actionType,
  onApprove,
  onReject,
  onRequestUpdate,
  isLoading = false,
}: MobileActionModalProps) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen || !vehicle || !actionType) return null;

  const handleAction = async () => {
    let success = false;
    
    switch (actionType) {
      case 'approve':
        success = await onApprove(vehicle.vehicleId, reason);
        if (success) setReason("");
        break;
      case 'reject':
        if (!reason.trim()) return;
        success = await onReject(vehicle.vehicleId, reason);
        if (success) setReason("");
        break;
      case 'requestUpdate':
        if (!message.trim()) return;
        success = await onRequestUpdate(vehicle.vehicleId, message);
        if (success) setMessage("");
        break;
    }
  };

  const handleClose = () => {
    setReason("");
    setMessage("");
    onClose();
  };

  const getModalConfig = () => {
    switch (actionType) {
      case 'approve':
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          iconBg: "bg-green-100 text-green-600",
          title: "Approve Vehicle",
          description: "Are you sure you want to approve this vehicle?",
          buttonText: "Approve Vehicle",
          buttonClass: "bg-green-600 hover:bg-green-700",
          placeholder: "Enter approval reason (optional)...",
          value: reason,
          onChange: setReason,
          required: false,
        };
      case 'reject':
        return {
          icon: <XCircle className="w-8 h-8" />,
          iconBg: "bg-red-100 text-red-600",
          title: "Reject Vehicle",
          description: "Are you sure you want to reject this vehicle?",
          buttonText: "Reject Vehicle",
          buttonClass: "bg-red-600 hover:bg-red-700",
          placeholder: "Please provide a reason for rejection...",
          value: reason,
          onChange: setReason,
          required: true,
        };
      case 'requestUpdate':
        return {
          icon: <MessageSquare className="w-8 h-8" />,
          iconBg: "bg-blue-100 text-blue-600",
          title: "Request Update",
          description: "Send a message to the host requesting additional information or updates.",
          buttonText: "Send Request",
          buttonClass: "bg-blue-600 hover:bg-blue-700",
          placeholder: "Please provide details about what information or updates you need...",
          value: message,
          onChange: setMessage,
          required: true,
        };
      default:
        return null;
    }
  };

  const config = getModalConfig();
  if (!config) return null;

  const isFormValid = actionType === 'approve' || (actionType === 'reject' && reason.trim()) || (actionType === 'requestUpdate' && message.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl border border-grey-200 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Mobile drag indicator */}
        <div className="flex justify-center pt-3 pb-2 sm:hidden">
          <div className="w-12 h-1 bg-grey-300 rounded-full"></div>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-grey-400 hover:text-grey-600"
          aria-label="Close modal"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center justify-center text-center space-y-4 p-6">
          <div className={`p-3 rounded-full ${config.iconBg}`}>
            {config.icon}
          </div>
          <h3 className="text-xl font-semibold text-grey-900">{config.title}</h3>
          <p className="text-grey-600 text-sm">{config.description}</p>
          
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
            <label htmlFor="input" className="block text-sm font-medium text-grey-700 mb-2">
              {actionType === 'approve' ? 'Approval Reason (Optional)' : 
               actionType === 'reject' ? 'Rejection Reason' : 'Message to Host'}
              {config.required && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              id="input"
              value={config.value}
              onChange={(e) => config.onChange(e.target.value)}
              placeholder={config.placeholder}
              className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={actionType === 'requestUpdate' ? 5 : 4}
              disabled={isLoading}
              required={config.required}
            />
            {config.required && !config.value.trim() && (
              <p className="text-red-500 text-xs mt-1">
                {actionType === 'reject' ? 'Rejection reason is required' : 'Message is required'}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-center space-x-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg text-grey-600 bg-grey-100 hover:bg-grey-200 transition-colors text-sm font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className={`px-6 py-2 flex items-center space-x-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonClass}`}
            disabled={isLoading || !isFormValid}
          >
            {isLoading && <Spinner  />}
            <span>{config.buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
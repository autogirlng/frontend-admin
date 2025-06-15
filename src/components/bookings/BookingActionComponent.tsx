"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { BookingBadgeStatus } from "@/utils/types";
import { AddressModal } from "./modals/AddressModal";
import { ConfirmTripModal } from "./modals/ConfirmTripModal";
import { CancelTripModal } from "./modals/CancelTripModal";
import { EndTripModal } from "./modals/EndTripModal";
import { UpdateTripModal } from "./modals/UpdateTripModal";

interface BookingActionComponentProps {
  bookingStatus: BookingBadgeStatus;
  pickupLocation?: string;
}

const BookingActionComponent: React.FC<BookingActionComponentProps> = ({ 
  bookingStatus,
  pickupLocation = "No pickup location available"
}) => {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [isCancelTripModalOpen, setIsCancelTripModalOpen] = useState(false);
  const [isEndTripModalOpen, setIsEndTripModalOpen] = useState(false);
  const [isUpdateTripModalOpen, setIsUpdateTripModalOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setIsActionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionRef]);

  const getActions = () => {
    const commonActions = [
      { name: "View Details", action: "view_details" },
      { name: "Contact Customer", action: "contact_customer" },
      { name: "View Address", action: "view_address" },
    ];

    switch (bookingStatus) {
      case BookingBadgeStatus.APPROVED:
        return [
          ...commonActions,
          { name: "Assign Driver", action: "assign_driver" },
          { name: "Download Receipt", action: "download_receipt" },
          { name: "Add Trip Notes", action: "add_trip_notes" },
          { name: "Initiate Cancellation", action: "initiate_cancellation" },
          { name: "Update Trip", action: "update_trip" },
          { name: "End Trip", action: "end_trip" },
        ];
      case BookingBadgeStatus.PENDING:
        return [
          ...commonActions,
          { name: "Approve Booking", action: "approve_booking" },
          { name: "Reject Booking", action: "reject_booking" },
          { name: "Escalate", action: "escalate" },
        ];
      case BookingBadgeStatus.CANCELLED:
        return [
          ...commonActions,
          { name: "Archive", action: "archive" },
          { name: "Process Refund", action: "process_refund" },
        ];
      case BookingBadgeStatus.COMPLETED:
        return [
          ...commonActions,
          { name: "Download Receipt", action: "download_receipt" },
          { name: "Add Trip Notes", action: "add_trip_notes" },
          { name: "Archive", action: "archive" },
        ];
      default:
        return commonActions;
    }
  };

  const handleAction = (action: string) => {
    setIsActionOpen(false);
    
    switch (action) {
      case "view_address":
        setIsAddressModalOpen(true);
        break;
      case "approve_booking":
        setIsConfirmTripModalOpen(true);
        break;
      case "initiate_cancellation":
      case "reject_booking":
        setIsCancelTripModalOpen(true);
        break;
      case "end_trip":
        setIsEndTripModalOpen(true);
        break;
      case "update_trip":
        setIsUpdateTripModalOpen(true);
        break;
      default:
        console.log(`Action: ${action} for booking with status: ${bookingStatus}`);
    }
  };

  return (
    <div className="relative" ref={actionRef}>
      <button
        className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-100 rounded-full p-2"
        onClick={() => setIsActionOpen(!isActionOpen)}
        aria-expanded={isActionOpen}
        aria-controls="booking-action-dropdown"
      >
        <MoreVertical size={16} />
      </button>

      {isActionOpen && (
        <div
          id="booking-action-dropdown"
          className="absolute z-10 mt-2 w-60 bg-white rounded-[10%] shadow-lg border border-[#dbdfe5] overflow-hidden"
          style={{ top: "calc(100% + 5px)", right: 0 }}
        >
          <div className="p-5">
            <div className="">
              <div className="flex flex-col items-start">
                <h4 className="text-base font-medium mb-1 text-gray-800">Actions</h4>
                {getActions().map((action, index) => (
                  <p
                    key={index}
                    className="my-2 w-full cursor-pointer py-2 rounded hover:bg-[#e0e4e9] text-sm text-start text-gray-700 transition-colors"
                    onClick={() => handleAction(action.action)}
                  >
                    {action.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddressModal 
        isOpen={isAddressModalOpen} 
        modalContent={pickupLocation}
        closeModal={() => setIsAddressModalOpen(false)}
      />
      
      <ConfirmTripModal 
        isOpen={isConfirmTripModalOpen}
        setIsOpen={setIsConfirmTripModalOpen}
      />
      
      <CancelTripModal 
        isOpen={isCancelTripModalOpen}
        setIsOpen={setIsCancelTripModalOpen}
      />
      
      <EndTripModal 
        isOpen={isEndTripModalOpen}
        setIsOpen={setIsEndTripModalOpen}
      />
      
      <UpdateTripModal 
        isOpen={isUpdateTripModalOpen}
        setIsOpen={setIsUpdateTripModalOpen}
      />
    </div>
  );
};

export default BookingActionComponent; 
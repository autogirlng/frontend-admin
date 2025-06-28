"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, AlertTriangle, User, X, Info, AlertCircle } from "lucide-react";
import { BookingBadgeStatus } from "@/utils/types";
import { AddressModal } from "./modals/AddressModal";
import { ConfirmTripModal } from "./modals/ConfirmTripModal";
import { CancelTripModal } from "./modals/CancelTripModal";
import { EndTripModal } from "./modals/EndTripModal";
import { UpdateTripModal } from "./modals/UpdateTripModal";
import { CancelBookingModal } from "./modals/CancelBookingModal";
import { FlagAbuseModal } from "./modals/FlagAbuseModal";
import { RequestInfoModal } from "./modals/RequestInfoModal";
import { CustomerDetailsModal } from "./modals/CustomerDetailsModal";
import BookingModalLayout from "./modals/BookingModalLayout";
import { ModalHeader } from "./modals/ModalHeader";
import { useHttp } from "@/utils/useHttp";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface BookingActionComponentProps {
  bookingStatus: BookingBadgeStatus;
  pickupLocation: string;
  bookingId: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
    memberSince: string;
    bookingHistory: {
      vehicle: string;
      date: string;
      status: string;
    }[];
  };
}

const BookingActionComponent: React.FC<BookingActionComponentProps> = ({ 
  bookingStatus,
  pickupLocation = "No pickup location available",
  bookingId,
  customer
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCancelBookingModalOpen, setIsCancelBookingModalOpen] = useState(false);
  const [isFlagAbuseModalOpen, setIsFlagAbuseModalOpen] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const actionRef = useRef<HTMLDivElement>(null);
  const http = useHttp();
  const router = useRouter();

  // Modal states
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [isCancelTripModalOpen, setIsCancelTripModalOpen] = useState(false);
  const [isEndTripModalOpen, setIsEndTripModalOpen] = useState(false);
  const [isUpdateTripModalOpen, setIsUpdateTripModalOpen] = useState(false);

  // Add state for selected info
  const [selectedInfo, setSelectedInfo] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateBookingStatus = async (bookingId: string, newStatus: BookingBadgeStatus) => {
    try {
      const response = await http.put<{ message: string }>(`/bookings/updateStatus/${bookingId}`, {
        status: newStatus
      });

      if (response) {
        toast.success(response.message || `Booking status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update booking status');
    }
  };

  const handleStatusChange = async (newStatus: BookingBadgeStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setIsStatusChangeModalOpen(false);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const getActions = () => {
    const actions = [
      {
        name: "View Details",
        action: "view_details",
      },
      {
        name: "Change Status",
        action: "change_status",
      },
      // { name: "Flag Abuse", action: "flag_abuse" }, // Temporarily removed as per requirements
      {
        name: "View Customer Details",
        action: "view_customer",
      },
    ];

    if (bookingStatus === BookingBadgeStatus.PENDING) {
      actions.push({
        name: "Cancel Booking",
        action: "cancel_booking",
      });
    }

    return actions;
  };

  const handleAction = (action: string) => {
    setIsDropdownOpen(false);
    
    if (action === "view_details") {
      if (bookingId) {
        router.push(`/dashboard/bookings/${bookingId}`);
      }
      return;
    }
    
    switch (action) {
      case "view_address":
        setIsAddressModalOpen(true);
        setModalContent("pickup");
        break;
      case "change_status":
        setIsStatusChangeModalOpen(true);
        break;
      case "flag_abuse":
        setIsFlagAbuseModalOpen(true);
        break;
      case "request_info":
        setIsRequestInfoModalOpen(true);
        break;
      case "view_customer":
        if (customer) {
          router.push(`/customer/${customer.name.replace(/\s+/g, '-').toLowerCase()}`);
        }
        break;
      case "cancel_booking":
        setIsCancelBookingModalOpen(true);
        break;
    }
  };

  return (
    <div className="relative" ref={actionRef}>
      <button
        className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-100 rounded-full p-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-controls="booking-action-dropdown"
      >
        <MoreVertical size={16} />
      </button>

      {isDropdownOpen && (
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
                    className="my-2 w-full cursor-pointer py-2 rounded text-sm text-start text-gray-700 transition-colors hover:text-blue-600"
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

      <AddressModal 
        isOpen={isAddressModalOpen} 
        modalContent={modalContent}
        closeModal={() => setIsAddressModalOpen(false)}
      />
      
      <CancelBookingModal
        isOpen={isCancelBookingModalOpen}
        onClose={() => setIsCancelBookingModalOpen(false)}
        bookingId={bookingId}
      />

      <FlagAbuseModal
        isOpen={isFlagAbuseModalOpen}
        onClose={() => setIsFlagAbuseModalOpen(false)}
        bookingId={bookingId}
      />

      <RequestInfoModal
        isOpen={isRequestInfoModalOpen}
        onClose={() => setIsRequestInfoModalOpen(false)}
        onConfirm={(info) => {
          setSelectedInfo(info);
          toast.success(`Requested additional information: ${info.join(", ")}`);
          setIsRequestInfoModalOpen(false);
        }}
      />

      <CustomerDetailsModal
        isOpen={isCustomerDetailsModalOpen}
        onClose={() => setIsCustomerDetailsModalOpen(false)}
        customer={customer || {
          name: '',
          phone: '',
          email: '',
          memberSince: '',
          bookingHistory: []
        }}
      />

      <BookingModalLayout isOpen={isStatusChangeModalOpen}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <ModalHeader 
            LucideIcon={AlertCircle}
            iconColor="#F3A218"
            iconBackgroundColor="#FEF3C7"
            headerText="Change Booking Status"
            modalContent="Select the new status for this booking"
          />
          
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.values(BookingBadgeStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsStatusChangeModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </BookingModalLayout>
    </div>
  );
};

export default BookingActionComponent; 
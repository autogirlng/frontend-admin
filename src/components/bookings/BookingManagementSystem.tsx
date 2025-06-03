"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Types
type BookingStatus =
  | "Ongoing"
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Cancelled"
  | "Completed"
  | "Unpaid";
type BookingChannelType = "Offline" | "Platform";

interface Booking {
  id: string;
  customerName: string;
  city: string;
  bookingType: string;
  noOfTrips: number;
  vehicle: string;
  startDate: string;
  status: BookingStatus;
  bookingChannel: BookingChannelType;
  price: string;
}

interface StatusBadgeProps {
  status: BookingStatus;
}

interface ActionMenuProps {
  status: BookingStatus;
  onAction: (action: string) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Mock data
const bookingsData: Booking[] = [
  {
    id: "BKG-1234-AB56",
    customerName: "Chioma Nwosu",
    city: "Lagos",
    bookingType: "Instant",
    noOfTrips: 1,
    vehicle: "Toyota Camry 2021",
    startDate: "Apr 12, 2023",
    status: "Ongoing",
    bookingChannel: "Offline",
    price: "NGN 100,000",
  },
  {
    id: "BKG-4567-GH12",
    customerName: "Oluwaseun Ojo",
    city: "Enugu",
    bookingType: "Instant",
    noOfTrips: 1,
    vehicle: "Honda Civic 2019",
    startDate: "Apr 12, 2023",
    status: "Approved",
    bookingChannel: "Platform",
    price: "",
  },
  {
    id: "BKG-4567-GH12",
    customerName: "Chukwuemeka Okeke",
    city: "Benin",
    bookingType: "Pick-up & drop-off",
    noOfTrips: 3,
    vehicle: "Mercedes-Benz C-Class",
    startDate: "Apr 11, 2023",
    status: "Pending",
    bookingChannel: "Offline",
    price: "",
  },
  {
    id: "BKG-5678-LJ34",
    customerName: "Chigozie Nnamani",
    city: "Benin",
    bookingType: "Long term",
    noOfTrips: 10,
    vehicle: "Subaru Outback",
    startDate: "Apr 11, 2023",
    status: "Approved",
    bookingChannel: "Platform",
    price: "",
  },
  {
    id: "BKG-8901-MN78",
    customerName: "Ezinne Chukwu",
    city: "Accra",
    bookingType: "Long term",
    noOfTrips: 12,
    vehicle: "Toyota Camry 2021",
    startDate: "Apr 10, 2023",
    status: "Approved",
    bookingChannel: "Platform",
    price: "",
  },
  {
    id: "BKG-0123-QR12",
    customerName: "Oluchi Eze",
    city: "Abuja",
    bookingType: "Instant",
    noOfTrips: 5,
    vehicle: "Mercedes-Benz E-Class",
    startDate: "Apr 09, 2023",
    status: "Rejected",
    bookingChannel: "Platform",
    price: "",
  },
  {
    id: "BKG-3456-EF90",
    customerName: "Chika Ibe",
    city: "Lagos",
    bookingType: "Instant",
    noOfTrips: 8,
    vehicle: "Toyota Camry 2021",
    startDate: "Apr 09, 2023",
    status: "Cancelled",
    bookingChannel: "Platform",
    price: "NGN 42,000",
  },
  {
    id: "BKG-4567-GH12",
    customerName: "Nnamdi Kalu",
    city: "Lagos",
    bookingType: "Pick-up & drop-off",
    noOfTrips: 3,
    vehicle: "Toyota Camry 2021",
    startDate: "Apr 08, 2023",
    status: "Completed",
    bookingChannel: "Offline",
    price: "NGN 65,000",
  },
  {
    id: "BKG-6789-KL56",
    customerName: "Obinna Anozie",
    city: "Benin",
    bookingType: "Instant",
    noOfTrips: 4,
    vehicle: "Toyota Camry 2021",
    startDate: "Apr 07, 2023",
    status: "Unpaid",
    bookingChannel: "Offline",
    price: "NGN 70,000",
  },
  {
    id: "BKG-3851-ZW76",
    customerName: "Adebayo Olatunji",
    city: "Accra",
    bookingType: "Instant",
    noOfTrips: 6,
    vehicle: "Mercedes-Benz C-Class",
    startDate: "Apr 06, 2023",
    status: "Pending",
    bookingChannel: "Platform",
    price: "NGN 50,000",
  },
];

// StatusBadge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Ongoing":
        return "bg-[#B6FCBF] text-[#0F581D]";
      case "Approved":
        return "bg-[#0AAF24] text-white";
      case "Pending":
        return "bg-[#F3A218] text-white";
      case "Rejected":
        return "bg-[#667185] text-white";
      case "Cancelled":
        return "bg-[#F83B3B] text-white";
      case "Completed":
        return "bg-[#0673FF] text-white";
      case "Unpaid":
        return "bg-[#101928] text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

// ActionMenu Component
const ActionMenu: React.FC<ActionMenuProps> = ({ status, onAction }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define different menu options based on status
  const getMenuOptions = () => {
    const commonOptions = [
      { name: "View Details", action: "view_details" },
      { name: "Contact Customer", action: "contact_customer" },
    ];

    switch (status) {
      case "Ongoing":
        return [
          ...commonOptions,
          { name: "Assign Driver", action: "assign_driver" },
          { name: "Download Receipt", action: "download_receipt" },
          { name: "Mark as Completed", action: "mark_completed" },
        ];
      case "Approved":
        return [
          ...commonOptions,
          { name: "Assign Driver", action: "assign_driver" },
          { name: "Download Receipt", action: "download_receipt" },
          { name: "Add Trip Notes", action: "add_trip_notes" },
          { name: "Initiate Cancellation", action: "initiate_cancellation" },
        ];
      case "Pending":
        return [
          ...commonOptions,
          { name: "Approve Booking", action: "approve_booking" },
          { name: "Reject Booking", action: "reject_booking" },
          { name: "Escalate", action: "escalate" },
        ];
      case "Rejected":
        return [
          ...commonOptions,
          { name: "Review Decision", action: "review_decision" },
          { name: "Archive", action: "archive" },
        ];
      case "Cancelled":
        return [
          ...commonOptions,
          { name: "Archive", action: "archive" },
          { name: "Process Refund", action: "process_refund" },
        ];
      case "Completed":
        return [
          ...commonOptions,
          { name: "Download Receipt", action: "download_receipt" },
          { name: "Add Trip Notes", action: "add_trip_notes" },
          { name: "Archive", action: "archive" },
        ];
      case "Unpaid":
        return [
          ...commonOptions,
          { name: "Send Payment Reminder", action: "send_payment_reminder" },
          { name: "Mark as Paid", action: "mark_as_paid" },
          { name: "Cancel Booking", action: "cancel_booking" },
        ];
      default:
        return commonOptions;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {getMenuOptions().map((option, index) => (
              <button
                key={index}
                onClick={() => handleAction(option.action)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                type="button"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// FilterComponent (simplified)
const FilterComponent: React.FC = () => {
  return (
    <button className="px-4 py-2 flex items-center gap-2 text-sm rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[#344054]">
      <Filter size={16} />
      Filter
    </button>
  );
};

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate an array of page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-6 space-x-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        type="button"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "border border-gray-300 hover:bg-gray-100"
          }`}
          type="button"
          aria-current={currentPage === page ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        type="button"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

// Main Component
const BookingManagementSystem = () => {
  const [currentPage, setCurrentPage] = useState<number>(1); // Set to page 3 to match the image
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(bookingsData.length / itemsPerPage);

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookingsData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAction = (action: string, bookingId: string) => {
    console.log(`Action: ${action} for booking: ${bookingId}`);
    // Implement action handling logic here
  };

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Booking Management System</h1>

        {/* Search and Filter Row */}
        <div className="flex justify-between mb-6 flex-wrap">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search with Booking ID, or Guest name"
              className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "14px" }}
            />
          </div>

          <FilterComponent />
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto"
          style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        >
          <table className="min-w-full">
            <thead>
              <tr
                className="bg-[#F7F9FC] border-b border-[#D0D5DD]"
                style={{ height: "60px" }}
              >
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No Of Trips
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Chnl
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking, index) => (
                  <tr
                    key={`${booking.id}-${index}`}
                    className={`border-b border-[#D0D5DD] hover:bg-gray-50 ${
                      index === currentBookings.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-[#344054]">
                      {booking.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.customerName}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.city}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.bookingType}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.noOfTrips}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.vehicle}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.startDate}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.bookingChannel}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.price}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ActionMenu
                        status={booking.status}
                        onAction={(action) => handleAction(action, booking.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagementSystem;

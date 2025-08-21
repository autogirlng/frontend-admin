"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MoreVertical,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useHttp } from "@/utils/useHttp";
import BookingActionComponent from "./BookingActionComponent";
import { BookingBadgeStatus } from "@/utils/types";
import FilterComponent from "./FilterComponent";
import { debounce } from "lodash";
import {
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  subDays,
  isWithinInterval,
  parseISO,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useBookingTable from "./hooks/useBookingTable";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/spinner";

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
  customerPhone?: string;
  customerEmail?: string;
  memberSince?: string;
  bookingHistory?: any[];
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

// Add this helper for status badge (copy from BookingsTable)
const renderBookingStatusBadge = (status: string) => {
  const statusStyles: Record<string, string> = {
    ACCEPTED: "bg-[#0AAF24] text-white",
    PENDING: "bg-[#F3A218] text-white",
    CANCELLED: "bg-[#F83B3B] text-white",
    APPROVED: "bg-[#0AAF24] text-white",
    COMPLETED: "bg-[#0673FF] text-white",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

// Helper to map UI period to allowed API timeFilter values
const mapPeriodToTimeFilter = (period: string) => {
  switch (period) {
    case "today":
      return "day";
    case "yesterday":
      return "yesterday";
    case "tomorrow":
      return "tomorrow";
    case "this_week":
      return "week";
    case "this_month":
      return "month";
    case "last_30_days":
      return "last_30_days";
    case "last_90_days":
      return "last_90_days";
    case "custom_range":
      return "custom";
    case "all_time":
      return "all";
    default:
      return "all";
  }
};
// Helper to map UI status to allowed API status values
const mapStatusToApiStatus = (status: string) => {
  const allowed = ["PENDING", "APPROVED", "CANCELLED", "COMPLETED"];
  return allowed.includes(status) ? status : undefined;
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
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        type="button"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md font-semibold text-base border transition-all duration-150
            ${
              page === currentPage
                ? "text-white border-blue-700 ring-2 ring-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
            }
          `}
          style={
            page === currentPage
              ? {
                  backgroundColor: "#2563eb",
                  borderColor: "#1d4ed8",
                  color: "#fff",
                }
              : {}
          }
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
        className="px-3 py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        type="button"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
};

// Main Component
const BookingManagementSystem = () => {
  console.log(
    "🎯 BookingManagementSystem - Component mounted at:",
    new Date().toISOString()
  );
  const http = useHttp();

  useEffect(() => {
    return () => {
      console.log(
        "🎯 BookingManagementSystem - Component unmounted at:",
        new Date().toISOString()
      );
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<string>("all_time");
  const [filterDateRange, setFilterDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Debounce search/filter state updates
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedFilterPeriod, setDebouncedFilterPeriod] =
    useState(filterPeriod);
  const [debouncedFilterDateRange, setDebouncedFilterDateRange] =
    useState(filterDateRange);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setDebouncedFilterPeriod(filterPeriod);
      setDebouncedFilterDateRange(filterDateRange);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, filterPeriod, filterDateRange]);

  const queryClient = useQueryClient();

  const bookingManagementParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    timeFilter: mapPeriodToTimeFilter(debouncedFilterPeriod),
    startDate: debouncedFilterDateRange.startDate
      ? debouncedFilterDateRange.startDate
      : undefined,
    endDate: debouncedFilterDateRange.endDate
      ? debouncedFilterDateRange.endDate
      : undefined,
    status: mapStatusToApiStatus(debouncedFilterPeriod) || null,
  };

  console.log(
    "🎯 BookingManagementSystem - Parameters:",
    bookingManagementParams
  );
  console.log("🎯 BookingManagementSystem - Debounced values:", {
    debouncedSearchTerm,
    debouncedFilterPeriod,
    debouncedFilterDateRange,
    mappedTimeFilter: mapPeriodToTimeFilter(debouncedFilterPeriod),
    mappedStatus: mapStatusToApiStatus(debouncedFilterPeriod) || null,
  });

  const queryResult = useBookingTable(bookingManagementParams);

  const data = queryResult.data as
    | import("./hooks/useBookingTable").BookingApiResponse
    | undefined;
  const bookings = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const isLoading = queryResult.isLoading;
  const isFetching = queryResult.isFetching;
  const error = queryResult.error;
  const isSuccess = queryResult.isSuccess;

  const queryKey = [
    "bookings",
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    mapPeriodToTimeFilter(debouncedFilterPeriod),
    debouncedFilterDateRange.startDate
      ? debouncedFilterDateRange.startDate.toISOString()
      : null,
    debouncedFilterDateRange.endDate
      ? debouncedFilterDateRange.endDate.toISOString()
      : null,
    mapStatusToApiStatus(debouncedFilterPeriod) || null,
  ];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/bookings/${id}`);
  };

  console.log("Bookings:", bookings);
  console.log("isLoading:", isLoading);
  console.log("isFetching:", isFetching);
  console.log("error:", error);
  console.log("Query params:", {
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    timeFilter: mapPeriodToTimeFilter(debouncedFilterPeriod),
    startDate: debouncedFilterDateRange.startDate,
    endDate: debouncedFilterDateRange.endDate,
    status: mapStatusToApiStatus(debouncedFilterPeriod) || null,
  });

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

        {/* Search and Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 gap-4 lg:gap-12 lg:px-2">
          <div className="relative w-full lg:max-w-xl lg:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search with Booking ID, or Guest name"
              className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-auto flex justify-end lg:flex-1">
            <div className="min-w-[220px] max-w-xs w-full lg:w-[260px]">
              <FilterComponent
                onFilterChange={(period, dateRange) => {
                  setFilterPeriod(period);
                  if (dateRange) setFilterDateRange(dateRange);
                }}
              />
            </div>
          </div>
        </div>

        {/* Responsive Table/Card View */}
        {/* Desktop: Full Table */}
        <div
          className="hidden lg:block overflow-x-auto"
          style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        >
          <table className="min-w-full">
            <thead>
              <tr
                className="bg-[#F7F9FC] border-b border-[#D0D5DD]"
                style={{ height: "60px" }}
              >
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
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
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {error ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-red-600"
                  >
                    {error.message}
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                <>
                  {bookings.map((booking: any, index: number) => (
                    <tr
                      key={`${booking.bookingId || booking.id}-${index}`}
                      className="border-b border-[#D0D5DD] hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.startDate
                          ? new Date(booking.startDate).toLocaleString()
                          : ""}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-[#344054]">
                        {booking.bookingId || booking.id}
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
                        {booking.duration ? `${booking.duration} hours` : ""}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.vehicle}
                      </td>
                      <td className="px-4 py-4">
                        {renderBookingStatusBadge(
                          booking.status || booking.bookingStatus
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.price
                          ? `NGN ${booking.price.toLocaleString()}`
                          : ""}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookingActionComponent
                          bookingStatus={
                            booking.status || booking.bookingStatus
                          }
                          pickupLocation={
                            booking.city || booking.pickupLocation
                          }
                          bookingId={booking.bookingId || booking.id}
                          customer={
                            booking.customer || {
                              name: booking.customerName || "",
                              phone: booking.customerPhone || "",
                              email: booking.customerEmail || "",
                              memberSince: booking.memberSince || "",
                              bookingHistory: booking.bookingHistory || [],
                            }
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : data && !isLoading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Tablet: Simplified Table */}
        <div className="hidden sm:block lg:hidden overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr
                className="bg-[#F7F9FC] border-b border-[#D0D5DD]"
                style={{ height: "60px" }}
              >
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {error ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-red-600"
                  >
                    {error.message}
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                <>
                  {bookings.map((booking: any, index: number) => (
                    <tr
                      key={`tablet-${booking.bookingId || booking.id}-${index}`}
                      className="border-b border-[#D0D5DD] hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.startDate
                          ? new Date(booking.startDate).toLocaleString()
                          : ""}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-[#344054]">
                        {booking.bookingId || booking.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.customerName}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.city}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.vehicle}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.startDate
                          ? new Date(booking.startDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-4 py-4">
                        {renderBookingStatusBadge(
                          booking.status || booking.bookingStatus
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">
                        {booking.price
                          ? `NGN ${booking.price.toLocaleString()}`
                          : ""}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookingActionComponent
                          bookingStatus={
                            booking.status || booking.bookingStatus
                          }
                          pickupLocation={
                            booking.city || booking.pickupLocation
                          }
                          bookingId={booking.bookingId || booking.id}
                          customer={
                            booking.customer || {
                              name: booking.customerName || "",
                              phone: booking.customerPhone || "",
                              email: booking.customerEmail || "",
                              memberSince: booking.memberSince || "",
                              bookingHistory: booking.bookingHistory || [],
                            }
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : data && !isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card View */}
        <div className="block sm:hidden">
          {error ? (
            <div className="flex justify-center py-8 text-red-600">
              {error.message}
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking: any, index: number) => (
              <div
                key={`mobile-${booking.bookingId || booking.id}-${index}`}
                className="border-b border-[#D0D5DD] p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs text-[#344054]">
                      {booking.startDate
                        ? new Date(booking.startDate).toLocaleString()
                        : ""}
                    </p>
                    <p className="font-medium text-sm text-[#344054] mt-1">
                      {booking.bookingId || booking.id}
                    </p>
                    <p className="text-sm text-[#344054]">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-[#344054]">{booking.city}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {renderBookingStatusBadge(
                      booking.status || booking.bookingStatus
                    )}
                    <p className="text-sm font-medium text-[#344054]">
                      {booking.price
                        ? `NGN ${booking.price.toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-[#344054]">
                    {booking.startDate
                      ? new Date(booking.startDate).toLocaleDateString()
                      : ""}{" "}
                    {booking.duration ? `• ${booking.duration} days` : ""}
                  </p>
                  <button
                    className="text-blue-600 flex items-center text-xs"
                    onClick={() =>
                      handleViewDetails(booking.bookingId || booking.id)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : data && !isLoading ? (
            <div className="flex justify-center py-8 text-gray-500">
              No bookings found.
            </div>
          ) : null}
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="flex items-center px-4 py-2 border rounded text-sm text-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <span className="mr-2">
              <ChevronLeft size={16} />
            </span>{" "}
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="flex items-center px-4 py-2 border rounded text-sm text-gray-700 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((p) => (currentPage < totalPages ? p + 1 : p))
            }
            disabled={currentPage >= totalPages}
          >
            Next{" "}
            <span className="ml-2">
              <ChevronRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingManagementSystem;

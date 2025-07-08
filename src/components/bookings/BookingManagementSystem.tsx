"use client";

import React, { useState, useRef, useEffect } from "react";
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
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-200 text-gray-700"}`}>
      {status}
    </span>
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
            ${page === currentPage
              ? "text-white border-blue-700 ring-2 ring-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"}
          `}
          style={page === currentPage ? { backgroundColor: '#2563eb', borderColor: '#1d4ed8', color: '#fff' } : {}}
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
  const http = useHttp();
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<string>("all_time");
  const [filterDateRange, setFilterDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: null, endDate: null });
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);

  const itemsPerPage = 12;

  // Move fetchBookings above debouncedFetchBookings
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let filterQuery = "";
      // Only send one filter: period or custom date
      if (filterPeriod === "custom" && filterDateRange.startDate && filterDateRange.endDate) {
        filterQuery += `&timeFilter=custom&startDate=${filterDateRange.startDate.toISOString()}&endDate=${filterDateRange.endDate.toISOString()}`;
      } else if (filterPeriod && filterPeriod !== "all_time") {
        filterQuery += `&timeFilter=${filterPeriod}`;
      }
      const response = await http.get<any>(
        `/admin/booking/list?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}${filterQuery}`
      );
      if (response && response.data) {
        setBookings(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setBookings([]);
        setTotalPages(1);
        setError("No data received");
      }
    } catch (err) {
      setError("Failed to fetch bookings");
      setBookings([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search/filter
  const debouncedFetchBookings = useRef(debounce(fetchBookings, 400)).current;

  useEffect(() => {
    // Responsive: track window width
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    debouncedFetchBookings();
    return () => {
      debouncedFetchBookings.cancel();
    };
  }, [searchTerm, filterPeriod, filterDateRange, currentPage]);

  // Frontend-side filtering for timestamp/start date
  useEffect(() => {
    if (!bookings || filterPeriod === "all_time") {
      setFilteredBookings(bookings);
      return;
    }
    let filtered = bookings;
    if (filterPeriod === "today") {
      filtered = bookings.filter(b => b.startDate && isToday(parseISO(b.startDate)));
    } else if (filterPeriod === "yesterday") {
      filtered = bookings.filter(b => b.startDate && isYesterday(parseISO(b.startDate)));
    } else if (filterPeriod === "tomorrow") {
      filtered = bookings.filter(b => b.startDate && isTomorrow(parseISO(b.startDate)));
    } else if (filterPeriod === "this_week") {
      filtered = bookings.filter(b => b.startDate && isThisWeek(parseISO(b.startDate), { weekStartsOn: 1 }));
    } else if (filterPeriod === "this_month") {
      filtered = bookings.filter(b => b.startDate && isThisMonth(parseISO(b.startDate)));
    } else if (filterPeriod === "last_30_days") {
      const now = new Date();
      const from = subDays(now, 30);
      filtered = bookings.filter(b => b.startDate && isAfter(parseISO(b.startDate), from) && isBefore(parseISO(b.startDate), now));
    } else if (filterPeriod === "last_90_days") {
      const now = new Date();
      const from = subDays(now, 90);
      filtered = bookings.filter(b => b.startDate && isAfter(parseISO(b.startDate), from) && isBefore(parseISO(b.startDate), now));
    } else if (filterPeriod === "custom" && filterDateRange.startDate && filterDateRange.endDate) {
      if (filterDateRange.startDate && filterDateRange.endDate) {
        filtered = bookings.filter(b => b.startDate && isWithinInterval(parseISO(b.startDate), {
          start: startOfDay(filterDateRange.startDate as Date),
          end: endOfDay(filterDateRange.endDate as Date)
        }));
      }
    }
    setFilteredBookings(filtered);
  }, [bookings, filterPeriod, filterDateRange]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row md:justify-between mb-6 flex-wrap gap-4">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search with Booking ID, or Guest name"
              className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <FilterComponent
              onFilterChange={(period, dateRange) => {
                setFilterPeriod(period);
                if (dateRange) setFilterDateRange(dateRange);
              }}
            />
          </div>
        </div>

        {/* Responsive Table/Card View */}
        {/* Desktop: Full Table */}
        <div className="hidden lg:block overflow-x-auto" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#D0D5DD]" style={{ height: "60px" }}>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">Loading bookings...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-red-600">{error}</td>
                </tr>
              ) : filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr
                    key={`${booking.bookingId || booking.id}-${index}`}
                    className="border-b border-[#D0D5DD] hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.startDate ? new Date(booking.startDate).toLocaleString() : ''}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[#344054]">{booking.bookingId || booking.id}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.customerName}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.city}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.bookingType}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.duration ? `${booking.duration} days` : ''}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.vehicle}</td>
                    <td className="px-4 py-4">{renderBookingStatusBadge(booking.status || booking.bookingStatus)}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.price ? `NGN ${booking.price.toLocaleString()}` : ''}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                      <BookingActionComponent
                        bookingStatus={booking.status || booking.bookingStatus}
                        pickupLocation={booking.city || booking.pickupLocation}
                        bookingId={booking.bookingId || booking.id}
                        customer={booking.customer || {
                          name: booking.customerName || '',
                          phone: booking.customerPhone || '',
                          email: booking.customerEmail || '',
                          memberSince: booking.memberSince || '',
                          bookingHistory: booking.bookingHistory || []
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tablet: Simplified Table */}
        <div className="hidden sm:block lg:hidden overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#D0D5DD]" style={{ height: "60px" }}>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">Loading bookings...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-red-600">{error}</td>
                </tr>
              ) : filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr
                    key={`tablet-${booking.bookingId || booking.id}-${index}`}
                    className="border-b border-[#D0D5DD] hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.startDate ? new Date(booking.startDate).toLocaleString() : ''}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[#344054]">{booking.bookingId || booking.id}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.customerName}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.city}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.vehicle}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.startDate ? new Date(booking.startDate).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-4">{renderBookingStatusBadge(booking.status || booking.bookingStatus)}</td>
                    <td className="px-4 py-4 text-sm text-[#344054]">{booking.price ? `NGN ${booking.price.toLocaleString()}` : ''}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                      <BookingActionComponent
                        bookingStatus={booking.status || booking.bookingStatus}
                        pickupLocation={booking.city || booking.pickupLocation}
                        bookingId={booking.bookingId || booking.id}
                        customer={booking.customer || {
                          name: booking.customerName || '',
                          phone: booking.customerPhone || '',
                          email: booking.customerEmail || '',
                          memberSince: booking.memberSince || '',
                          bookingHistory: booking.bookingHistory || []
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card View */}
        <div className="block sm:hidden">
          {isLoading ? (
            <div className="flex justify-center py-8 text-gray-500">Loading bookings...</div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-600">{error}</div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div key={`mobile-${booking.bookingId || booking.id}-${index}`} className="border-b border-[#D0D5DD] p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs text-[#344054]">{booking.startDate ? new Date(booking.startDate).toLocaleString() : ''}</p>
                    <p className="font-medium text-sm text-[#344054] mt-1">{booking.bookingId || booking.id}</p>
                    <p className="text-sm text-[#344054]">{booking.customerName}</p>
                    <p className="text-sm text-[#344054]">{booking.city}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {renderBookingStatusBadge(booking.status || booking.bookingStatus)}
                    <p className="text-sm font-medium text-[#344054]">{booking.price ? `NGN ${booking.price.toLocaleString()}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-[#344054]">
                    {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : ''} {booking.duration ? `• ${booking.duration} days` : ''}
                  </p>
                  <button
                    className="text-blue-600 flex items-center text-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-8 text-gray-500">No bookings found.</div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default BookingManagementSystem;

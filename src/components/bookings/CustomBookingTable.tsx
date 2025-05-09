"use client";

import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Define the booking data type
interface Booking {
  id: string;
  hostName: string;
  customerName: string;
  city: string;
  duration: string;
  vehicle: string;
  startDate: string;
  bookingType: string;
  status: "Accepted" | "Pending" | "Cancelled" | "Completed";
  price: string;
}

const BookingsTable: React.FC = () => {
  // State for responsive behavior
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTableScrollable, setIsTableScrollable] = useState(false);

  // Check window size on mount and resize
  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 768);

      // Check if table needs horizontal scroll indicator
      const tableContainer = document.getElementById("table-container");
      if (tableContainer) {
        setIsTableScrollable(
          tableContainer.scrollWidth > tableContainer.clientWidth
        );
      }
    };

    // Initial check
    checkWindowSize();

    // Listen for window resize
    window.addEventListener("resize", checkWindowSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  // Toggle expanded row for mobile view
  const toggleRowExpand = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  // Sample booking data to match the image
  const bookings: Booking[] = [
    {
      id: "BKG-1234-AB56",
      hostName: "Chioma Nwosu",
      customerName: "Chioma Nwosu",
      city: "Accra",
      duration: "1 day",
      vehicle: "Toyota Camry 2021",
      startDate: "Apr 12, 2023",
      bookingType: "Single Day",
      status: "Accepted",
      price: "NGN 100,000",
    },
    {
      id: "BKG-4567-GH12",
      hostName: "Oluwaseun Ojo",
      customerName: "Oluwaseun Ojo",
      city: "Lagos",
      duration: "1 day",
      vehicle: "Honda Civic 2019",
      startDate: "Apr 12, 2023",
      bookingType: "Multi Day",
      status: "Accepted",
      price: "NGN 42,000",
    },
    {
      id: "BKG-4567-GH12",
      hostName: "Chukwuemeka Okeke",
      customerName: "Chukwuemeka Okeke",
      city: "Enugu",
      duration: "3 days",
      vehicle: "Mercedes-Benz...",
      startDate: "Apr 11, 2023",
      bookingType: "Multi Day",
      status: "Pending",
      price: "NGN 20,000",
    },
    {
      id: "BKG-4567-GH12",
      hostName: "Chukwuemeka Okeke",
      customerName: "Chukwuemeka Okeke",
      city: "Enugu",
      duration: "3 days",
      vehicle: "Mercedes-Benz...",
      startDate: "Apr 11, 2023",
      bookingType: "Multi Day",
      status: "Pending",
      price: "NGN 20,000",
    },
    {
      id: "BKG-4567-GH12",
      hostName: "Chukwuemeka Okeke",
      customerName: "Chukwuemeka Okeke",
      city: "Enugu",
      duration: "3 days",
      vehicle: "Mercedes-Benz...",
      startDate: "Apr 11, 2023",
      bookingType: "Multi Day",
      status: "Pending",
      price: "NGN 20,000",
    },
    {
      id: "BKG-4567-GH12",
      hostName: "Chukwuemeka Okeke",
      customerName: "Chukwuemeka Okeke",
      city: "Enugu",
      duration: "3 days",
      vehicle: "Mercedes-Benz...",
      startDate: "Apr 11, 2023",
      bookingType: "Multi Day",
      status: "Pending",
      price: "NGN 20,000",
    },
    {
      id: "BKG-4567-GH12",
      hostName: "Chukwuemeka Okeke",
      customerName: "Chukwuemeka Okeke",
      city: "Enugu",
      duration: "3 days",
      vehicle: "Mercedes-Benz...",
      startDate: "Apr 11, 2023",
      bookingType: "Multi Day",
      status: "Pending",
      price: "NGN 20,000",
    },
  ];

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Function to render the status badge with appropriate color
  const renderStatusBadge = (status: Booking["status"]) => {
    const statusStyles = {
      Accepted: "bg-[#0AAF24] text-white",
      Pending: "bg-[#F3A218] text-white",
      Cancelled: "bg-[#F83B3B] text-white",
      Completed: "bg-[#0673FF] text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6">
        <h2 className="text-xl font-medium text-[#344054] mb-4 sm:mb-0">
          Bookings
        </h2>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>

          {/* View All Link */}
          <a
            href="#"
            className="text-[#667185] hover:text-blue-700 text-sm self-end sm:self-center"
          >
            View All
          </a>
        </div>
      </div>

      {/* Horizontal scroll hint - only shows when table is scrollable on medium screens */}
      {isTableScrollable && !isMobile && (
        <div className="hidden sm:flex md:hidden justify-center items-center text-xs text-gray-500 pb-2">
          <div className="flex items-center space-x-1">
            <ArrowLeft size={12} />
            <span>Scroll to see more</span>
            <ArrowRight size={12} />
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div
        id="table-container"
        className="hidden md:block overflow-x-auto"
        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      >
        <table className="min-w-full">
          <thead>
            <tr
              className="bg-[#F7F9FC] border-b border-gray-200"
              style={{ height: "60px" }}
            >
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Host Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Type
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr
                key={`${booking.id}-${index}`}
                className={`border-b border-gray-200 hover:bg-gray-50 ${
                  index === currentBookings.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.hostName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.customerName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.city}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.duration}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.vehicle}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.startDate}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.bookingType}
                </td>
                <td className="px-4 py-4">
                  {renderStatusBadge(booking.status)}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {booking.price}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2"
                    aria-label="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet View - Simplified table with horizontal scroll */}
      <div className="hidden sm:block md:hidden overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#F7F9FC] border-b border-gray-200">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr
                key={`tablet-${booking.id}-${index}`}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.customerName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.city}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.vehicle}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {booking.startDate}
                </td>
                <td className="px-4 py-4">
                  {renderStatusBadge(booking.status)}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {booking.price}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2"
                    aria-label="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden">
        {currentBookings.map((booking, index) => (
          <div
            key={`mobile-${booking.id}-${index}`}
            className="border-b border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {booking.id}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {booking.customerName}
                </p>
                <p className="text-sm text-gray-500">{booking.city}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {renderStatusBadge(booking.status)}
                <p className="text-sm font-medium text-gray-900">
                  {booking.price}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-gray-500">
                {booking.startDate} • {booking.duration}
              </p>
              <button
                onClick={() => toggleRowExpand(index)}
                className="text-blue-600 flex items-center text-xs"
                aria-expanded={expandedRows.includes(index)}
                aria-controls={`details-${index}`}
              >
                {expandedRows.includes(index) ? (
                  <>
                    Less details <ChevronUp size={14} className="ml-1" />
                  </>
                ) : (
                  <>
                    More details <ChevronDown size={14} className="ml-1" />
                  </>
                )}
              </button>
            </div>

            {expandedRows.includes(index) && (
              <div
                id={`details-${index}`}
                className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm"
              >
                <div>
                  <p className="text-gray-500 text-xs">Host</p>
                  <p className="text-gray-700">{booking.hostName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Vehicle</p>
                  <p className="text-gray-700">{booking.vehicle}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Booking Type</p>
                  <p className="text-gray-700">{booking.bookingType}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2"
                    aria-label="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredBookings.length > 0 && (
        <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500 mb-3 sm:mb-0">
            <span>
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
              {filteredBookings.length} entries
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
              aria-label="Previous page"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Display page numbers - dynamic based on total pages */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
              aria-label="Next page"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {filteredBookings.length === 0 && (
        <div className="py-8 px-4 text-center">
          <p className="text-gray-500">
            No bookings found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;

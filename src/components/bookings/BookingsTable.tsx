"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoveDiagonal
} from "lucide-react";
import FilterComponent from "./FilterComponent";
import ActionComponent from "./ActionComponent";
import { AddressModal } from "./modals/AddressModal";
import { Booking } from "@/utils/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const BookingsTable: React.FC = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/booking/list?page=${currentPage}&limit=10&status=APPROVED&search=${searchTerm}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        }
      );
      
      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data.data);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // Set empty array on error
      if (error instanceof Error && error.message.includes('401')) {
        toast.error("Please login to continue");
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchTerm]);

  // Function to render the booking status badge with appropriate color
  const renderBookingStatusBadge = (status: Booking["bookingStatus"]) => {
    const statusStyles = {
      Paid: "bg-[#0AAF24] text-white",
      Unpaid: "bg-[#101928] text-white",
      Pending: "bg-[#F3A218] text-white",
      Completed: "bg-[#0673FF] text-white",
      Rejected: "bg-[#667185] text-white",
      Cancelled: "bg-[#F83B3B] text-white",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  // Function to render the trip status badge with appropriate color
  const renderTripStatusBadge = (status: Booking["tripStatus"]) => {
    const statusStyles = {
      Unconfirmed: "bg-[#667185] text-white",
      Confirmed: "bg-[#0AAF24] text-white",
      Ongoing: "bg-[#B6FCBF] text-[#0F581D]",
      "Extra Time": "bg-[#F3A218] text-white",
      Cancelled: "bg-[#F83B3B] text-white",
      Completed: "bg-[#0673FF] text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  const openModal = (content: string) => {
    setIsOpen(true);
    setModalContent(content);
  }

  const closeModal = () => {
    setIsOpen(false);
    setModalContent("");
  }

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6">Bookings</h1>

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <FilterComponent />
        </div>

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
                  Pickup Location
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : !bookings ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center">
                    Error loading bookings
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr
                    key={`${booking.id}-${index}`}
                    className={`border-b border-[#D0D5DD] hover:bg-gray-50 ${
                      index === bookings.length - 1 ? "border-b-0" : ""
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
                    <td className="px-4 py-4 text-sm text-[#344054] cursor-pointer">
                      <div className="group relative inline-block" onClick={() => openModal(booking.pickupLocation)}>
                        {booking.pickupLocation}
                        <span className="absolute -top-5 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-[#e4e7ec] p-1 rounded">
                          <MoveDiagonal
                            className="h-4 w-4 text-gray-500"
                            color="#2584ff"
                          />
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#344054]">
                      {booking.vehicle}
                    </td>
                    <td className="px-4 py-4">
                      {renderBookingStatusBadge(booking.bookingStatus)}
                    </td>
                    <td className="px-4 py-4">
                      {renderTripStatusBadge(booking.tripStatus)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ActionComponent actionOption={booking.tripStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddressModal isOpen={isOpen} modalContent={modalContent} closeModal={closeModal} />

        <div className="flex justify-center mt-6 space-x-1">
          <button 
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-md ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button 
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;

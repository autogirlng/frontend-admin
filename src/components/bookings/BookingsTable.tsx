"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import FilterComponent from "./FilterComponent";
import BookingActionComponent from "./BookingActionComponent";
import { AddressModal } from "./modals/AddressModal";
import { BookingBadgeStatus } from "@/utils/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useHttp } from "@/utils/useHttp";

interface Booking {
  bookingId: string;
  hostName: string;
  customerName: string;
  city: string;
  duration: number;
  vehicle: string;
  startDate: string;
  bookingType: string;
  status: BookingBadgeStatus;
  price: number;
}

interface BookingResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type TripStatus =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "ONGOING"
  | "EXTRA_TIME"
  | "CANCELLED"
  | "COMPLETED";

interface BookingTableItem {
  id: string;
  customerName: string;
  hostName: string;
  city: string;
  bookingType: string;
  pickupLocation: string;
  vehicle: string;
  bookingStatus: BookingBadgeStatus;
  tripStatus: TripStatus;
  duration?: string;
  startDate?: string;
  price?: string;
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

const BookingsTable: React.FC = () => {
  const router = useRouter();
  const http = useHttp();
  const [bookings, setBookings] = useState<BookingTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch the most recent 10 bookings, sorted by most recent (assuming API supports sort param)
      const response = await http.get<BookingResponse>(
        `/admin/booking/list?page=1&limit=10&search=${searchTerm}`
      );

      if (response && response.data) {
        const transformedBookings: BookingTableItem[] = response.data.map(
          (booking) => ({
            id: booking.bookingId,
            customerName: booking.customerName,
            hostName: booking.hostName,
            city: booking.city,
            bookingType: booking.bookingType,
            pickupLocation: booking.city,
            vehicle: booking.vehicle,
            bookingStatus: booking.status,
            tripStatus: "UNCONFIRMED" as TripStatus,
            duration: booking.duration ? `${booking.duration} days` : undefined,
            startDate: booking.startDate
              ? new Date(booking.startDate).toLocaleDateString()
              : undefined,
            price: booking.price
              ? `NGN ${booking.price.toLocaleString()}`
              : undefined,
            customer: {
              name: booking.customerName,
              phone: "",
              email: "",
              memberSince: "2024-01-01",
              bookingHistory: [],
            },
          })
        );
        setBookings(transformedBookings);
      } else {
        setError("Failed to fetch bookings: No data received.");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(
        `Error fetching bookings: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Only refetch on searchTerm change
  }, [searchTerm]);

  const renderBookingStatusBadge = (status: BookingBadgeStatus) => {
    const statusStyles: Record<BookingBadgeStatus, string> = {
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

  const openModal = (content: string) => {
    setIsOpen(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent("");
  };

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>

        <div className="flex justify-between mb-6 flex-wrap">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <FilterComponent />
          </div>
          <a
            href="/dashboard/bookings/list"
            className="text-[#667185] hover:text-blue-700 text-sm font-semibold self-end sm:self-center"
          >
            View All
          </a>
        </div>

        <div className="overflow-x-auto border border-[#D0D5DD] rounded-lg">
          <table className="min-w-full divide-y divide-[#D0D5DD]">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D0D5DD]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr
                    key={`${booking.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/bookings/${booking.id}`)
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#344054]">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#344054]">
                      {booking.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#344054]">
                      {booking.hostName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#344054]">
                      {booking.city}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#344054]">
                      {booking.bookingType}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#344054]">
                      {booking.vehicle}
                    </td>
                    <td className="px-6 py-4">
                      {renderBookingStatusBadge(booking.bookingStatus)}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BookingActionComponent
                        bookingStatus={booking.bookingStatus}
                        pickupLocation={booking.pickupLocation}
                        bookingId={booking.id}
                        customer={
                          booking.customer
                            ? {
                                ...booking.customer,
                                memberSince:
                                  booking.customer.memberSince || "2024-01-01",
                                bookingHistory:
                                  booking.customer.bookingHistory || [],
                              }
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No bookings found for the current search/filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddressModal
          isOpen={isOpen}
          modalContent={modalContent}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default BookingsTable;

"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FilterComponent from "./FilterComponent";
import BookingActionComponent from "./BookingActionComponent";
import { AddressModal } from "./modals/AddressModal";
import { BookingBadgeStatus } from "@/utils/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useHttp } from "@/utils/useHttp";
import useBookings, { BookingResponse } from "@/hooks/useBookings";

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

type TripStatus =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "ONGOING"
  | "EXTRA_TIME"
  | "CANCELLED"
  | "COMPLETED";

interface BookingTableItem {
  id: string;
  bookingId: string;
  customerName: string;
  city: string;
  bookingType: string;
  pickupLocation: string;
  vehicle: string;
  bookingStatus: string;
  tripStatus: string;
  createdAt?: string;
  hostName?: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const { data, isLoading, error } = useBookings({ page: 1, limit: 10, search: searchTerm }) as { data?: BookingResponse; isLoading: boolean; error?: Error };

  const bookings: BookingTableItem[] = (data?.data ?? []).map((booking: any) => ({
    id: booking.bookingId,
    bookingId: booking.bookingId,
    customerName: booking.customerName,
    city: booking.city,
    bookingType: booking.bookingType,
    pickupLocation: booking.pickupLocation || booking.city,
    vehicle: booking.vehicle,
    bookingStatus: booking.status,
    tripStatus: booking.tripStatus,
    createdAt: booking.createdAt,
    hostName: booking.hostName || "-",
    duration: booking.duration ? `${booking.duration} days` : "-",
    startDate: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "-",
    price: booking.price ? `NGN ${booking.price.toLocaleString()}` : "-",
    customer: booking.customer || undefined,
  }));

  const renderBookingStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      Paid: "bg-[#0AAF24] text-white",
      Unpaid: "bg-[#101928] text-white",
      Pending: "bg-[#F3A218] text-white",
      Completed: "bg-[#0673FF] text-white",
      Rejected: "bg-[#667185] text-white",
      Cancelled: "bg-[#F83B3B] text-white",
      APPROVED: "bg-[#0AAF24] text-white",
      PENDING: "bg-[#F3A218] text-white",
      CANCELLED: "bg-[#F83B3B] text-white",
      COMPLETED: "bg-[#0673FF] text-white",
      REJECTED: "bg-[#667185] text-white",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-200 text-gray-700"}`}>{status}</span>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D0D5DD]">
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500">Loading bookings...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-red-600">{error.message}</td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr
                    key={`${booking.bookingId}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#344054]">{booking.bookingId}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.customerName}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.hostName || "-"}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.city}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.bookingType}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.duration || "-"}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.startDate || "-"}</td>
                    <td className="px-6 py-4 text-sm text-[#344054]">{booking.price || "-"}</td>
                    <td className="px-6 py-4">{renderBookingStatusBadge(booking.bookingStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <BookingActionComponent 
                        bookingStatus={booking.bookingStatus as BookingBadgeStatus}
                        pickupLocation={booking.pickupLocation}
                        bookingId={booking.bookingId}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500">No bookings found for the current search/filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddressModal isOpen={isOpen} modalContent={modalContent} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default BookingsTable;

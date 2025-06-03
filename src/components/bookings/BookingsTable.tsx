"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

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
  ];

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
    <div className="w-full bg-white">
      <div className="flex justify-between items-center px-4 py-4">
        <h2 className="text-xl font-medium text-[#344054]">Bookings</h2>
        <Link
          href="/dashboard/bookings/list"
          className="text-[#667185] hover:text-blue-700 text-sm"
        >
          View All
        </Link>
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
            {bookings.map((booking, index) => (
              <tr
                key={`${booking.id}-${index}`}
                className={`border-b border-[#D0D5DD] hover:bg-gray-50 ${
                  index === bookings.length - 1 ? "border-b-0" : ""
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
                  <button className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;

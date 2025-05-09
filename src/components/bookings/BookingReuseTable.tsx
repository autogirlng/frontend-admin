"use client";

import React from "react";
import {
  MoreVertical,
  Search,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FilterComponent from "./FilterComponent";

// Define the booking data type based on the image content
interface Booking {
  id: string;
  customerName: string;
  city: string;
  bookingType: "Single Day" | "Multi Day";
  pickupLocation: string;
  vehicle: string;
  bookingStatus:
    | "Paid"
    | "Unpaid"
    | "Pending"
    | "Completed"
    | "Rejected"
    | "Cancelled";
  tripStatus:
    | "Unconfirmed"
    | "Confirmed"
    | "Ongoing"
    | "Extra Time"
    | "Cancelled"
    | "Completed";
}

const BookingReuseTable: React.FC = () => {
  // Booking data to match the image
  const bookings: Booking[] = [
    {
      id: "BKG-1234-AB56",
      customerName: "Chioma Nwosu",
      city: "Lagos",
      bookingType: "Single Day",
      pickupLocation: "1234 Elm Street...",
      vehicle: "Toyota Corolla",
      bookingStatus: "Paid",
      tripStatus: "Unconfirmed",
    },
    {
      id: "BKG-4567-GH12",
      customerName: "Oluwaseun Ojo",
      city: "Benin",
      bookingType: "Multi Day",
      pickupLocation: "River Plaza very long address and let see if this works",
      vehicle: "Toyota Camry Muscle",
      bookingStatus: "Unpaid",
      tripStatus: "Extra Time",
    },
    {
      id: "BKG-4567-GH12",
      customerName: "Chukwuemeka Okeke",
      city: "Enugu",
      bookingType: "Multi Day",
      pickupLocation: "Skyline Park...",
      vehicle: "Toyota Yaris 2007",
      bookingStatus: "Paid",
      tripStatus: "Cancelled",
    },
    {
      id: "BKG-5678-IJ34",
      customerName: "Chigozie Nnamani",
      city: "Accra",
      bookingType: "Multi Day",
      pickupLocation: "Main St. Lot...",
      vehicle: "Toyota Avensis",
      bookingStatus: "Paid",
      tripStatus: "Ongoing",
    },
    {
      id: "BKG-8901-MN78",
      customerName: "Ezinne Chukwu",
      city: "Lagos",
      bookingType: "Multi Day",
      pickupLocation: "Greenwood Ln...",
      vehicle: "Nissan Almera",
      bookingStatus: "Pending",
      tripStatus: "Confirmed",
    },
    {
      id: "BKG-0123-QR12",
      customerName: "Oluchi Eze",
      city: "Benin",
      bookingType: "Multi Day",
      pickupLocation: "Westside Rd...",
      vehicle: "Toyota Hilux",
      bookingStatus: "Completed",
      tripStatus: "Extra Time",
    },
    {
      id: "BKG-3456-EF90",
      customerName: "Chika Ibe",
      city: "Lagos",
      bookingType: "Multi Day",
      pickupLocation: "Oceanview Ave...",
      vehicle: "Mitsubishi L200",
      bookingStatus: "Pending",
      tripStatus: "Completed",
    },
    {
      id: "BKG-4567-GH12",
      customerName: "Nnamdi Kalu",
      city: "Benin",
      bookingType: "Single Day",
      pickupLocation: "Maple Grove...",
      vehicle: "Toyota Yaris 2007",
      bookingStatus: "Rejected",
      tripStatus: "Cancelled",
    },
    {
      id: "BKG-6789-KL56",
      customerName: "Obinna Anozie",
      city: "Accra",
      bookingType: "Single Day",
      pickupLocation: "City Hall Sq...",
      vehicle: "Peugeot 504 Pickup",
      bookingStatus: "Cancelled",
      tripStatus: "Completed",
    },
    {
      id: "BKG-3851-ZW76",
      customerName: "Adebayo Olatunji",
      city: "Enugu",
      bookingType: "Multi Day",
      pickupLocation: "Tech Hub Bld...",
      vehicle: "Lexus RX 350",
      bookingStatus: "Completed",
      tripStatus: "Cancelled",
    },
  ];

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

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">11th Aug 2025</h1>

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
              {bookings.map((booking, index) => (
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
                  <td className="px-4 py-4 text-sm text-[#344054]">
                    {booking.pickupLocation}
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
                    <button className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-1">
          <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>

          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-md ${
                page === 3
                  ? "bg-blue-500 text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReuseTable;

"use client";

import React, { useState } from "react";
import { Copy, MoreVertical } from "lucide-react";
import DottedLines from "../../shared/DottedLines";
import Link from "next/link";

interface BookingInfoProps {
  bookingId?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  trips?: number;
  bookingType?: string;
  platform?: string;
  bookedBy?: string;
  amount?: number;
  currency?: string;
  isPaid?: boolean;
  guestName?: string;
  email?: string;
  phone?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  bookingId = "BKG-7482-XY91",
  startDate = "14th August 2024 | 9:30PM",
  endDate = "21st August 2024 | 9:30PM",
  duration = "8 days",
  trips = 5,
  bookingType = "One Way Trip",
  platform = "Offline",
  bookedBy = "Mamudu Jeffrey",
  amount = 49510.0,
  currency = "NGN",
  isPaid = true,
  guestName = "Chioma Nuosu",
  email = "chidubem3@gmail.com",
  phone = "+234 901 7330 902",
  pickupLocation = "123 Victoria Island Road, Lagos, Nigeria",
  dropoffLocation = "1523 Admiralty Road, Lagos, Nigeria",
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white pt-8 pb-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-medium text-gray-900 tracking-wide">
            BOOKING INFORMATION
          </h1>
          <span className="px-3 py-1 bg-[#B6FCBF] text-[#0F581D] text-xs font-medium rounded-full">
            Ongoing
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Mark as completed
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Link href={`/dashboard/bookings/${bookingId}/assign-driver`}>
                    Assign Driver
                  </Link>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Download booking summary
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking ID */}
      <div className="mb-8">
        <p className="text-xs text-gray-500 mb-2 font-medium">Booking ID</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">
            {bookingId}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Copy className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Booking Dates */}
      <div className="mb-10">
        <p className="text-xs text-gray-500 mb-4 font-medium">Booking Dates</p>
        <div className="flex flex-wrap gap-8">
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              Start Date:{" "}
            </span>
            <span className="text-sm text-gray-900">{startDate}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              End Date:{" "}
            </span>
            <span className="text-sm text-gray-900">{endDate}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              Duration:{" "}
            </span>
            <span className="text-sm text-gray-900">{duration}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              No of Trips:{" "}
            </span>
            <span className="text-sm text-gray-900">{trips}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              Booking Type:{" "}
            </span>
            <span className="text-sm text-gray-900">{bookingType}</span>
          </div>
        </div>
      </div>

      {/* Platform and Booked By */}
      <div className="mb-12 flex flex-wrap gap-8">
        <div>
          <span className="text-sm text-gray-900 font-medium">
            Booking Platform:{" "}
          </span>
          <span className="text-sm text-gray-900">{platform}</span>
        </div>
        <div>
          <span className="text-sm text-gray-900 font-medium">Booked By: </span>
          <span className="text-sm text-primary-600 hover:underline cursor-pointer">
            {bookedBy}
          </span>
        </div>
      </div>
      <DottedLines />
      {/* Payment Information */}
      <div className="mb-12">
        <h2 className="text-xs text-gray-500 mb-6 font-medium tracking-wide">
          PAYMENT INFORMATION
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-2">Amount</p>
            <div className="flex items-center gap-3">
              <span className="text-[30px] font-bold text-[#0673FF]">
                {currency}{" "}
                {amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <button className="text-primary-600 text-sm hover:underline font-medium">
            View Receipt
          </button>
        </div>
        <div className="mt-4">
          {isPaid && (
            <span className="px-3 py-1 bg-[#0AAF24] text-white text-xs font-medium rounded-full">
              Paid
            </span>
          )}
        </div>
      </div>
      <DottedLines />
      {/* Guest Information */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs text-gray-500 font-medium tracking-wide">
            GUEST INFORMATION
          </h2>
          <button className="text-primary-600 text-sm hover:underline font-medium">
            View Customer
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Guest Name</p>
          <p className="text-base font-semibold text-gray-900">{guestName}</p>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-4">Contact Information</p>
          <div className="flex flex-wrap gap-8 mb-4">
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">Email: </span>
              <span className="text-sm text-gray-900">{email}</span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Phone Number:{" "}
              </span>
              <span className="text-sm text-gray-900">{phone}</span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Pickup Location:{" "}
              </span>
              <span className="text-sm text-gray-900">{pickupLocation} </span>
              <button className="text-primary-600 text-sm hover:underline font-medium ml-1">
                View On Map
              </button>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Dropoff Location:{" "}
              </span>
              <span className="text-sm text-gray-900">{dropoffLocation} </span>
              <button className="text-primary-600 text-sm hover:underline font-medium ml-1">
                View On Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;

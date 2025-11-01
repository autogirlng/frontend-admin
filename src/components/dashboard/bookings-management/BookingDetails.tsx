// app/dashboard/bookings/[bookingId]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertCircle,
  Car,
  DollarSign,
  User,
  Link as LinkIcon,
  MapPin,
  Hash,
} from "lucide-react";

// Hooks
import { useGetBookingDetails } from "@/lib/hooks/booking-management/useBookingDetails";

// Types
import { BookingSegment } from "./details-types";

// Components
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-900 break-words">
      {value || <span className="text-gray-400">N/A</span>}
    </p>
  </div>
);

// Helper for status badges
const StatusBadge = ({ text }: { text: string }) => {
  let colorClasses = "bg-gray-100 text-gray-800";
  if (text === "CONFIRMED") colorClasses = "bg-green-100 text-green-800";
  if (text === "PENDING_PAYMENT")
    colorClasses = "bg-yellow-100 text-yellow-800";
  if (text?.includes("CANCELLED")) colorClasses = "bg-red-100 text-red-800";

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full inline-block ${colorClasses}`}
    >
      {text.replace(/_/g, " ")}
    </span>
  );
};

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const { data: booking, isLoading, isError } = useGetBookingDetails(bookingId);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError || !booking) {
    return (
      <main className="py-3 max-w-8xl mx-auto">
        <CustomBack />
        <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load booking details.</span>
        </div>
      </main>
    );
  }

  return (
    <>
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto space-y-8">
        {/* --- Header --- */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Details
            </h1>
            <p className="text-lg text-gray-500 mt-1">{booking.bookingId}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <StatusBadge text={booking.bookingStatus} />
          </div>
        </div>

        {/* --- Top Cards Row: Vehicle, Booker, Payment --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Vehicle Section */}
          <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Car className="h-6 w-6 text-[#0096FF]" />
              <h3 className="text-xl font-semibold text-gray-800">Vehicle</h3>
            </div>
            <div className="space-y-3">
              <Link
                href={`/dashboard/vehicle-onboarding/${booking.vehicle.id}`}
                className="group"
              >
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg font-bold text-[#0096FF] group-hover:underline flex items-center gap-2">
                  {booking.vehicle.vehicleName}
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </p>
              </Link>
              <DetailItem
                label="Identifier"
                value={booking.vehicle.vehicleId}
              />
              <DetailItem
                label="License Plate"
                value={booking.vehicle.licensePlate}
              />
            </div>
          </div>

          {/* Booker Section */}
          <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-[#0096FF]" />
              <h3 className="text-xl font-semibold text-gray-800">Customer</h3>
            </div>
            <div className="space-y-3">
              <DetailItem label="Full Name" value={booking.booker.fullName} />
              <DetailItem label="Email" value={booking.booker.email} />
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-[#0096FF]" />
              <h3 className="text-xl font-semibold text-gray-800">Payment</h3>
            </div>
            <div className="space-y-3">
              <DetailItem
                label="Total Price"
                value={`₦${booking.totalPrice.toLocaleString()}`}
              />
              <DetailItem
                label="Payment Method"
                value={booking.paymentMethod}
              />
              <DetailItem label="Channel" value={booking.channel} />
              <DetailItem
                label="Booked On"
                value={format(
                  new Date(booking.bookedAt),
                  "MMM d, yyyy, h:mm a"
                )}
              />
            </div>
          </div>
        </div>

        {/* --- Itinerary Section (UPDATED) --- */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-[#0096FF]" />
            <h3 className="text-xl font-semibold text-gray-800">Itinerary</h3>
          </div>
          <div className="space-y-6">
            {booking.segments.map((segment: BookingSegment, index) => (
              <div
                key={segment.segmentId}
                className="flex gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-[#0096FF] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {index < booking.segments.length - 1 && (
                    <div className="w-px h-full bg-gray-300 my-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold">
                        {segment.bookingTypeName}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Duration: {segment.duration}
                      </p>
                    </div>
                    {/* ✅ ADDED: Segment Booking Status */}
                    <StatusBadge text={segment.bookingStatus} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="From"
                      value={segment.pickupLocation}
                      className="mt-2"
                    />
                    <DetailItem
                      label="To"
                      value={segment.dropoffLocation}
                      className="mt-2"
                    />
                    {/* ✅ ADDED: Start Date Time */}
                    <DetailItem
                      label="Start Time"
                      value={format(
                        new Date(segment.startDateTime),
                        "MMM d, yyyy, h:mm a"
                      )}
                    />
                    {/* ✅ ADDED: End Date Time */}
                    <DetailItem
                      label="End Time"
                      value={format(
                        new Date(segment.endDateTime),
                        "MMM d, yyyy, h:mm a"
                      )}
                    />
                    {/* ✅ ADDED: Google Maps Link (Now works) */}
                    <div className="md:col-span-2">
                      <DetailItem
                        label="Pickup Coordinates (Lat, Long)"
                        value={
                          <a
                            href={`https://maps.google.com/?q=${segment.pickupLatitude},${segment.pickupLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0096FF] hover:underline inline-flex items-center gap-1"
                          >
                            {segment.pickupLatitude}, {segment.pickupLongitude}
                            <LinkIcon className="h-3 w-3" />
                          </a>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

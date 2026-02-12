"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertCircle,
  Car,
  User,
  Link as LinkIcon,
  MapPin,
  FileText,
  Info,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Map as MapIcon,
  Coins,
  Tag,
  Globe,
} from "lucide-react";
import { useGetBookingDetails } from "@/lib/hooks/booking-management/useBookingDetails";
import { BookingSegment } from "./details-types";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import clsx from "clsx";

const DetailRow = ({
  icon: Icon,
  label,
  value,
  isLink = false,
  href = "#",
  className = "",
}: {
  icon?: any;
  label: string;
  value: React.ReactNode;
  isLink?: boolean;
  href?: string;
  className?: string;
}) => (
  <div
    className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-50 last:border-0 ${className}`}
  >
    <div className="flex items-center gap-2 mb-1 sm:mb-0">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-900 text-right break-all sm:break-normal">
      {isLink ? (
        <Link
          href={href}
          className="text-[#0096FF] hover:underline flex items-center justify-end gap-1"
        >
          {value} <LinkIcon className="w-3 h-3" />
        </Link>
      ) : (
        value || <span className="text-gray-300">N/A</span>
      )}
    </div>
  </div>
);

const StatusBadge = ({
  text,
  size = "md",
}: {
  text: string;
  size?: "sm" | "md";
}) => {
  let colorClasses = "bg-gray-100 text-gray-600 border-gray-200";
  let Icon = Info;

  if (text === "CONFIRMED" || text === "SUCCESSFUL") {
    colorClasses = "bg-green-50 text-green-700 border-green-200";
    Icon = CheckCircle2;
  } else if (text === "PENDING_PAYMENT" || text === "PENDING") {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
    Icon = Clock;
  } else if (text?.includes("CANCELLED") || text === "FAILED") {
    colorClasses = "bg-red-50 text-red-700 border-red-200";
    Icon = XCircle;
  }

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${colorClasses} ${sizeClasses}`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {text?.replace(/_/g, " ")}
    </span>
  );
};

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const { data: booking, isLoading, isError } = useGetBookingDetails(bookingId);

  if (isLoading) return <CustomLoader />;

  if (isError || !booking) {
    return (
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <CustomBack />
        <div className="mt-6 flex flex-col items-center justify-center p-12 text-center bg-red-50 border border-red-100 rounded-2xl">
          <div className="bg-red-100 p-3 rounded-full mb-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-red-900">
            Failed to load booking
          </h3>
          <p className="text-red-600">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  const isPartiallyPaid =
    !booking.paidAt && booking.bookingStatus === "CONFIRMED";

  const isSP = booking.bookingCategory === "SERVICE_PRICING";

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-8xl mx-auto px-0 sm:px-0 lg:px-0 py-3">
        <CustomBack />
        <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Booking Details
              </h1>
              <StatusBadge text={booking.bookingStatus} />
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border",
                  isSP
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-blue-50 text-blue-700 border-blue-200",
                )}
              >
                <Tag className="w-3.5 h-3.5" />
                {booking.bookingCategory?.replace("_", " ") || "NORMAL"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>Invoice:</span>
                <span className="font-mono font-medium text-gray-900">
                  {booking.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">ID:</span>
                <span className="font-mono">{booking.bookingId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="p-6 bg-gradient-to-br from-[#0096FF]/5 to-transparent border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-[#0096FF]" />
                  <h3 className="font-bold text-gray-900">Financial Summary</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Breakdown of costs and payment status
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      ₦{booking.originalPrice?.toLocaleString() ?? "0.00"}
                    </span>
                  </div>

                  {booking.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                      <span className="flex items-center gap-1">
                        Discount
                        {booking.couponCode && (
                          <span className="text-[10px] bg-white border border-red-200 px-1 rounded uppercase">
                            {booking.couponCode}
                          </span>
                        )}
                      </span>
                      <span>-₦{booking.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 my-2 pt-2 flex justify-between items-end">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#0096FF]">
                      ₦{booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    booking.paidAt
                      ? "bg-green-50 border-green-100"
                      : isPartiallyPaid
                        ? "bg-blue-50 border-blue-100"
                        : "bg-amber-50 border-amber-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Payment Status
                    </span>
                    {booking.paidAt ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : isPartiallyPaid ? (
                      <Coins className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </div>

                  {booking.paidAt ? (
                    <div>
                      <p className="font-bold text-green-800">
                        Payment Received
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        {format(
                          new Date(booking.paidAt),
                          "MMM d, yyyy • h:mm a",
                        )}
                      </p>
                    </div>
                  ) : isPartiallyPaid ? (
                    <div>
                      <p className="font-bold text-blue-800">Partially Paid</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Booking confirmed via partial payment.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-amber-800">
                        Pending Payment
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Customer has not paid fully yet.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <DetailRow label="Method" value={booking.paymentMethod} />
                  <DetailRow label="Channel" value={booking.channel} />
                  <DetailRow
                    label="Booked Date"
                    value={format(new Date(booking.bookedAt), "MMM d, yyyy")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#0096FF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Vehicle</h3>
                    <p className="text-xs text-gray-500">Transport Details</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <DetailRow
                    label="Name"
                    value={booking.vehicle.vehicleName}
                    isLink
                    href={`/dashboard/vehicle-onboarding/${booking.vehicle.id}`}
                  />
                  <DetailRow
                    label="Plate No."
                    value={booking.vehicle.licensePlate}
                  />
                  <DetailRow
                    label="ID"
                    value={booking.vehicle.vehicleId}
                    className="border-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Customer</h3>
                    <p className="text-xs text-gray-500">Contact Information</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <DetailRow label="Name" value={booking.booker.fullName} />
                  <DetailRow label="Email" value={booking.booker.email} />
                  <DetailRow
                    label="Phone"
                    value={booking.booker.customerPhone}
                    className="border-none"
                  />
                </div>
              </div>
            </div>

            {(booking.purposeOfRide || booking.extraDetails) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-gray-900">Ride Notes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {booking.purposeOfRide && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Purpose
                      </p>
                      <p className="text-gray-900 text-sm">
                        {booking.purposeOfRide}
                      </p>
                    </div>
                  )}
                  {booking.extraDetails && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Extra Details
                      </p>
                      <p className="text-gray-900 text-sm">
                        {booking.extraDetails}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <MapIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Itinerary</h3>
                    <p className="text-xs text-gray-500">
                      {booking.segments.length} Segment(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {booking.segments.map((segment: BookingSegment, index) => (
                  <div
                    key={segment.segmentId}
                    className="p-6 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {segment.bookingTypeName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Duration: {segment.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge text={segment.bookingStatus} size="sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative pl-3 sm:pl-0">
                      <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-100 sm:hidden"></div>

                      <div className="relative">
                        <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-green-500 sm:hidden"></div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Pickup
                        </p>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {segment.pickupLocation}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(
                            new Date(segment.startDateTime),
                            "MMM d, h:mm a",
                          )}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${segment.pickupLatitude},${segment.pickupLongitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-[#0096FF] hover:underline"
                        >
                          View Map <LinkIcon className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-red-500 sm:hidden"></div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Dropoff
                        </p>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {segment.dropoffLocation}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(
                            new Date(segment.endDateTime),
                            "MMM d, h:mm a",
                          )}
                        </p>
                      </div>
                    </div>
                    {segment.areaOfUse && segment.areaOfUse.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1 rounded bg-blue-50">
                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Applied Areas of Use
                          </h4>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 grid gap-3 sm:grid-cols-2">
                          {segment.areaOfUse.map((area, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 leading-snug">
                                  {area.areaOfUseName}
                                </p>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${area.areaOfUseLatitude},${area.areaOfUseLongitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#0096FF] hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  View on Map{" "}
                                  <LinkIcon className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

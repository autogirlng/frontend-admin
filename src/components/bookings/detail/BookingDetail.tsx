"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Copy, MoreVertical } from "lucide-react";
import { AssignAgentModal } from "../modals/AssignAgentModal";
import DottedLines from "../../shared/DottedLines";
import { BookingInformation } from "@/utils/types";
import { IoIosArrowRoundBack } from "react-icons/io";

interface BookingInfoProps {
  bookingDetails: BookingInformation;
  assignedDrivers?: any[];
}

const BookingInfo: React.FC<BookingInfoProps> = ({ bookingDetails, assignedDrivers }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showActions, setShowActions] = useState(false);
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false);

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate duration in days
  const calculateDuration = () => {
    const start = new Date(bookingDetails.startDate);
    const end = new Date(bookingDetails.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  // Add a color badge function for payment and booking status
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "text-black bg-[#FFDE59]";
      case "CONFIRMED":
        return "text-primary-600 bg-primary-100";
      case "ONGOING":
        return "text-success-600 bg-success-100";
      case "COMPLETED":
        return "text-gray-600 bg-gray-100";
      case "CANCELLED":
        return "text-[#F0595A] bg-[#F0595A]";
      case "APPROVED":
        return "text-success-700 bg-success-100";
      case "ACCEPTED":
        return "text-primary-700 bg-primary-100";
      case "PAID":
        return "text-success-700 bg-success-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white pt-8 pb-4 text-sm">
      {/* Header */}
      <button
        className="mb-4 text-primary-600 hover:underline font-medium flex items-center gap-2 pb-3"
        onClick={() => router.back()}
      >
        <IoIosArrowRoundBack size={30} /> Back
      </button>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-medium text-gray-900 tracking-wide">
            BOOKING INFORMATION
          </h1>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
              bookingDetails.bookingStatus
            )}`}
          >
            {bookingDetails.bookingStatus}
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
                <button onClick={() => router.push(`${pathname}/assign-driver`)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Assign driver
                </button>
                <button onClick={() => setIsAssignAgentModalOpen(true)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Assign agent
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
          <AssignAgentModal isOpen={isAssignAgentModalOpen} setIsOpen={setIsAssignAgentModalOpen} tripId={bookingDetails.id} />
        </div>
      </div>

      {/* Booking ID */}
      <div className="mb-8">
        <p className="text-xs text-gray-500 mb-2 font-medium">Booking ID</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">
            {bookingDetails.id}
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
            <span className="text-sm text-gray-900">
              {formatDate(bookingDetails.startDate)}
            </span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              End Date:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {formatDate(bookingDetails.endDate)}
            </span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              Duration:{" "}
            </span>
            <span className="text-sm text-gray-900">{calculateDuration()}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">
              Booking Type:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {bookingDetails.bookingType}
            </span>
          </div>
        </div>
      </div>

      {/* Platform and Booked By */}
      <div className="mb-12 flex flex-wrap gap-8">
        <div>
          <span className="text-sm text-gray-900 font-medium">
            Payment Method:{" "}
          </span>
          <span className="text-sm text-gray-900">
            {bookingDetails.paymentMethod}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-900 font-medium">
            Payment Status:{" "}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              bookingDetails.paymentStatus
            )}`}
          >
            {bookingDetails.paymentStatus}
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
                {bookingDetails.currencyCode}{" "}
                {bookingDetails.amount.toLocaleString("en-US", {
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
          {bookingDetails.paymentStatus === "paid" && (
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
          <button className="text-primary-600 text-sm hover:underline font-medium"
            onClick={() => {
              const customerId = bookingDetails.userId;
              if (customerId) {
                window.location.href = `/customer/${customerId}`;
              }
            }}
          >
            View Customer
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Guest Name</p>
          <p className="text-base font-semibold text-gray-900">
            {bookingDetails.guestName}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-4">Contact Information</p>
          <div className="flex flex-wrap gap-8 mb-4">
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">Email: </span>
              <span className="text-sm text-gray-900">
                {bookingDetails.guestEmail}
              </span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Phone Number:{" "}
              </span>
              <span className="text-sm text-gray-900">
                {bookingDetails.guestPhoneNumber}
              </span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Emergency Contact:{" "}
              </span>
              <span className="text-sm text-gray-900">
                {bookingDetails.emergencyContact}
              </span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Pickup Location:{" "}
              </span>
              <span className="text-sm text-gray-900">
                {bookingDetails.pickupLocation}{" "}
              </span>
              <button className="text-primary-600 text-sm hover:underline font-medium ml-1">
                View On Map
              </button>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Dropoff Location:{" "}
              </span>
              <span className="text-sm text-gray-900">
                {bookingDetails.dropoffLocation}{" "}
              </span>
              <button className="text-primary-600 text-sm hover:underline font-medium ml-1">
                View On Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      {bookingDetails.vehicle && (
        <>
          <DottedLines />
          <div className="mb-10">
            <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-4">
              VEHICLE DETAILS
            </h2>
            <div className="flex flex-wrap gap-8">
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Name:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.listingName}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Make:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.make}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Model:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.model}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Color:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.vehicleColor}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  License Plate:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.licensePlateNumber}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Year:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.yearOfRelease}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Type:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.vehicleType}
                </span>
              </div>
              <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-900 font-medium">
                  Seats:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {bookingDetails.vehicle.numberOfSeats}
                </span>
              </div>
            </div>
            {bookingDetails.vehicle.features &&
              bookingDetails.vehicle.features.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-900 font-medium">
                    Features:{" "}
                  </span>
                  <span className="text-sm text-gray-900">
                    {bookingDetails.vehicle.features.join(", ")}
                  </span>
                </div>
              )}
          </div>
        </>
      )}

      {/* Travel Companions */}
      {bookingDetails.travelCompanions &&
        bookingDetails.travelCompanions.length > 0 && (
          <>
            <DottedLines />
            <div className="mb-10">
              <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-4">
                TRAVEL COMPANIONS
              </h2>
              <ul className="list-disc pl-5">
                {bookingDetails.travelCompanions.map((companion) => (
                  <li key={companion.id} className="mb-2">
                    <span className="text-sm text-gray-900 font-medium">
                      {companion.name}
                    </span>
                    {companion.phoneNumber && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({companion.phoneNumber})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

      {/* Additional Booking Info */}
      {/*
      <DottedLines />
      <div className="mb-10">
        <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-4">ADDITIONAL BOOKING INFO</h2>
        <div className="flex flex-wrap gap-8">
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Is For Self: </span>
            <span className="text-sm text-gray-900">{bookingDetails.isForSelf !== undefined ? (bookingDetails.isForSelf ? 'Yes' : 'No') : 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">User Email: </span>
            <span className="text-sm text-gray-900">{bookingDetails.userEmail || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">User Phone: </span>
            <span className="text-sm text-gray-900">{bookingDetails.userPhoneNumber || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">User Country: </span>
            <span className="text-sm text-gray-900">{bookingDetails.userCountry || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Country Code: </span>
            <span className="text-sm text-gray-900">{bookingDetails.countryCode || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Secondary Phone: </span>
            <span className="text-sm text-gray-900">{bookingDetails.secondaryPhoneNumber || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Host ID: </span>
            <span className="text-sm text-gray-900">{bookingDetails.hostId || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Version: </span>
            <span className="text-sm text-gray-900">{bookingDetails.version !== undefined ? bookingDetails.version : 'N/A'}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 mt-4">
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Special Instructions: </span>
            <span className="text-sm text-gray-900">{bookingDetails.specialInstructions || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Area of Use: </span>
            <span className="text-sm text-gray-900">{bookingDetails.areaOfUse || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Extra Details: </span>
            <span className="text-sm text-gray-900">{bookingDetails.extraDetails || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Purpose of Ride: </span>
            <span className="text-sm text-gray-900">{bookingDetails.purposeOfRide || 'N/A'}</span>
          </div>
          <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
            <span className="text-sm text-gray-900 font-medium">Trip Purpose: </span>
            <span className="text-sm text-gray-900">{bookingDetails.tripPurpose || 'N/A'}</span>
          </div>
        </div>
        {bookingDetails.paymentLink && (
          <div className="mt-4">
            <span className="text-sm text-gray-900 font-medium">Payment Link: </span>
            <a href={bookingDetails.paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{bookingDetails.paymentLink}</a>
          </div>
        )}
        {bookingDetails.outskirtsLocation && bookingDetails.outskirtsLocation.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-900 font-medium">Outskirts Locations: </span>
            <span className="text-sm text-gray-900">{bookingDetails.outskirtsLocation.join(', ')}</span>
          </div>
        )}
      </div>
      */}

      {/* Vehicle Images Gallery */}
      {bookingDetails.vehicle && bookingDetails.vehicle.VehicleImage && (
        <>
          <DottedLines />
          <div className="mb-10">
            <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-4">
              VEHICLE IMAGES
            </h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(bookingDetails.vehicle.VehicleImage).map(
                ([key, url]) =>
                  url ? (
                    <div
                      key={key}
                      className="w-32 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={url}
                        alt={key}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : null
              )}
            </div>
          </div>
        </>
      )}

      {(assignedDrivers && assignedDrivers.length > 0) ? (
        <>
          <DottedLines />
          <div className="mb-10">
            <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-4">
              DRIVER DETAILS
            </h2>
            {assignedDrivers.map((assignment) => (
              <div key={assignment.id} className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 bg-[#F7F9FC] p-3 rounded-md shadow-sm mb-3">
                <div className="flex-1">
                  <span className="text-sm text-gray-900 font-medium">Name: </span>
                  <span className="text-sm text-gray-900">{assignment.driver?.firstName} {assignment.driver?.lastName}</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900 font-medium">Phone: </span>
                  <span className="text-sm text-gray-900">{assignment.driver?.phoneNumber}</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900 font-medium">Assignment Date: </span>
                  <span className="text-sm text-gray-900">{assignment.assignmentDate ? new Date(assignment.assignmentDate).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900 font-medium">Status: </span>
                  <span className="text-sm text-gray-900">{assignment.status}</span>
                </div>
                <button
                  className="text-primary-600 text-sm hover:underline font-medium"
                  onClick={() => {
                    window.location.href = `/drivers/${assignment.driverId}`;
                  }}
                >
                  View Driver Details
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <DottedLines />
          <div className="mb-10">
            <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-4">
              DRIVER DETAILS
            </h2>
            <div className="bg-[#F7F9FC] p-4 rounded-md text-center text-gray-600 mb-3">
              No drivers have been assigned to this booking yet.
            </div>
            <div className="flex justify-center">
              <button
                className="text-white bg-primary-600 hover:bg-primary-700 font-medium rounded px-4 py-2 text-sm"
                onClick={() => window.location.href = `/dashboard/drivers/assign?bookingId=${bookingDetails.id}`}
              >
                Assign Driver
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingInfo;

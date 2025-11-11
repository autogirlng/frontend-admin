// app/dashboard/trips/[tripId]/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertCircle,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  User,
  Users,
  Check,
  Link as LinkIcon,
  Briefcase,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

// Hooks
import { useGetTripDetails } from "@/lib/hooks/trips-management/useTrips"; // Adjust path
import { useGetVehicleDetails } from "@/lib/hooks/trips-management/useVehicleDetails"; // Adjust path

// Components
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

// Helper component for styled info boxes
const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 shadow-sm border border-gray-200">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="h-6 w-6 text-[#0096FF]" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-2 text-gray-600">{children}</div>
  </div>
);

// Helper for data pairs
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-900">{value || "N/A"}</p>
  </div>
);

// Helper for status badges
const StatusBadge = ({
  text,
  type,
}: {
  text: string;
  type: "trip" | "booking";
}) => {
  const isGood =
    (type === "booking" && text === "CONFIRMED") ||
    (type === "trip" && text === "COMPLETED");
  const isUpcoming = type === "trip" && text === "UPCOMING";
  const isCancelled = text?.includes("CANCELLED");

  let colorClasses = "bg-gray-100 text-gray-800"; // Default
  if (isGood) colorClasses = "bg-green-100 text-green-800";
  if (isUpcoming) colorClasses = "bg-blue-100 text-blue-800";
  if (isCancelled) colorClasses = "bg-red-100 text-red-800";

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full inline-block ${colorClasses}`}
    >
      {text.replace(/_/g, " ")}
    </span>
  );
};

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  // --- API Hooks ---
  const {
    data: trip,
    isLoading: isLoadingTrip,
    isError: isTripError,
  } = useGetTripDetails(tripId);

  const { data: vehicle, isLoading: isLoadingVehicle } = useGetVehicleDetails(
    trip?.vehicleId
  );

  // --- Loading & Error States ---
  if (isLoadingTrip) {
    return <CustomLoader />;
  }

  if (isTripError || !trip) {
    return (
      <main className="py-3 max-w-8xl mx-auto">
        <CustomBack />
        <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load trip details.</span>
        </div>
      </main>
    );
  }

  const primaryPhoto =
    vehicle?.photos?.find((p) => p.isPrimary)?.cloudinaryUrl ||
    vehicle?.photos?.[0]?.cloudinaryUrl;

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto space-y-6">
        {/* --- Header --- */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Trip Details</h1>
          <Link
            href={`/dashboard/bookings/${trip.bookingId}`} // Assumed link
            className="text-lg text-gray-600 mt-1 group inline-flex items-center gap-2"
          >
            Booking ID:
            <span className="font-semibold text-[#0096FF] group-hover:underline">
              {trip.bookingId}
            </span>
            <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-[#0096FF]" />
          </Link>
        </div>

        {/* --- Key Info Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard icon={CheckCircle} title="Status">
            <div className="space-y-3">
              <DetailItem
                label="Booking Status"
                value={<StatusBadge text={trip.bookingStatus} type="booking" />}
              />
              <DetailItem
                label="Trip Status"
                value={<StatusBadge text={trip.tripStatus} type="trip" />}
              />
            </div>
          </InfoCard>
          <InfoCard icon={Clock} title="Schedule">
            <DetailItem
              label="Start Time"
              value={format(
                new Date(trip.startDateTime),
                "MMM d, yyyy 'at' h:mm a"
              )}
            />
            <DetailItem
              label="End Time"
              value={format(
                new Date(trip.endDateTime),
                "MMM d, yyyy 'at' h:mm a"
              )}
            />
          </InfoCard>
          <InfoCard icon={DollarSign} title="Booking">
            <DetailItem label="Booking Type" value={trip.bookingTypeName} />
            <DetailItem
              label="Total Price"
              value={`₦${trip.totalPrice.toLocaleString()}`}
            />
          </InfoCard>
        </div>

        {/* --- People & Vehicle Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- People Card (UPDATED) --- */}
          <InfoCard icon={Users} title="Participants">
            {/* 2-Column Grid for Customer and Driver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer
                </h4>
                <DetailItem label="Name" value={trip.customerName} />
                <DetailItem label="Phone" value={trip.customerPhoneNumber} />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                  <User className="h-4 w-4" /> Driver
                </h4>
                <DetailItem label="Name" value={trip.driverName} />
                <DetailItem label="Phone" value={trip.driverPhoneNumber} />
              </div>
            </div>

            {/* Host & Agents Section (on new lines) */}
            <div className="pt-6 border-t mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Host
                  </h4>
                  <DetailItem label="Name" value={trip.hostName} />
                  <DetailItem label="Email" value={trip.hostEmail} />
                  <DetailItem label="Phone" value={trip.hostPhoneNumber} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Assigned Agents
                  </h4>
                  <DetailItem
                    label="Customer Agent"
                    value={trip.customerAgentName}
                  />
                  <DetailItem
                    label="Operations Agent"
                    value={trip.operationsAgentName}
                  />
                </div>
              </div>
            </div>
          </InfoCard>

          {/* --- Vehicle Card --- */}
          <InfoCard icon={Car} title="Vehicle Details">
            {isLoadingVehicle && <CustomLoader />}
            {vehicle && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  {primaryPhoto ? (
                    <img
                      src={primaryPhoto}
                      alt={vehicle.name}
                      className="w-full h-auto object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Car className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 space-y-4">
                  <Link
                    href={`/dashboard/vehicle-onboarding/${vehicle.id}`} // Assumed link
                    className="group"
                  >
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#0096FF] group-hover:underline">
                      {vehicle.name}
                    </h4>
                  </Link>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem
                      label="Vehicle ID"
                      value={vehicle.vehicleIdentifier}
                    />
                    <DetailItem
                      label="License Plate"
                      value={vehicle.licensePlateNumber}
                    />
                    <DetailItem label="Seats" value={vehicle.numberOfSeats} />
                    <DetailItem
                      label="Color ID"
                      value={vehicle.vehicleColorId}
                    />
                  </div>
                  {vehicle.features.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Features
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map((feature) => (
                          <span
                            key={feature.id}
                            className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-2 py-0.5"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                            {feature.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </InfoCard>
        </div>

        {/* --- Location Card --- */}
        <InfoCard icon={MapPin} title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="City" value={trip.city} />
            <DetailItem label="Pickup Location" value={trip.pickupLocation} />
          </div>
        </InfoCard>
      </main>
    </>
  );
}

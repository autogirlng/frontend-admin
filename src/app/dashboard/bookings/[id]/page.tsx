"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingInfo from "@/components/bookings/detail/BookingDetail";
import HostVehicleInfo from "@/components/bookings/detail/HostVehicleInfo";
import RejectionNotes from "@/components/bookings/detail/RejectionNotes";
import useBookingDetails from "@/hooks/useBookingDetails";

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { bookingDetails, assignedDrivers, isLoading, isError } = useBookingDetails(bookingId);

  if (isLoading) {
    return (
      <DashboardLayout title="Booking Information" currentPage="Bookings">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading booking details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !bookingDetails) {
    return (
      <DashboardLayout title="Booking Information" currentPage="Bookings">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Failed to load booking details</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Booking Information" currentPage="Bookings">
      <BookingInfo bookingDetails={bookingDetails} assignedDrivers={assignedDrivers} />
      <HostVehicleInfo bookingDetails={bookingDetails} />
      <RejectionNotes />
    </DashboardLayout>
  );
}

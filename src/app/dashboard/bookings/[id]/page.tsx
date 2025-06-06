import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingInfo from "@/components/bookings/detail/BookingDetail";
import HostVehicleInfo from "@/components/bookings/detail/HostVehicleInfo";
import RejectionNotes from "@/components/bookings/detail/RejectionNotes";

export default function BookingDetailPage() {
  return (
    <DashboardLayout title="Booking Information" currentPage="Bookings">
      <BookingInfo />
      <HostVehicleInfo />
      <RejectionNotes />
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingManagementSystem from "@/components/bookings/BookingManagementSystem";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Booking" currentPage="Bookings">
      <BookingManagementSystem />
    </DashboardLayout>
  );
}

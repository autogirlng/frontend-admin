import BookingReuseTable from "@/components/bookings/BookingReuseTable";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Booking" currentPage="Bookings">
      <BookingReuseTable />
    </DashboardLayout>
  );
}

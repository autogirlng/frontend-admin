import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingMetrics from "@/components/bookings/BookingMetricsCard";
import TripsTimeline from "@/components/bookings/TripsTimeline";
import BookingsTable from "@/components/bookings/BookingsTable";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Booking" currentPage="Bookings">
      <BookingMetrics />
      <TripsTimeline />
      <BookingsTable />
    </DashboardLayout>
  );
}

"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingMetrics from "@/components/bookings/BookingMetricsCard";
import TripsTimeline from "@/components/bookings/TripsTimeline";
import BookingsTable from "@/components/bookings/BookingsTable";
import { ModalProvider } from "@/context/ModalContext";
import ModalManager from "@/components/modals/ModalManager";

export default function DashboardPage() {
  return (
    <ModalProvider>
    <DashboardLayout title="Booking" currentPage="Bookings">
      <BookingMetrics />
      <TripsTimeline />
      <BookingsTable />
        <ModalManager />
    </DashboardLayout>
    </ModalProvider>
  );
}


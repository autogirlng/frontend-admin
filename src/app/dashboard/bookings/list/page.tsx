"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingManagementSystem from "@/components/bookings/BookingManagementSystem";
import { ModalProvider } from "@/context/ModalContext";
import ModalManager from "@/components/modals/ModalManager";

export default function DashboardPage() {
  return (
    <ModalProvider>
    <DashboardLayout title="Booking" currentPage="Bookings">
      <BookingManagementSystem />
        <ModalManager />
    </DashboardLayout>
    </ModalProvider>
  );
}


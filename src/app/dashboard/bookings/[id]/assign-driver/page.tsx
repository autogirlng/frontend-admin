"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AssignDriverLayout } from "@/components/bookings/assign-driver/AssignDriverLayout";

export default function AssignDriver() {

    return (
        <DashboardLayout title="Booking Information" currentPage="Bookings">
            <AssignDriverLayout />
        </DashboardLayout >
    );
}

// app/dashboard/page.tsx
"use client";

import React from "react";
import {
  useGetBookingStats,
  useGetPlatformStats,
  useGetVehicleFleetStats,
  useGetVehicleOnboardingStats,
} from "./useDashboardStats";
import { StatsCard } from "./StatsCard";
import CustomLoader from "@/components/generic/CustomLoader";
import {
  AlertCircle,
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  UserCheck,
  UserCog,
  Car,
  CheckCircle,
  Clock3,
  List,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Truck,
  Building,
  Wrench,
} from "lucide-react";
import { useSession } from "next-auth/react";

// Helper to format currency
const formatNaira = (amount: number = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function DashboardPage() {
  const { data: session } = useSession();

  // Fetch all stats concurrently
  const { data: bookingStats, isLoading: loadingBookings } =
    useGetBookingStats();
  const { data: platformStats, isLoading: loadingPlatform } =
    useGetPlatformStats();
  const { data: fleetStats, isLoading: loadingFleet } =
    useGetVehicleFleetStats();
  const { data: onboardingStats, isLoading: loadingOnboarding } =
    useGetVehicleOnboardingStats();

  const isLoading =
    loadingBookings || loadingPlatform || loadingFleet || loadingOnboarding;

  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  return (
    <main className="py-3 max-w-8xl mx-auto space-y-8">
      {isLoading && <CustomLoader />}

      {!isLoading && (
        <div className="space-y-8">
          {/* --- Booking & Revenue Stats --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Bookings & Revenue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Revenue"
                value={formatNaira(bookingStats?.totalBookingsPrice)}
                description={`${
                  bookingStats?.totalBookingsCount || 0
                } total bookings`}
                icon={DollarSign}
                iconColorClasses="bg-green-100 text-green-600"
              />
              <StatsCard
                title="Ongoing Revenue"
                value={formatNaira(bookingStats?.ongoingBookingsPrice)}
                description={`${
                  bookingStats?.ongoingBookingsCount || 0
                } ongoing bookings`}
                icon={Clock}
                iconColorClasses="bg-blue-100 text-blue-600"
              />
              <StatsCard
                title="Completed Revenue"
                value={formatNaira(bookingStats?.completedBookingsPrice)}
                description={`${
                  bookingStats?.completedBookingsCount || 0
                } completed bookings`}
                icon={ShoppingCart}
                iconColorClasses="bg-purple-100 text-purple-600"
              />
            </div>
          </section>

          {/* --- Platform Stats --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Platform Users
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard
                title="Total Customers"
                value={String(platformStats?.totalCustomers || 0)}
                icon={Users}
                iconColorClasses="bg-sky-100 text-sky-600"
              />
              <StatsCard
                title="Total Hosts"
                value={String(platformStats?.totalHosts || 0)}
                icon={Building}
                iconColorClasses="bg-indigo-100 text-indigo-600"
              />
              <StatsCard
                title="Total Drivers"
                value={String(platformStats?.totalDrivers || 0)}
                icon={Truck}
                iconColorClasses="bg-orange-100 text-orange-600"
              />
              <StatsCard
                title="Total Admins"
                value={String(platformStats?.totalAdmins || 0)}
                icon={UserCog}
                iconColorClasses="bg-gray-100 text-gray-600"
              />
            </div>
          </section>

          {/* --- Vehicle Stats (Combined) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Vehicle Fleet ({onboardingStats?.totalVehicles || 0} Total)
            </h2>
            {/* Onboarding Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Approved"
                value={String(onboardingStats?.totalApproved || 0)}
                icon={ShieldCheck}
                iconColorClasses="bg-green-100 text-green-600"
              />
              <StatsCard
                title="In Review"
                value={String(onboardingStats?.totalInReview || 0)}
                icon={Clock3}
                iconColorClasses="bg-yellow-100 text-yellow-600"
              />
              <StatsCard
                title="Draft"
                value={String(onboardingStats?.totalDrafts || 0)}
                icon={List}
                iconColorClasses="bg-gray-100 text-gray-600"
              />
              <StatsCard
                title="Rejected"
                value={String(onboardingStats?.totalRejected || 0)}
                icon={ShieldAlert}
                iconColorClasses="bg-red-100 text-red-600"
              />
            </div>
            {/* Fleet Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard
                title="Active (Live)"
                value={String(fleetStats?.activeVehicles || 0)}
                icon={Car}
                iconColorClasses="bg-blue-100 text-blue-600"
              />
              <StatsCard
                title="Inactive"
                value={String(fleetStats?.inactiveVehicles || 0)}
                icon={Shield}
                iconColorClasses="bg-gray-100 text-gray-600"
              />
              <StatsCard
                title="Unavailable"
                value={String(fleetStats?.unavailable || 0)}
                icon={AlertCircle}
                iconColorClasses="bg-red-100 text-red-600"
              />
              <StatsCard
                title="In Maintenance"
                value={String(fleetStats?.inMaintenance || 0)}
                icon={Wrench}
                iconColorClasses="bg-orange-100 text-orange-600"
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

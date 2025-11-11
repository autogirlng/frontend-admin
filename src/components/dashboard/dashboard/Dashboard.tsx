// app/dashboard/page.tsx
"use client";

import React from "react";
import {
  useGetBookingStats,
  useGetPlatformStats,
  useGetVehicleOnboardingStats,
  useGetWalletStats, // ✅ Import new hook
} from "./useDashboardStats"; // Adjust path
import { StatCard } from "./StatsCard"; // ✅ Import new card
import { PrimaryStatCard } from "./PrimaryStatCard"; // ✅ Import new card
import CustomLoader from "@/components/generic/CustomLoader";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  UserCog,
  Clock3,
  List,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Building,
  Wallet, // ✅ NEW Icon
  Briefcase, // ✅ NEW Icon
  Car, // ✅ NEW Icon
  AlertCircle, // ✅ NEW Icon
  Wrench, // ✅ NEW Icon
  Shield, // ✅ NEW Icon
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
  const { data: onboardingStats, isLoading: loadingOnboarding } =
    useGetVehicleOnboardingStats();
  const { data: walletStats, isLoading: loadingWallet } = useGetWalletStats(); // ✅ Use new hook

  const isLoading =
    loadingBookings || loadingPlatform || loadingOnboarding || loadingWallet;

  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  return (
    <main className="max-w-8xl mx-auto space-y-10">
      {/* --- Header --- */}
      <div>
        <p className="text-lg text-gray-600">
          Here's a high-level overview of the platform today.
        </p>
      </div>

      {isLoading && <CustomLoader />}

      {!isLoading && (
        <div className="space-y-10">
          {/* --- Section 1: Platform Revenue --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Autogirl Wallet
            </h2>
            <PrimaryStatCard
              title="Total Platform Earnings"
              value={formatNaira(walletStats?.totalPlatformEarnings)}
              icon={Wallet}
            >
              {/* This content is passed as children */}
              <StatCard
                title="From Host Vehicles"
                value={formatNaira(walletStats?.earningsFromHostVehicles)}
                icon={Briefcase}
                iconColorClasses="bg-indigo-100 text-indigo-600"
              />
              <StatCard
                title="From Autogirl Vehicles"
                value={formatNaira(walletStats?.earningsFromAutogirlVehicles)}
                icon={Car}
                iconColorClasses="bg-blue-100 text-blue-600"
              />
            </PrimaryStatCard>
          </section>

          {/* --- Section 2: Booking Revenue (GMV) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Booking Revenue (GMV)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Bookings Value"
                value={formatNaira(bookingStats?.totalBookingsPrice)}
                description={`${
                  bookingStats?.totalBookingsCount || 0
                } total bookings`}
                icon={DollarSign}
                iconColorClasses="bg-green-100 text-green-600"
              />
              <StatCard
                title="Ongoing Bookings Value"
                value={formatNaira(bookingStats?.ongoingBookingsPrice)}
                description={`${
                  bookingStats?.ongoingBookingsCount || 0
                } ongoing`}
                icon={Clock}
                iconColorClasses="bg-sky-100 text-sky-600"
              />
              <StatCard
                title="Completed Bookings Value"
                value={formatNaira(bookingStats?.completedBookingsPrice)}
                description={`${
                  bookingStats?.completedBookingsCount || 0
                } completed`}
                icon={ShoppingCart}
                iconColorClasses="bg-purple-100 text-purple-600"
              />
            </div>
          </section>

          {/* --- Section 3: Platform Users --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Platform Users
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Customers"
                value={String(platformStats?.totalCustomers || 0)}
                icon={Users}
                iconColorClasses="bg-blue-100 text-blue-600"
              />
              <StatCard
                title="Total Hosts"
                value={String(platformStats?.totalHosts || 0)}
                icon={Building}
                iconColorClasses="bg-indigo-100 text-indigo-600"
              />
              <StatCard
                title="Total Drivers"
                value={String(platformStats?.totalDrivers || 0)}
                icon={Truck}
                iconColorClasses="bg-orange-100 text-orange-600"
              />
              <StatCard
                title="Total Admins"
                value={String(platformStats?.totalAdmins || 0)}
                icon={UserCog}
                iconColorClasses="bg-gray-200 text-gray-600"
              />
            </div>
          </section>

          {/* --- Section 4: Vehicle Fleet --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Vehicle Fleet ({onboardingStats?.totalVehicles || 0} Total)
            </h2>
            {/* Onboarding Status */}
            <h3 className="text-lg font-medium text-gray-600 mb-3">
              Onboarding Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Approved"
                value={String(onboardingStats?.totalApproved || 0)}
                icon={ShieldCheck}
                iconColorClasses="bg-green-100 text-green-600"
              />
              <StatCard
                title="In Review"
                value={String(onboardingStats?.totalInReview || 0)}
                icon={Clock3}
                iconColorClasses="bg-yellow-100 text-yellow-600"
              />
              <StatCard
                title="Draft"
                value={String(onboardingStats?.totalDrafts || 0)}
                icon={List}
                iconColorClasses="bg-gray-200 text-gray-600"
              />
              <StatCard
                title="Rejected"
                value={String(onboardingStats?.totalRejected || 0)}
                icon={ShieldAlert}
                iconColorClasses="bg-red-100 text-red-600"
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

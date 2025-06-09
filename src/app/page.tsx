"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/use_auth";
import { useAppSelector } from "@/lib/hooks";
import { FullPageSpinner } from "@/components/shared/spinner";
import useDashboard from "@/hooks/useDashboard";
import DashboardCard from "@/components/cards/DashboardCard";
import Icons from "@/components/shared/icons";
import { useState } from "react";
import BookingCarousel from "@/components/dashboard/vehicle-slider/BookingCarousel";
import MostBookedVehicleCarousel from "@/components/dashboard/vehicle-slider/MostBookedVehiclesCarousel";
import EmptyState from "@/components/EmptyState";

const HomePage = () => {
  const { isUserLoading } = useAuth();
  const { isLoading: userSliceLoading } = useAppSelector((state) => state.user);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (selectedFilters: Record<string, string>) => {
    setFilters(selectedFilters);
  };
  const {
    data,
    isError,
    isLoading: dashboardLoading,
  } = useDashboard({
    filters: filters,
  });

  if (isUserLoading || userSliceLoading || isError) {
    return <FullPageSpinner />;
  }

  return (
    <DashboardLayout title="Dashboard" currentPage="Dashboard">
      <div className="flex flex-col space-y-3 ">
        {/* Bookings */}
        <DashboardCard
          title="Bookings"
          showFilter={true}
          onChange={handleFilterChange}
          loading={dashboardLoading}
          error={isError}
          icon={Icons.ic_ticket}
          metrics={[
            {
              title: "Total Bookings",
              tooltip: "Total number of booking made on the platform till date",
              value: data?.booking?.total?.count || 0,
              sub: `${
                // Ensure 'naira' is accessed safely before toLocaleString()
                data?.booking?.total?.naira
                  ? `₦${data.booking.total.naira.toLocaleString()}`
                  : "₦0"
              } • ${
                // Ensure 'rides' is accessed safely before toLocaleString()
                data?.booking?.total?.rides
                  ? `${data.booking.total.rides.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: 30,
            },
            {
              title: "Ongoing Bookings",
              value: data?.booking?.ongoing?.count || 0,
              tooltip: "Bookings that are currently in progress or active.",
              sub: `${
                data?.booking?.ongoing?.naira
                  ? `₦${data.booking.ongoing.naira.toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.ongoing?.rides
                  ? `${data.booking.ongoing.rides.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: 40,
            },
            {
              title: "Completed Bookings",
              tooltip:
                "Bookings that have successfully be completed or concluded.",
              value: data?.booking?.completed?.count || 0,
              sub: `${
                data?.booking?.completed?.naira
                  ? `₦${data.booking.completed.naira.toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.completed?.rides
                  ? `${data.booking.completed.rides.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: 50,
            },
            {
              title: "Cancelled Bookings",
              tooltip:
                "Bookings that were canceled either by host,customer or admin.",
              value: data?.booking?.cancelled?.count || 0,
              sub: `${
                // This one specifically accesses 'totalEarnings.naira'
                data?.booking?.cancelled?.naira
                  ? `₦${data.booking.cancelled.naira.toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.cancelled.rides
                  ? `${data.booking.cancelled.rides.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: 40,
            },
          ]}
        />

        {/* Platform */}
        <DashboardCard
          title="Platform"
          onChange={handleFilterChange}
          loading={dashboardLoading}
          error={isError}
          icon={Icons.ic_user_account}
          metrics={[
            {
              tooltip:
                "Individuals or businesses who list their vehicles on the platform for customers to book. They manage availability, pricing, and vehicle status.",
              title: "Hosts",
              value: data?.platformUsers?.totalHosts || 0,
            },
            {
              title: "Customers",
              tooltip:
                "Users who book vehicles for personal or business use. They can browse listings, make payments, and track their bookings through the platform.",
              value: data?.platformUsers?.totalCustomers || 0,
            },
            {
              title: "Admins",
              tooltip:
                "Internal team members who manage platform operations, overseeing bookings, fleet status, user accounts, and platform compliance.",
              value: data?.platformUsers?.totalAdmins || 0,
            },
            {
              title: "Drivers",
              tooltip:
                "Personnel assigned for transporting the vehicles or assisting with pickups and drop-offs",
              value: data?.platformUsers?.totalDrivers || 0,
            },
          ]}
          showFilter={true}
        />

        {/* Fleet */}
        <DashboardCard
          title="Fleet"
          onChange={handleFilterChange}
          loading={dashboardLoading}
          error={isError}
          icon={Icons.ic_car}
          metrics={[
            {
              title: "Total Vehicles",
              tooltip:
                "The complete number of vehicles onboarded to the platform, including all statuses (active, inactive, suspended, maintenance, etc.).",
              value: data?.fleet?.totalVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.totalVehicles / data.fleet.totalVehicles) * 100
                  )
                : 0,
            },
            {
              title: "Active Vehicles",
              tooltip:
                "Vehicles currently available for booking by customers. These listings have passed review and meet all platform requirements.",
              value: data?.fleet?.activeVehicles || 0,
              progress: data?.fleet?.activeVehicles
                ? Math.min(
                    100,
                    (data.fleet.activeVehicles / data.fleet.totalVehicles) * 100
                  )
                : 0,
            },
            {
              title: "Inactive Vehicles",
              tooltip:
                "Vehicles temporarily unavailable for booking. These may be turned off by the host/admin or awaiting further updates.",
              value: data?.fleet?.inactiveVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.inactiveVehicles / data.fleet.totalVehicles) *
                      100
                  )
                : 0,
            },
            {
              title: "Suspended Vehicles",
              tooltip:
                "Vehicles removed from customer view due to violations, disputes, or issues pending resolution by the admin team.",
              value: data?.fleet?.suspendedVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.suspendedVehicles / data.fleet.totalVehicles) *
                      100
                  )
                : 0,
            },
          ]}
          showFilter={true}
        />

        <DashboardCard
          title="Finance"
          onChange={handleFilterChange}
          loading={dashboardLoading}
          error={isError}
          icon={Icons.ic_wallet}
          metrics={[
            {
              title: "Total Bookings",
              tooltip:
                " Monetized count of all bookings made via the platform.",
              value: data?.finance?.totalBookings || 0,
            },
            {
              title: "Total Host Payments",
              tooltip:
                "The cumulative amount paid to hosts from completed bookings.",
              value: data?.finance?.hostPayments
                ? `₦${data.finance.hostPayments.toLocaleString()}`
                : "₦0",
            },
            {
              title: "Muvment Revenue",
              tooltip:
                "Total revenue generated from commissions, fees, and charges.",
              value: data?.finance?.autogirlRevenue
                ? `₦${data.finance.autogirlRevenue.toLocaleString()}`
                : "₦0",
            },
            {
              title: "Customer Wallet Balance",
              tooltip:
                "Aggregate balance currently held in all customer wallets.",
              value: data?.finance?.customerWalletBalance
                ? `₦${data.finance.customerWalletBalance.toLocaleString()}`
                : "₦0",
            },
            {
              title: "Host Wallet Balance",
              tooltip: "Aggregate balance currently held in all host wallets.",
              value: data?.finance?.hostWalletBalance
                ? `₦${data.finance.hostWalletBalance.toLocaleString()}`
                : "₦0",
            },
          ]}
          showFilter={true}
        />
        <BookingCarousel
          isLoading={dashboardLoading}
          vehicles={data?.recentBookings ?? []}
        />
        <MostBookedVehicleCarousel
          isLoading={dashboardLoading}
          vehicles={data?.mostBookedVehicles ?? []}
        />
      </div>
    </DashboardLayout>
  );
};

export default HomePage;

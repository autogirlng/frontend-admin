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

const Home = () => {
  const { isUserLoading } = useAuth();
  const { user, isLoading: userSliceLoading } = useAppSelector(
    (state) => state.user
  );
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (selectedFilters: Record<string, string[]>) =>
    setFilters(selectedFilters);
  const {
    data,
    isError,
    isLoading: dashboardLoading,
  } = useDashboard({
    filters: filters,
  });

  if (isUserLoading || userSliceLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  return (
    <DashboardLayout title="Dashboard" currentPage="Dashboard">
      <div className="flex flex-col space-y-3 ">
        {/* Bookings */}
        <DashboardCard
          title="Bookings"
          // setFilters={setFilters}
          // filters={filters}
          onChange={handleFilterChange}
          loading={dashboardLoading}
          error={isError}
          icon={Icons.ic_ticket}
          metrics={[
            {
              title: "Total Bookings",
              value: data?.booking?.totalBookings || 0,
              sub: `${
                data?.booking?.totalEarnings
                  ? `₦${data.booking.totalEarnings.toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.totalBookings
                  ? `${data.booking.totalBookings.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: data?.booking?.totalBookings
                ? Math.min(
                    100,
                    (data.booking.completedBookings /
                      data.booking.totalBookings) *
                      100
                  )
                : 0,
            },
            {
              title: "Ongoing Bookings",
              value: data?.booking?.ongoingBookings || 0,
              sub: `${
                data?.booking?.totalEarnings
                  ? `₦${(
                      (data.booking.totalEarnings /
                        data.booking.totalBookings) *
                      data.booking.ongoingBookings
                    ).toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.ongoingBookings
                  ? `${data.booking.ongoingBookings.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: data?.booking?.totalBookings
                ? Math.min(
                    100,
                    (data.booking.ongoingBookings /
                      data.booking.totalBookings) *
                      100
                  )
                : 0,
            },
            {
              title: "Completed Bookings",
              value: data?.booking?.completedBookings || 0,
              sub: `${
                data?.booking?.totalEarnings
                  ? `₦${data.booking.totalEarnings.toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.completedBookings
                  ? `${data.booking.completedBookings.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: data?.booking?.totalBookings
                ? Math.min(
                    100,
                    (data.booking.completedBookings /
                      data.booking.totalBookings) *
                      100
                  )
                : 0,
            },
            {
              title: "Cancelled Bookings",
              value: data?.booking?.cancelledBookings || 0,
              sub: `${
                data?.booking?.totalEarnings
                  ? `₦${(
                      (data.booking.totalEarnings /
                        data.booking.totalBookings) *
                      data.booking.cancelledBookings
                    ).toLocaleString()}`
                  : "₦0"
              } • ${
                data?.booking?.cancelledBookings
                  ? `${data.booking.cancelledBookings.toLocaleString()} rides`
                  : "0 rides"
              }`,
              progress: data?.booking?.totalBookings
                ? Math.min(
                    100,
                    (data.booking.cancelledBookings /
                      data.booking.totalBookings) *
                      100
                  )
                : 0,
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
            { title: "Hosts", value: data?.platformUsers?.totalHosts || 0 },
            {
              title: "Customers",
              value: data?.platformUsers?.totalCustomers || 0,
            },
            { title: "Admins", value: data?.platformUsers?.totalAdmins || 0 },
            { title: "Drivers", value: data?.platformUsers?.totalDrivers || 0 },
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
              value: data?.fleet?.totalVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.adminOnboardedVehicles /
                      data.fleet.totalVehicles) *
                      100
                  )
                : 0,
            },
            {
              title: "Admin Onboarded",
              value: data?.fleet?.adminOnboardedVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.adminOnboardedVehicles /
                      data.fleet.totalVehicles) *
                      100
                  )
                : 0,
            },
            {
              title: "Booked",
              value: data?.fleet?.bookedVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.bookedVehicles / data.fleet.totalVehicles) * 100
                  )
                : 0,
            },
            {
              title: "Inactive",
              value: data?.fleet?.inactiveVehicles || 0,
              progress: data?.fleet?.totalVehicles
                ? Math.min(
                    100,
                    (data.fleet.inactiveVehicles / data.fleet.totalVehicles) *
                      100
                  )
                : 0,
            },
          ]}
        />

        {/* Finance */}
        <DashboardCard
          title="Finance"
          onChange={handleFilterChange}
          loading={dashboardLoading}
          error={isError}
          icon={Icons.ic_wallet}
          metrics={[
            {
              title: "Total Bookings",
              value: data?.finance?.totalBookings || 0,
            },
            {
              title: "Total Host Payments",
              value: data?.finance?.hostPayments
                ? `₦${data.finance.hostPayments.toLocaleString()}`
                : "₦0",
            },
            {
              title: "Muvment Revenue",
              value: data?.finance?.autogirlRevenue
                ? `₦${data.finance.autogirlRevenue.toLocaleString()}`
                : "₦0",
            },
            {
              title: "Customer Wallet Balance",
              value: data?.finance?.customerWalletBalance
                ? `₦${data.finance.customerWalletBalance.toLocaleString()}`
                : "₦0",
            },
            {
              title: "Host Wallet Balance",
              value: data?.finance?.hostWalletBalance
                ? `₦${data.finance.hostWalletBalance.toLocaleString()}`
                : "₦0",
            },
          ]}
          showFilter={true}
        />
        <BookingCarousel vehicles={data?.recentBookings ?? []} />
        <MostBookedVehicleCarousel vehicles={data?.mostBookedVehicles ?? []} />
      </div>
    </DashboardLayout>
  );
};

export default Home;

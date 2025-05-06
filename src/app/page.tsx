"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FaTicket } from "react-icons/fa6";
import PerfomanceCard from "@/components/dashboard/PerfomanceCard";
import BookingsCarousel from "@/components/dashboard/BookingCarousel";
import MostBookedVehicles from "@/components/dashboard/BookedVehicles";
import { LocalRoute } from "@/utils/LocalRoutes";
import { useAuth } from "@/hooks/use_auth";
import { useAppSelector } from "@/lib/hooks";
import { FullPageSpinner } from "@/components/shared/spinner";
const Home = () => {
  // const { isUserLoading } = useAuth();
  // const { user, isLoading: userSliceLoading } = useAppSelector(
  //   (state) => state.user
  // );

  // isUserLoading || userSliceLoading ? (
  //   <FullPageSpinner />
  // ) : (
  return (
    <DashboardLayout title="Dashboard" currentPage="Dashboard">
      <div className="flex flex-col gap-3  ">
        {/* Display user-specific information */}

        {/* Perfomance Card */}
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        <PerfomanceCard path={LocalRoute.bookingPerfomance} />
        {/* Bookings */}
        <SectionHeader title="Bookings" />
        <BookingsCarousel />
        {/* Most Book Vehicles  */}
        <MostBookedVehicles />
      </div>
    </DashboardLayout>
  );
};

export default Home;

const SectionHeader = ({ title = "Platform Activity", showFilter = true }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#101928]">
        <FaTicket className="text-[#0673FF]" />
        <span>{title}</span>
      </div>

      {showFilter && (
        <div className=" flex items-center justify-center space-x-2  px-2 py-1 text-sm text-[#344054]">
          View All
        </div>
      )}
    </div>
  );
};

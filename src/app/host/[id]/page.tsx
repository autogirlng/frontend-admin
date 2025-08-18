"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { FullPageSpinner } from "@/components/shared/spinner";
import useHostDetails, { HostProfile } from "@/hooks/use_fetch_host"; // Import the new hook (default import)
import { format } from "date-fns";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import { LocalRoute } from "@/utils/LocalRoutes";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import Icons from "@/utils/Icon";
import AdminProfileCard from "@/components/settings/AdminProfile";
import DashboardCard from "@/components/cards/DashboardCard";
import ExploreVehicleCard from "@/components/dashboard/avaliability/VehicleCard";
import ReviewCard from "@/components/ReviewCard";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
import HostProfileCard from "@/components/HostProfileCard";
import HostBookingsTable from "@/components/tables/HostBookings/Table";
import BackLink from "@/components/BackLink";

export default function HostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const hostId = params.id as string; // Get the host ID from the URL

  const {
    data: hostDetails,
    isLoading,
    isError,
    refetch,
  } = useHostDetails({ hostId }); // Use the new hook with object parameter

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError || !hostDetails || !hostDetails.host) {
    // Handle error state or no data
    return (
      <DashboardLayout title="Host" currentPage="Host">
        <div className="flex justify-center items-center h-full">
          <EmptyState
            image={ImageAssets.icons.errorState}
            title="Error Occurred"
            message="Error occurred while fetching Host"
            buttonAction={refetch}
            buttonText="Try Again"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Host" currentPage="Host">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11 ">
        <BackLink />
        <DashboardSectionTitle icon={Icons.ic_host} title="Host Details" />

        <HostProfileCard hostProfile={hostDetails.host} />

        <DashboardCard
          title="Host Activity"
          onChange={() => {}}
          icon={Icons.ic_host_Admin}
          error={false}
          loading={isLoading}
          showFilter={false}
          metrics={[
            {
              title: "Completed Bookings",
              value: hostDetails.activity?.completedBookings || 0,
            },
            {
              title: "Unpaid Bookings",
              value: hostDetails.activity?.unpaidBookings || 0,
            },
            {
              title: "Canceled Bookings",
              value: hostDetails.activity?.canceledBookings || 0,
            },
            {
              title: "Ongoing Bookings",
              value: hostDetails.activity?.ongoingBookings || 0,
            },
            {
              title: "Pending Bookings",
              value: hostDetails.activity?.pendingBookings || 0,
            },
            {
              title: "Total number of Trips",
              value: hostDetails.activity?.totalTrips || 0,
            },
            {
              title: "Last Login",
              value: hostDetails.activity?.lastLogin
                ? format(
                    new Date(hostDetails.activity.lastLogin),
                    "MMM d, yyyy"
                  )
                : "N/A",
            },
          ]}
        />

        <h4 className="capitalize text-base text-grey-600">bookings</h4>
        <HostBookingsTable items={hostDetails?.bookings} />
        <h4 className="capitalize text-base text-grey-600">
          FEEDBACK AND REVIEWS
        </h4>
        {hostDetails.reviews && hostDetails.reviews.length > 0 ? (
          hostDetails.reviews.map((reviewItem) => (
            <ReviewCard key={reviewItem.id} review={reviewItem} />
          ))
        ) : (
          <EmptyState
            image={ImageAssets.icons.emptyReviewState}
            message="Reviews will show here."
            title="No Reviews Yet"
          />
        )}

        <h4 className="capitalize text-base text-grey-600">Vehicles</h4>
        {hostDetails.vehicles && hostDetails.vehicles.length > 0 ? (
          hostDetails.vehicles.map((vehicleItem) => (
            <ExploreVehicleCard
              key={vehicleItem.name}
              vehicleId={vehicleItem.name}
              showAllFilters={false}
              isDisplayList={true}
              vehicleImages={vehicleItem.image ? [vehicleItem.image] : []}
              name={vehicleItem.name}
              type={vehicleItem.details.vehicleType}
              location={vehicleItem.details.location}
              dailyPrice={120}
              extraHoursFee={15}
              currency={"NGN"}
              vehicleDetails={[
                { label: "Type", value: vehicleItem.details.vehicleType },
                { label: "Make", value: vehicleItem.details.make },
                { label: "Color", value: vehicleItem.details.color || "N/A" },
                {
                  label: "Capacity",
                  value:
                    vehicleItem.details.seatingCapacity?.toString() || "N/A",
                },
              ]}
            />
          ))
        ) : (
          <EmptyState
            image={ImageAssets.icons.emptyBookingState}
            message="Reviews will show here."
            title="No Reviews Yet"
          />
        )}
      </div>
    </DashboardLayout>
  );
}

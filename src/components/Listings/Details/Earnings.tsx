import ActivityCard from "@/components/shared/activityCard";
import { EarningsStatistics } from "@/utils/types";

type Props = { statistics: EarningsStatistics | null | undefined };

export default function ListingDetailsEarnings({ statistics }: Props) {
  return (
    <div className="space-y-7">
      <p className="text-base 3xl:text-xl text-grey-700 font-medium">
        Earnings
      </p>
      <div className="flex sm:grid sm:grid-cols-2 gap-1.5 overflow-x-auto *:w-full *:text-nowrap">
        <ActivityCard
          primary
          title="Revenue Generated"
          value={`${statistics?.totalRevenue || "-"}`}
        />
        <ActivityCard
          title="Number Of Customers"
          value={`${statistics?.numberOfCustomers || "-"}`}
        />
        <ActivityCard
          title="Bookings Completed"
          value={`${statistics?.bookingsCompleted || "-"}`}
        />
        <ActivityCard
          title="Cancelled Bookings"
          value={`${statistics?.cancelledBookings || "-"}`}
        />
      </div>
    </div>
  );
}

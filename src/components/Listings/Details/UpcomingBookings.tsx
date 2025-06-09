import cn from "classnames";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import EmptyState from "@/components/EmptyState";
import useVehicleUpcomingBooking from "@/components/Listings/Details/hooks/useVehicleUpcomingBooking";
import Icons from "@/components/shared/icons";
import { Spinner } from "@/components/shared/spinner";

type Props = { vehicleId: string };

type BookingDataProps = {
  title: string;
  value: string;
};

export default function ListingDetailsUpcomingBookings({ vehicleId }: Props) {
  // const bookingData = [
  //   {
  //     guestName: "Chioma Nwosu",
  //     startDate: "12 Aug|6:30 PM",
  //     endDate: "12 Aug|6:30 PM",
  //   },
  //   {
  //     guestName: "Chioma Nwosu",
  //     startDate: "12 Aug|6:30 PM",
  //     endDate: "12 Aug|6:30 PM",
  //   },
  //   {
  //     guestName: "Chioma Nwosu",
  //     startDate: "12 Aug|6:30 PM",
  //     endDate: "12 Aug|6:30 PM",
  //   },
  //   {
  //     guestName: "Chioma Nwosu",
  //     startDate: "12 Aug|6:30 PM",
  //     endDate: "12 Aug|6:30 PM",
  //   },
  // ];

  const { upcomingBookings, isError, error, isLoading } =
    useVehicleUpcomingBooking(vehicleId);

  return (
    <div className="hidden lg:block bg-grey-50 w-full max-w-[320px] xl:max-w-[360px] 3xl:max-w-[500px] absolute right-0 top-[86px] min-h-screen h-auto px-4 py-[86px]">
      <DashboardSectionTitle icon={Icons.ic_ticket} title="Upcoming Bookings" />

      <div className="space-y-2">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p>something went wrong</p>
        ) : upcomingBookings?.length > 0 ? (
          upcomingBookings?.map((data, index) => {
            return (
              <BookingCard
                key={index}
                active={index === 0}
                guestName={data.guestName}
                startDate={data.startDate}
                endDate={data.endDate}
              />
            );
          })
        ) : (
          <EmptyState
            image="/icons/empty_booking_state.png"
            title="No upcoming bookings"
            imageSize="w-[90px] 2xl:w-[165px]"
          />
        )}
      </div>
    </div>
  );
}

const BookingCard = ({
  guestName,
  startDate,
  endDate,
  active,
}: {
  guestName: string;
  startDate: string;
  endDate: string;
  active: boolean;
}) => (
  <div
    className={cn(
      "rounded-3xl px-5 3xl:px-10 py-3 3xl:py-6 bg-white space-y-2",
      active ? "border border-warning-400 text-grey-900" : "text-grey-800"
    )}
  >
    {active && (
      <p className="text-warning-400 text-sm 3xl:text-base">Up Next</p>
    )}

    <div className="flex justify-between items-center gap-3">
      <BookingData title="Guest Name" value={guestName} />
      <BookingData title="Start date" value={startDate} />
      <BookingData title="End date" value={endDate} />
    </div>
  </div>
);

const BookingData = ({ title, value }: BookingDataProps) => (
  <div className={cn("text-xs 3xl:text-sm !font-medium")}>
    <p className="">{title}</p>
    <p className="">{value}</p>
  </div>
);

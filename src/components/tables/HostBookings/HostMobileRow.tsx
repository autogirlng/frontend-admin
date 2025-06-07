import { format } from "date-fns";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import { MobileTableCell } from "@/components/TableCell";
import { HostBookingTable } from "@/types/Bookings";
import { LocalRoute } from "@/utils/LocalRoutes";
import Link from "next/link";

export default function HostBookingMobileRow({
  items,
}: {
  items: HostBookingTable;
}) {
  return (
    <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
      <Popup
        trigger={<MoreButton />}
        content={
          <>
            <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
            <ul className="space-y-2 *:py-2">
              {/* View User - Always available */}
              <li>
                <Link
                  href={`${LocalRoute.bookingPage}/${items.id}`}
                  className="!text-xs 3xl:!text-base"
                >
                  View booking
                </Link>
              </li>
            </ul>
          </>
        }
      />
      <MobileTableCell title="Booking ID" content={items?.id ?? "-"} />
      <MobileTableCell
        title="Pickup Address"
        content={`${items?.pickupAddress ?? "-"} `}
      />

      <MobileTableCell title="Pickup Time" content={items?.pickupTime ?? "-"} />

      <MobileTableCell
        title="Number Of Trips"
        content={items?.numberOfTrips.toString() ?? "-"}
      />
      <MobileTableCell
        title="Drop Off Address"
        content={items?.dropOffAddress ?? "-"}
      />

      <MobileTableCell
        title="Drop Off Time"
        content={
          items?.dropOffTime
            ? format(new Date(items?.dropOffTime), "MMM d ,yyyy")
            : ""
        }
      />

      <MobileTableCell
        title="Ride Status"
        content={items?.RideStatus}
        isBadge
      />
    </div>
  );
}

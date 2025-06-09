import Link from "next/link";
import React, { useState } from "react"; // Import useState
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";
import { LocalRoute } from "@/utils/LocalRoutes";
import { HostBookingTable } from "@/types/Bookings";
export default function HostBookingDesktopRow({
  items,
}: {
  items: HostBookingTable;
}) {
  // State to control the visibility of the BlockUserModal
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  return (
    <tr>
      {/* Host ID */}
      <TableCell
        content={items?.id}
        className="!text-grey-900 text-wrap !font-medium"
      />

      {/* Full name (First Name + Last Name or Business Name) */}
      <TableCell
        className="text-wrap"
        content={`${items?.pickupAddress ?? ""} `}
      />

      {/* Phone Number */}
      <TableCell
        className="text-wrap"
        content={
          items?.pickupTime
            ? format(new Date(items?.pickupTime), "MMM d, h:mma") // Changed MMM d,PPPP h:mma to MMM d, h:mma as per previous fix attempt
            : "-"
        }
      />

      {/* Vehicles */}
      <TableCell content={items?.numberOfTrips?.toString() ?? "-"} />

      {/* Total Bookings - Corrected to totalBookings */}
      <TableCell content={items?.dropOffAddress ?? "-"} />

      {/* Total Rides */}
      <TableCell
        content={
          items?.dropOffTime
            ? format(new Date(items?.dropOffTime), "MMM d, h:mma") // Changed MMM d,PPPP h:mma to MMM d, h:mma as per previous fix attempt
            : "-"
        }
      />

      {/* Status - Re-applied dynamic styling */}
      <TableCell content={items?.RideStatus} isBadge type="table" />

      {/* Actions */}
      <td>
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
      </td>
    </tr>
  );
}

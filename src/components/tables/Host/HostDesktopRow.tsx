import Link from "next/link";
import React, { useState } from "react"; // Import useState
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";
import { LocalRoute } from "@/utils/LocalRoutes";
import BlockUserModal from "./Details/modals/deactivateHostModal";
// Helper function to get status-based styling for the badge
const getStatusClasses = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";
    case "banned":
      return "bg-red-100 text-red-700";
    case "inactive":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function HostDesktopRow({ items }: { items: Member }) {
  const hostId = items?.id;
  const hostStatus = items?.status?.toLowerCase();

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
        content={`${items?.firstName ?? ""} ${items?.lastName ?? ""}`}
      />

      {/* Phone Number */}
      <TableCell className="text-wrap" content={items?.phoneNumber ?? "-"} />

      {/* Vehicles */}
      <TableCell content={items?.vehicles?.toString() ?? "-"} />

      {/* Total Bookings - Corrected to totalBookings */}
      <TableCell content={items?.totalBooking?.toString() ?? "-"} />

      {/* Total Rides */}
      <TableCell content={items?.totalRides?.toString() ?? "-"} />

      {/* Last Login */}
      <TableCell
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d, h:mma") // Changed MMM d,PPPP h:mma to MMM d, h:mma as per previous fix attempt
            : "-"
        }
      />

      {/* Last Booked */}
      <TableCell
        content={
          items?.lastBooked
            ? format(new Date(items?.lastBooked), "MMM d, h:mma") // Changed MMM d,PPPP h:mma to MMM d, h:mma as per previous fix attempt
            : "-"
        }
      />

      {/* Location */}
      <TableCell content={items?.location ?? "-"} />

      {/* Status - Re-applied dynamic styling */}
      <TableCell
        content={items?.status}
        isBadge
        type="table" // Assuming 'table' is a valid type for TableCell for styling badges
        className={`${getStatusClasses(
          items?.status
        )} px-2 py-1 rounded-full text-xs font-semibold`}
      />

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
                    href={`${LocalRoute.hostPage}/${hostId}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    View User
                  </Link>
                </li>

                {/* Block User - For Active hosts */}
                {hostStatus === "active" && (
                  <li>
                    {/* BlockUserModal will be triggered by this button */}
                    <BlockUserModal
                      openModal={isBlockModalOpen}
                      handleModal={setIsBlockModalOpen}
                      userId={hostId} // Pass the ID of the current host to the modal
                      trigger={
                        <button
                          onClick={() => setIsBlockModalOpen(true)}
                          className="!text-xs 3xl:!text-base text-left w-full"
                          type="button" // Important for accessibility and form submission prevention
                        >
                          Block User
                        </button>
                      }
                    />
                  </li>
                )}

                {/* Unblock User - For Banned/Blocked hosts */}
                {(hostStatus === "banned" || hostStatus === "inactive") && (
                  <li>
                    <Link
                      href={`/hosts/${hostId}/unblock`} // Example unblock route
                      className="!text-xs 3xl:!text-base"
                    >
                      Unblock User
                    </Link>
                  </li>
                )}

                {/* Resend Logins - Often for inactive or when requested */}
                {hostStatus !== "active" && (
                  <li>
                    <Link
                      href={`/hosts/${hostId}/resend-logins`} // Example resend logins route
                      className="!text-xs 3xl:!text-base"
                    >
                      Resend Logins
                    </Link>
                  </li>
                )}
              </ul>
            </>
          }
        />
      </td>
    </tr>
  );
}

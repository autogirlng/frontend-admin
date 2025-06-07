// HostDesktopRow.tsx
"use client"; // Ensure this is a client component

import Link from "next/link";
import React, { useState } from "react";
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";
import { LocalRoute } from "@/utils/LocalRoutes";
import BlockUserModal from "./Details/modals/deactivateHostModal"; // Assuming this path is correct
import UnblockHostModal from "./Details/modals/activateHostModal";
import { useSendLoginDetails } from "./hooks/useHostHooks";
import { FullPageSpinner, Spinner } from "@/components/shared/spinner";

export default function HostDesktopRow({ items }: { items: Member }) {
  const hostId = items?.id;
  const hostStatus = items?.status?.toLowerCase();
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false); // New state for unblock modal

  const { mutate: sendLoginDetailsMutation, isPending: isSendingLoginDetails } =
    useSendLoginDetails();

  // Handler for sending login details
  const handleSendLoginDetails = () => {
    if (hostId) {
      sendLoginDetailsMutation({ hostId });
    }
  };

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
            ? format(new Date(items?.lastLogin), "MMM d, h:mma")
            : "-"
        }
      />

      {/* Last Booked */}
      <TableCell
        content={
          items?.lastBooked
            ? format(new Date(items?.lastBooked), "MMM d, h:mma")
            : "-"
        }
      />

      {/* Location */}
      <TableCell content={items?.location ?? "-"} />

      {/* Status - Re-applied dynamic styling */}
      <TableCell content={items?.status} isBadge type="table" />

      {/* Actions */}
      <td>
        {/* Conditional rendering for MoreButton or Spinner */}
        {isSendingLoginDetails ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <Popup
            trigger={<MoreButton />}
            content={
              <>
                <p className="!text-xs 3xl:!text-base !font-semibold">
                  Actions
                </p>
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
                      <BlockUserModal
                        openModal={isBlockModalOpen}
                        handleModal={setIsBlockModalOpen}
                        userId={hostId}
                        trigger={
                          <button
                            onClick={() => setIsBlockModalOpen(true)}
                            className="!text-xs 3xl:!text-base text-left w-full"
                            type="button"
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
                      <UnblockHostModal // Use the new UnblockHostModal
                        openModal={isUnblockModalOpen}
                        handleModal={setIsUnblockModalOpen}
                        userId={hostId}
                        trigger={
                          <button
                            onClick={() => setIsUnblockModalOpen(true)}
                            className="!text-xs 3xl:!text-base text-left w-full"
                            type="button"
                          >
                            Unblock User
                          </button>
                        }
                      />
                    </li>
                  )}

                  {/* Resend Logins - Often for inactive or when requested */}
                  {hostStatus !== "active" && (
                    <li>
                      <button
                        onClick={handleSendLoginDetails} // Call the new handler
                        className="!text-xs 3xl:!text-base text-left w-full"
                        type="button"
                        disabled={isSendingLoginDetails} // Disable while sending
                      >
                        Resend Logins
                      </button>
                    </li>
                  )}
                </ul>
              </>
            }
          />
        )}
      </td>
    </tr>
  );
}

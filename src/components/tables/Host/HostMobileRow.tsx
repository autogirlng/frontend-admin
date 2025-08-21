// HostMobileRow.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import { MobileTableCell } from "@/components/TableCell";
import { LocalRoute } from "@/utils/LocalRoutes";
import BlockUserModal from "./Details/modals/deactivateHostModal";
import UnblockHostModal from "./Details/modals/activateHostModal";
import { useSendLoginDetails } from "./hooks/useHostHooks";
import { Spinner } from "@/components/shared/spinner"; // Import Spinner for loading state

export default function HostMobileRow({ items }: { items: Member }) {
  const hostId = items?.id;
  const hostStatus = items?.status?.toLowerCase();
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);

  const { mutate: sendLoginDetailsMutation, isPending: isSendingLoginDetails } =
    useSendLoginDetails();

  // Handler for sending login details
  const handleSendLoginDetails = () => {
    if (hostId) {
      sendLoginDetailsMutation({ hostId });
    }
  };

  return (
    <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
      {/* Actions Popup */}
      {isSendingLoginDetails ? (
        <div className="flex justify-end items-center h-full pr-4">
          {" "}
          {/* Adjust padding as needed */}
          <Spinner />
        </div>
      ) : (
        <Popup
          trigger={<MoreButton className="!mx-0 !ml-auto" />}
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
                    <UnblockHostModal
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
                      onClick={handleSendLoginDetails}
                      className="!text-xs 3xl:!text-base text-left w-full"
                      type="button"
                      disabled={isSendingLoginDetails}
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
      {/* End Actions Popup */}

      <MobileTableCell title="Host ID" content={items?.id ?? "-"} />
      <MobileTableCell
        title="Full Name"
        content={`${items?.firstName ?? "-"} ${items?.lastName ?? "-"}`}
      />

      <MobileTableCell
        title="Phone Number"
        content={items?.phoneNumber ?? "-"}
      />

      <MobileTableCell title="Vehicle" content={items?.vehicles ?? "-"} />
      <MobileTableCell
        title="Total Bookings"
        content={items?.totalBooking ?? "-"}
      />
      <MobileTableCell title="Total Rides" content={items?.totalRides ?? "-"} />

      <MobileTableCell
        title="Last Login"
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d, h:mma") // Changed format for consistency with desktop
            : "-"
        }
      />
      <MobileTableCell
        title="Last Booked"
        content={
          items?.lastBooked
            ? format(new Date(items?.lastBooked), "MMM d, h:mma") // Changed format for consistency with desktop
            : "-"
        }
      />
      <MobileTableCell title="Location" content={items?.location ?? "-"} />

      <MobileTableCell title="Status" content={items?.status} isBadge={true} />
    </div>
  );
}

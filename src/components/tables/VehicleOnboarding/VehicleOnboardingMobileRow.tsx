import Link from "next/link";
import { format } from "date-fns";
import { ReactNode } from "react";
import {
  BookingBadgeStatus,
  TransactionStatus,
  VehicleOnboardingTable,
} from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import { BookingTableBadge, TransactionBadge } from "@/components/shared/badge";
import MoreButton from "@/components/shared/moreButton";
import useVehicleOnboardingTable from "./hooks/useVehicleOnboardingTable";

const TableCell = ({
  title,
  content,
  isBadge,
  type,
}: {
  title: string;
  content: string | ReactNode;
  isBadge?: boolean;
  type?: "transaction" | "booking";
}) => (
  <div className="text-sm w-full flex gap-5 items-center justify-between">
    <span className="text-grey-700 w-1/2">{title}</span>
    <span className="font-semibold text-grey-700 w-1/2 break-all">
      {isBadge ? (
        type === "transaction" ? (
          <TransactionBadge status={content as TransactionStatus} />
        ) : (
          <BookingTableBadge status={content as BookingBadgeStatus} />
        )
      ) : (
        content
      )}
    </span>
  </div>
);

const VehicleOnboardingMobileRow = ({
  items,
}: {
  items: VehicleOnboardingTable;
}) => {
  return (
    <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
      <Popup
        trigger={<MoreButton className="!mx-0 !ml-auto" />}
        content={
          <>
            <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
            <ul className="space-y-2 *:py-2">
              <>
                <li>
                  {/* <DeclineTrip
                        openModal={openDeclineModal}
                        handleModal={() => handleDeclineModal()}
                        isLoading={declineBooking.isPending}
                        handleAction={() => declineBooking.mutate()}
                        trigger={
                          <button className="!text-xs 3xl:!text-base ">
                            Decline Trip
                          </button>
                        }
                      /> */}
                </li>
                <li>
                  {/* <AcceptTrip
                        openModal={openAcceptModal}
                        handleModal={() => handleAcceptModal()}
                        isLoading={acceptBooking.isPending}
                        handleAction={() => acceptBooking.mutate()}
                        trigger={
                          <button className="!text-xs 3xl:!text-base ">
                            Accept Trip
                          </button>
                        }
                      /> */}
                </li>
              </>

              <li>
                <Link href={`/bookings/`} className="!text-xs 3xl:!text-base">
                  View Booking Details
                </Link>
              </li>
            </ul>
          </>
        }
      />
      <TableCell title="Vehicle ID" content={items?.vehicleId} />
      <TableCell title="Host" content={items.host} />
      <TableCell title="Location" content={items?.location} />
      <TableCell title="Make And Model" content={`${items?.makeAndModel}`} />
      <TableCell title="Vehicle Type" content={items?.vehicleType} />
      <TableCell title="Year" content={items?.year.toString()} />
      <TableCell
        title="Date Created"
        content={
          items?.dateCreated
            ? format(new Date(items?.dateCreated), "MMM d ,yyyy")
            : ""
        }
      />
      <TableCell title="Host Rate" content={items.hostRate} />
      <TableCell title="Customer Rate" content={items.customerRate} />
      <TableCell
        title="Status"
        content={items?.status}
        isBadge
        type="booking"
      />
    </div>
  );
};

export default VehicleOnboardingMobileRow;

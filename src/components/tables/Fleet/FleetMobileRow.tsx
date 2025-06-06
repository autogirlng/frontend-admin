import Link from "next/link";
import { format } from "date-fns";
import { ReactNode } from "react";
import {
  BookingBadgeStatus,
  FleetTable,
  TransactionStatus,
} from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import { BookingTableBadge, TransactionBadge } from "@/components/shared/badge";
import MoreButton from "@/components/shared/moreButton";
import { LocalRoute } from "@/utils/LocalRoutes";

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

const FleetMobileRow = ({ items }: { items: FleetTable }) => {
  return (
    <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
      <Popup
        trigger={<MoreButton className="!mx-0 !ml-auto" />}
        content={
          <>
            <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
            <ul className="space-y-2 *:py-2">
              <li>
                <Link
                  href={`${LocalRoute.vehiclePage}/${items.vehicleId}`}
                  className="!text-xs 3xl:!text-base"
                >
                  View Vehicle
                </Link>
              </li>
            </ul>
          </>
        }
      />
      <TableCell
        title="Vehicle ID"
        content={items?.vehicleId}
        // className="!text-grey-900 text-wrap !font-medium"
      />
      <TableCell title="Host" content={items?.host ?? "-"} />
      <TableCell
        title="Make And Model"
        content={`${items?.makeAndModel ?? "-"}`}
      />
      <TableCell
        title="Year"
        content={items?.year ? format(new Date(items?.year), "yyyy") : ""}
      />
      <TableCell title="Plate Number" content={items?.plateNumber ?? "-"} />
      <TableCell title="Location" content={items?.location ?? "-"} />{" "}
      <TableCell
        title="Date Added"
        content={
          items?.dateCreated
            ? format(new Date(items?.dateCreated), "MMM d ,yyyy")
            : ""
        }
      />
      <TableCell
        title="Booking Count"
        content={items.bookingCount.toString() ?? "-"}
      />
      <TableCell
        title="Vehicle Status"
        content={items?.vehicleStatus}
        isBadge
        // type="vehicleOnboarding"
      />
    </div>
  );
};

export default FleetMobileRow;

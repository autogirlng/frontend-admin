import Link from "next/link";
import { format } from "date-fns";
import { ReactNode } from "react";
import {
  BookingBadgeStatus,
  FleetTable,
  Member,
  TransactionStatus,
} from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import { BookingTableBadge, TransactionBadge } from "@/components/shared/badge";
import MoreButton from "@/components/shared/moreButton";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateMember } from "@/lib/features/teamMemberSlice";
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
export default function TeamMobileRow({ items }: { items: Member }) {
  const { member } = useAppSelector((state) => state.teamMember);
  const dispatch = useAppDispatch();

  const handleSelectMember = () => {
    // Update the global host state when this row is selected
    dispatch(updateMember(items));
  };

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
                <Link
                  onClick={handleSelectMember}
                  href={`${LocalRoute.teamMemberProfilePage}/${items?.id}`}
                  className="!text-xs 3xl:!text-base"
                >
                  View Member
                </Link>
              </li>
            </ul>
          </>
        }
      />
      <TableCell title="First Name" content={items?.firstName ?? "-"} />
      <TableCell title="Last Name" content={`${items?.lastName ?? "-"}`} />
      <TableCell title="Email" content={items?.email ?? "-"} />

      <TableCell title="Role" content={items?.role} />
      <TableCell
        title="Last Login"
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d ,yyyy")
            : ""
        }
      />
      <TableCell
        title="Joined"
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d ,yyyy") : ""
        }
      />
      <TableCell title="Status" content={items?.status} />
    </div>
  );
}

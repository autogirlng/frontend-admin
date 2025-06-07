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
import { MobileTableCell } from "@/components/TableCell";

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
      <MobileTableCell title="First Name" content={items?.firstName ?? "-"} />
      <MobileTableCell
        title="Last Name"
        content={`${items?.lastName ?? "-"}`}
      />
      <MobileTableCell title="Email" content={items?.email ?? "-"} />

      <MobileTableCell title="Role" content={items?.role} />
      <MobileTableCell
        title="Last Login"
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d ,yyyy")
            : ""
        }
      />
      <MobileTableCell
        title="Joined"
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d ,yyyy") : ""
        }
      />
      <MobileTableCell title="Status" content={items?.status} />
    </div>
  );
}

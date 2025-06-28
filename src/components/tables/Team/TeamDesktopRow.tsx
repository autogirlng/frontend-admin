import Link from "next/link";
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";
import { LocalRoute } from "@/utils/LocalRoutes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateMember } from "@/lib/features/teamMemberSlice";

export default function TeamDesktopRow({ items }: { items: Member }) {
  const { member } = useAppSelector((state) => state.teamMember);
  const dispatch = useAppDispatch();

  const handleSelectMember = () => {
    dispatch(updateMember(items));
  };

  return (
    <tr>
      <TableCell
        content={items?.firstName}
        className="!text-grey-900 text-wrap !font-medium"
      />
      <TableCell className="text-wrap" content={items?.lastName ?? "-"} />
      <TableCell className="text-wrap" content={`${items?.email ?? "-"}`} />
      <TableCell content={items?.role} />
      <TableCell
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d ,yyyy")
            : "-"
        }
      />

      <TableCell
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d ,yyyy") : ""
        }
      />
      <TableCell content={items?.status} isBadge={true} />
      <td>
        <Popup
          trigger={<MoreButton />}
          content={
            <>
              <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
              <ul className="space-y-2 *:py-2">
                <li>
                  <Link
                    onClick={handleSelectMember}
                    href={`${LocalRoute.teamMemberProfilePage}/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    View Member
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/bookings/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    Resend Invite
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/bookings/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    Activate Member
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/bookings/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    Edit Member
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/bookings/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    Disable Member
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/bookings/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    Delete Member
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

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

  const getPopupContent = (status: "Active" | "Inactive" | "Successful") => {
    switch (status) {
      case "Active":
        return (
          <>
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
                href={`/edit-member/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Edit Member
              </Link>
            </li>
            <li>
              <Link
                href={`/disable-member/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Disable Member
              </Link>
            </li>
          </>
        );

      case "Inactive":
        return (
          <>
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
                href={`/resend-invite/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Resend Invite
              </Link>
            </li>
            <li>
              <Link
                href={`/activate-member/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Activate Member
              </Link>
            </li>
            <li>
              <Link
                href={`/delete-member/${items?.id}`}
                className="!text-xs 3xl:!text-base text-error-500"
              >
                Delete Member
              </Link>
            </li>
          </>
        );

      case "Successful":
        return (
          <>
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
                href={`/edit-member/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Edit Member
              </Link>
            </li>
            <li>
              <Link
                href={`/disable-member/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Disable Member
              </Link>
            </li>
          </>
        );

      default:
        return null; // Handle any other status by not showing any actions
    }
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
            ? format(new Date(items?.lastLogin), "MMM d, yyyy")
            : "-"
        }
      />
      <TableCell
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d, yyyy") : ""
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
                {getPopupContent(items.status)}
              </ul>
            </>
          }
        />
      </td>
    </tr>
  );
}
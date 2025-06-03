import Link from "next/link";
import { format } from "date-fns";
import { FleetTable, Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";

export default function TeamDesktopRow({ items }: { items: Member }) {
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
            : ""
        }
      />

      <TableCell
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d ,yyyy") : ""
        }
      />
      <TableCell content={items?.status} />
      <td>
        <Popup
          trigger={<MoreButton />}
          content={
            <>
              <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
              <ul className="space-y-2 *:py-2">
                <>
                  <li>
                    <a>hey</a>
                  </li>
                  <li>
                    <a>ho</a>
                  </li>
                </>

                <li>
                  <Link
                    href={`/bookings/${items?.id}`}
                    className="!text-xs 3xl:!text-base"
                  >
                    View Booking Details
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

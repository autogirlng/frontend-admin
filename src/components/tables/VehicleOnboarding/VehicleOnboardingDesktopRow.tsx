import Link from "next/link";
import { format } from "date-fns";
import { VehicleOnboardingTable } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";

const VehicleDesktopRow = ({ items }: { items: VehicleOnboardingTable }) => {
  return (
    <tr>
      <TableCell
        content={items?.vehicleId}
        className="!text-grey-900 text-wrap !font-medium"
      />
      <TableCell className="text-wrap" content={items?.host ?? "-"} />
      <TableCell
        className="text-wrap"
        content={`${items?.makeAndModel ?? "-"}`}
      />
      <TableCell content={items?.year?.toString() ?? "-"} />
      <TableCell content={items?.vehicleType ?? "-"} />
      <TableCell className="text-wrap" content={items?.location ?? "-"} />
      <TableCell
        content={
          items?.dateCreated
            ? format(new Date(items?.dateCreated), "MMM d, yyyy")
            : "-"
        }
      />
      <TableCell content={items?.customerRate ?? "-"} />
      <TableCell content={items?.hostRate ?? "-"} />
      <TableCell content={items?.status} isBadge />
      <td>
        <Popup
          trigger={<MoreButton />}
          content={
            <>
              <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
              <ul className="space-y-2 *:py-2">
                <>
                  <li>
                    <Link
                      href={`/vehicle/${items?.vehicleId}`}
                      className="!text-xs 3xl:!text-base"
                    >
                      View Details
                    </Link>
                  </li>
                  {(items?.status === "pending" ||
                    items?.status === "review") && (
                    <>
                      <li>
                        <Link
                          href={`/vehicle/${items?.vehicleId}`}
                          className="!text-xs 3xl:!text-base"
                        >
                          Approve
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/vehicle/${items?.vehicleId}`}
                          className="!text-xs 3xl:!text-base"
                        >
                          Request update
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/vehicle/${items?.vehicleId}`}
                          className="!text-xs 3xl:!text-base"
                        >
                          Reject
                        </Link>
                      </li>
                    </>
                  )}
                  {items?.status === "rejected" ||
                    items?.status === "pending" ||
                    (items?.status === "review" && (
                      <li>
                        <Link
                          href={`/vehicle/${items?.vehicleId}`}
                          className="!text-xs 3xl:!text-base"
                        >
                          Request update
                        </Link>
                      </li>
                    ))}
                </>
              </ul>
            </>
          }
        />
      </td>
    </tr>
  );
};

export default VehicleDesktopRow;

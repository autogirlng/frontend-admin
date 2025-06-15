import Link from "next/link";
import { format } from "date-fns";
import { VehicleOnboardingTable } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import { MobileTableCell } from "@/components/TableCell";

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
      <MobileTableCell title="Vehicle ID" content={items?.vehicleId} />
      <MobileTableCell title="Host" content={items.host} />
      <MobileTableCell title="Location" content={items?.location} />
      <MobileTableCell
        title="Make And Model"
        content={`${items?.makeAndModel}`}
      />
      <MobileTableCell title="Vehicle Type" content={items?.vehicleType} />
      <MobileTableCell title="Year" content={items?.year.toString()} />
      <MobileTableCell
        title="Date Created"
        content={
          items?.dateCreated
            ? format(new Date(items?.dateCreated), "MMM d ,yyyy")
            : ""
        }
      />
      <MobileTableCell title="Host Rate" content={items.hostRate} />
      <MobileTableCell title="Customer Rate" content={items.customerRate} />
      <MobileTableCell
        title="Vehicle Status"
        content={items?.status}
        isBadge
        type="regular"
      />
    </div>
  );
};

export default VehicleOnboardingMobileRow;

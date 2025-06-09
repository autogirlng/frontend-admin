import Link from "next/link";
import { format } from "date-fns";
import { FleetTable } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";

const FleetDesktopRow = ({ items }: { items: FleetTable }) => {
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
      <TableCell
        content={items?.year ? format(new Date(items?.year), "yyyy") : ""}
      />
      <TableCell content={items?.plateNumber ?? "-"} />
      <TableCell content={items?.location ?? "-"} />{" "}
      <TableCell
        content={
          items?.dateCreated
            ? format(new Date(items?.dateCreated), "MMM d ,yyyy")
            : ""
        }
      />
      <TableCell content={items.bookingCount.toString() ?? "-"} />
      <TableCell content={items?.vehicleStatus} isBadge />
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
                    <a>ho</a>
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
                    href={`/bookings/${items?.vehicleId}`}
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
};

export default FleetDesktopRow;

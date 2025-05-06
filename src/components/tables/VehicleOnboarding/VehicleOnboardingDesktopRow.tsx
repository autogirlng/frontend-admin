import Link from "next/link";
import { format } from "date-fns";
import { VehicleOnboardingTable } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";

const VehicleDesktopRow = ({ items }: { items: VehicleOnboardingTable }) => {
  return (
    <tr>
      <TableCell content={items?.id} className="!text-grey-900 !font-medium" />
      <TableCell content={items?.make} />
      <TableCell content={items?.location} />
      <TableCell content={`${items?.make} \n${items.model}`} />
      <TableCell content={items?.vehicleType} />
      <TableCell content={items?.yearOfRelease.toString()} />
      <TableCell
        content={
          items?.createdAt
            ? format(new Date(items?.createdAt), "MMM d ,yyyy")
            : ""
        }
      />
      <TableCell content={"host rate"} />
      <TableCell content={"customer rate"} />
      <TableCell content={items?.status} isBadge type="vehicleOnboarding" />
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
                    href={`/bookings/${items?.vehicleID}`}
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

export default VehicleDesktopRow;

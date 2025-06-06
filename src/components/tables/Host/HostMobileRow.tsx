import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import { MobileTableCell } from "@/components/TableCell";

export default function HostMobileRow({ items }: { items: Member }) {
  return (
    <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
      <Popup
        trigger={<MoreButton className="!mx-0 !ml-auto" />}
        content={
          <>
            <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
            <ul className="space-y-2 *:py-2"></ul>
          </>
        }
      />
      <MobileTableCell title="Host ID" content={items?.id ?? "-"} />
      <MobileTableCell
        title="Full Name"
        content={`${items?.firstName ?? "-"} ${items?.lastName ?? "-"}`}
      />

      <MobileTableCell
        title="Phone Number"
        content={items?.phoneNumber ?? "-"}
      />

      <MobileTableCell title="Vehicle" content={items?.vehicles ?? "-"} />
      <MobileTableCell
        title="Total Bookings"
        content={items?.totalBooking ?? "-"}
      />
      <MobileTableCell title="Total Rides" content={items?.totalRides ?? "-"} />

      <MobileTableCell
        title="Last Login"
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d ,yyyy")
            : ""
        }
      />
      <MobileTableCell
        title="Last Booked"
        content={
          items?.lastBooked
            ? format(new Date(items?.lastBooked), "MMM d ,yyyy")
            : ""
        }
      />
      <MobileTableCell title="Location" content={items?.location ?? "-"} />

      <MobileTableCell title="Status" content={items?.status} />
    </div>
  );
}

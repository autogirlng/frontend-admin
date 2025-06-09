import { hostMembersItems } from "@/utils/data";
import TableHead from "@/components/TableHead";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";
import HostBookingDesktopRow from "./HostBookingDesktopRow";
import { HostBookingTable } from "@/types/Bookings";
import HostBookingMobileRow from "./HostMobileRow";
import { ImageAssets } from "@/utils/ImageAssets";

export default function HostBookingsTable({
  items,
}: {
  items: HostBookingTable[];
}) {
  const router = useRouter();
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="hidden md:block w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={hostMembersItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items?.map((item, index) => (
            <HostBookingDesktopRow key={index} items={item} />
          ))}
        </tbody>
      </table>
      <div className="block md:hidden border border-grey-200 rounded-xl px-8 py-6">
        {items?.map((item, index) => (
          <HostBookingMobileRow key={index} items={item} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyState
      title={"No Booking Yet"}
      message={""}
      image={ImageAssets.icons.emptyBookingState}
    />
  );
}

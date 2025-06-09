import { hostMembersItems, membersHeadItems } from "@/utils/data";
import { Member } from "@/utils/types";
import TableHead from "@/components/TableHead";
import EmptyState from "@/components/EmptyState";
import HostDesktopRow from "./HostDesktopRow";
import HostMobileRow from "./HostMobileRow";
import { LocalRoute } from "@/utils/LocalRoutes";
import { useRouter } from "next/navigation";

export default function HostDataHoldingTable({
  items,
  emptyStateMessage,
  emptyStateTitle,
}: {
  items: Member[];
  emptyStateMessage: string;
  emptyStateTitle?: string;
}) {
  const router = useRouter();
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="hidden md:block w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={hostMembersItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items?.map((item, index) => (
            <HostDesktopRow key={index} items={item} />
          ))}
        </tbody>
      </table>
      <div className="block md:hidden border border-grey-200 rounded-xl px-8 py-6">
        {items?.map((item, index) => (
          <HostMobileRow key={index} items={item} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyState
      title={emptyStateTitle || "No Data Yet"}
      message={emptyStateMessage}
      image="/icons/empty_booking_state.png"
      buttonText="Add Host"
      buttonAction={() => router.push(LocalRoute.hostOnboarding)}
    />
  );
}

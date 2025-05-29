import { membersHeadItems } from "@/utils/data";
import { Member } from "@/utils/types";
import TableHead from "@/components/TableHead";
import EmptyState from "@/components/EmptyState";
import TeamDesktopRow from "./TeamDesktopRow";
import TeamMobileRow from "./TeamMobileRow";

export default function TeamDataHoldingTable({
  items,
  emptyStateMessage,
  emptyStateTitle,
}: {
  items: Member[];
  emptyStateMessage: string;
  emptyStateTitle?: string;
}) {
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="hidden md:block w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={membersHeadItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items?.map((item, index) => (
            <TeamDesktopRow key={index} items={item} />
          ))}
        </tbody>
      </table>
      <div className="block md:hidden border border-grey-200 rounded-xl px-8 py-6">
        {items?.map((item, index) => (
          <TeamMobileRow key={index} items={item} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyState
      title={emptyStateTitle || "No Data Yet"}
      message={emptyStateMessage}
      image="/icons/empty_booking_state.png"
    />
  );
}

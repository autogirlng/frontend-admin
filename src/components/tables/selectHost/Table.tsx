import { selectingHostTableHeadItems } from "@/utils/data";
import { HostTable } from "@/utils/types";
import TableHead from "@/components/TableHead";
import EmptyState from "@/components/EmptyState";
import SelectHostDesktopRow from "./SelectHostDesktopRow";
import SelectHostMobileRow from "./SelectHostMobileRow";

export default function SelectingHostTable({
  items,
  emptyStateMessage,
  emptyStateTitle,
}: {
  items: HostTable[];
  emptyStateMessage: string;
  emptyStateTitle?: string;
}) {
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="hidden md:block w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={selectingHostTableHeadItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items?.map((item, index) => (
            <SelectHostDesktopRow key={index} items={item} />
          ))}
        </tbody>
      </table>
      <div className="block md:hidden border border-grey-200 rounded-xl px-8 py-6">
        {items?.map((item, index) => (
          <SelectHostMobileRow key={index} items={item} />
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

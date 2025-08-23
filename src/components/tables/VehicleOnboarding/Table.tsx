import { vehicleOnboardingTableHeadItems } from "@/utils/data";
import { VehicleOnboardingTable } from "@/utils/types";
import TableHead from "@/components/TableHead";
import EmptyState from "@/components/EmptyState";
import VehicleOnboardingMobileRow from "./VehicleOnboardingMobileRow";
import VehicleDesktopRow from "./VehicleOnboardingDesktopRow";

interface OnboardedAnalyticsTableProps {
  items: VehicleOnboardingTable[];
  emptyStateMessage: string;
  emptyStateTitle?: string;
  onApprove: (vehicle: VehicleOnboardingTable) => void;
  onReject: (vehicle: VehicleOnboardingTable) => void;
  onRequestUpdate: (vehicle: VehicleOnboardingTable) => void;
}

export default function OnboardedAnalyticsTable({
  items,
  emptyStateMessage,
  emptyStateTitle,
  onApprove,
  onReject,
  onRequestUpdate,
}: OnboardedAnalyticsTableProps) {
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="hidden md:block w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={vehicleOnboardingTableHeadItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items?.map((item, index) => (
            <VehicleDesktopRow 
              key={index} 
              items={item} 
              onApprove={onApprove}
              onReject={onReject}
              onRequestUpdate={onRequestUpdate}
            />
          ))}
        </tbody>
      </table>
      <div className="block md:hidden border border-grey-200 rounded-xl px-8 py-6">
        {items?.map((item, index) => (
          <VehicleOnboardingMobileRow 
            key={index} 
            items={item} 
            onApprove={onApprove}
            onReject={onReject}
            onRequestUpdate={onRequestUpdate}
          />
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

import {
  BookingBadgeStatus,
  TransactionStatus,
  VehicleOnboardingStatus,
} from "@/utils/types";
import {
  BookingTableBadge,
  TransactionBadge,
  VehicleOnboardingTableBadge,
} from "@/components/shared/badge";
import { ReactNode } from "react";

type Props = {
  content: string;
  className?: string;
  isBadge?: boolean;
  type?: "transaction" | "booking" | "vehicleOnboarding";
  icon?: ReactNode;
};

const TableCell = ({ content, className, isBadge, type, icon }: Props) => (
  <td
    className={`px-6 py-[26px] whitespace-nowrap w-fit text-sm text-grey-700 ${
      className ?? ""
    }`}
  >
    {icon ? (
      <div className="flex items-center gap-3">
        {icon}
        <span>{content}</span>
      </div>
    ) : isBadge ? (
      type === "transaction" ? (
        <TransactionBadge status={content as TransactionStatus} />
      ) : (
        <BookingTableBadge status={content as BookingBadgeStatus} />
      )
    ) : type === "vehicleOnboarding" ? (
      <VehicleOnboardingTableBadge
        status={content as VehicleOnboardingStatus}
      />
    ) : (
      content
    )}
  </td>
);

export default TableCell;

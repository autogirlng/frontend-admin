import {
  BookingBadgeStatus,
  Status,
  TransactionStatus,
  VehicleOnboardingStatus,
} from "@/utils/types";
import {
  BookingTableBadge,
  TransactionBadge,
  VehicleOnboardingTableBadge,
} from "@/components/shared/badge";
import { ReactNode } from "react";
import { StatusBadge } from "./shared/StatusBadge";

type Props = {
  content: string;
  className?: string;
  isBadge?: boolean;
  type?: "table" | "regular";
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
      <StatusBadge status={content as Status} type={type} />
    ) : (
      content
    )}
  </td>
);

export default TableCell;

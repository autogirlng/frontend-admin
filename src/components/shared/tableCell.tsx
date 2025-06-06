import { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";
import { Status } from "@/utils/types";

type Props = {
  content: string;
  className?: string;
  isBadge?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
};

const TableCell = ({ content, className, isBadge, icon, badge }: Props) => (
  <td
    className={`w-auto px-6 py-[26px] whitespace-nowrap text-sm text-grey-700 ${
      className ?? ""
    }`}
  >
    {icon ? (
      <div className="flex items-center gap-3">
        {icon}
        <span>{content}</span>
      </div>
    ) : isBadge ? (
      badge
    ) : (
      content
    )}
  </td>
);

export default TableCell;

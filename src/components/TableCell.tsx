import { Status } from "@/utils/types";

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
    )
    }
  </td>
);

export default TableCell;

export const MobileTableCell = ({
  title,
  content,
  isBadge,
  type,
}: {
  title: string;
  content: string | ReactNode;
  isBadge?: boolean;
  type?: "table" | "regular";
}) => (
  <div className="text-sm w-full flex gap-5 items-center justify-between">
    <span className="text-grey-700 w-1/2">{title}</span>
    <span className="font-semibold text-grey-700 w-1/2 break-all">
      {isBadge ? (
        <StatusBadge status={content as Status} type={type} />
      ) : (
        content
      )}
    </span>
  </div>
);

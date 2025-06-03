import Link from "next/link";
import { ReactNode } from "react";
import {
  BookingBadgeStatus,
  HostTable,
  TransactionStatus,
} from "@/utils/types";
import { BookingTableBadge, TransactionBadge } from "@/components/shared/badge";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateHostInfo } from "@/lib/features/hostSlice";

const TableCell = ({
  title,
  content,
  isBadge,
  type,
}: {
  title: string;
  content: string | ReactNode;
  isBadge?: boolean;
  type?: "transaction" | "booking";
}) => (
  <div className="text-sm w-full flex gap-5 items-center justify-between">
    <span className="text-grey-700 w-1/2">{title}</span>
    <span className="font-semibold text-grey-700 w-1/2 break-all">
      {isBadge ? (
        type === "transaction" ? (
          <TransactionBadge status={content as TransactionStatus} />
        ) : (
          <BookingTableBadge status={content as BookingBadgeStatus} />
        )
      ) : (
        content
      )}
    </span>
  </div>
);

const SelectHostMobileRow = ({ items }: { items: HostTable }) => {
  const { host } = useAppSelector((state) => state.host);
  const dispatch = useAppDispatch();

  const handleSelectHost = () => {
    // Update the global host state when this row is selected
    dispatch(updateHostInfo(items));
  };
  return (
    <div
      onClick={handleSelectHost}
      className="space-y-3 pt-5 pb-3 border-b border-grey-300"
    >
      <TableCell title="Host ID" content={items?.id} />
      <TableCell
        title="Host"
        content={`${items.firstName} ${items?.lastName}\n${items.firstName}`}
      />
      <TableCell title="Email" content={items?.email} />

      <TableCell title="Phone Number" content={items?.phoneNumber} />
      <TableCell title="Location" content={items?.city ?? "-"} />
      {host?.id === items.id && (
        <div className="rounded text-white bg-blue-500">
          <TableCell title="" content="✓" />
        </div>
      )}
    </div>
  );
};

export default SelectHostMobileRow;

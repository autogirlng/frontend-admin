import { ReactNode } from "react";
import {
  BookingBadgeStatus,
  HostTable,
  TransactionStatus,
} from "@/utils/types";
import { BookingTableBadge, TransactionBadge } from "@/components/shared/badge";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateHostInfo } from "@/lib/features/hostSlice";
// For a complete checkbox, we use the Root and Indicator parts from Radix
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

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
   // Determine if the current row is the selected host
  const isSelected = host?.id === items.id;
  return (
    <div
      onClick={handleSelectHost}
      className="space-y-3 pt-5 pb-3 border-b border-grey-300"
    >
      <TableCell title="Host ID" content={items?.id} />
      <TableCell
        title="Host"
        content={`${items.firstName} ${items?.lastName}`}
      />
      <TableCell title="Business name" content={items?.businessName} />

      <TableCell title="Phone Number" content={items?.phoneNumber} />
      <TableCell title="Location" content={items?.location ?? "-"} />
      {/* Wrap the Checkbox in a TableCell for proper alignment */}
           <td className="px-6 py-4">
             <Checkbox.Root
               checked={isSelected}
               onCheckedChange={handleSelectHost}
               id={`host-checkbox-${items.id}`}
               className={`
                 flex h-5 w-5 items-center justify-center rounded
                 border-2 border-grey-300
                 ring-offset-white focus:outline-none focus-visible:ring-2
                 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                 data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600
                 transition-all duration-150
               `}
             >
               <Checkbox.Indicator>
                 <Check className="h-4 w-4 text-primary-100" />
               </Checkbox.Indicator>
             </Checkbox.Root>
           </td>
    </div>
  );
};

export default SelectHostMobileRow;

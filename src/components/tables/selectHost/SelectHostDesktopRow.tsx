import { HostTable } from "@/utils/types";
import TableCell from "@/components/TableCell";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateHostInfo } from "@/lib/features/hostSlice";
// For a complete checkbox, we use the Root and Indicator parts from Radix
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";


const SelectHostDesktopRow = ({ items }: { items: HostTable }) => {
  const { host } = useAppSelector((state) => state.host);
  const dispatch = useAppDispatch();

  // Function to handle host selection
  const handleSelectHost = () => {
    // Update the global host state when this row is selected
    dispatch(updateHostInfo(items));
  };

  // Determine if the current row is the selected host
  const isSelected = host?.id === items.id;

  return (
    <tr
      onClick={handleSelectHost}
      className={`cursor-pointer ${isSelected ? "bg-blue-100" : "hover:bg-gray-50"}`}
    >
      <TableCell content={items?.id} />
      <TableCell content={`${items.firstName} ${items?.lastName}`} />
      <TableCell content={items?.businessName ?? "-"} />
      <TableCell content={items?.phoneNumber} />
      <TableCell content={items?.location ?? "-"} />

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
      
    </tr>
  );
};

export default SelectHostDesktopRow;
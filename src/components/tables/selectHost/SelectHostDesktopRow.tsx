import { HostTable } from "@/utils/types";
import TableCell from "@/components/TableCell";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateHostInfo } from "@/lib/features/hostSlice";

const SelectHostDesktopRow = ({ items }: { items: HostTable }) => {
  const { host } = useAppSelector((state) => state.host);
  const dispatch = useAppDispatch();

  const handleSelectHost = () => {
    // Update the global host state when this row is selected
    dispatch(updateHostInfo(items));
  };

  return (
    <tr onClick={handleSelectHost} className="cursor-pointer hover:bg-gray-50">
      <TableCell content={items?.id} />
      <TableCell
        content={`${items.firstName} ${items?.lastName}\n${items.firstName}`}
      />
      <TableCell content={items?.email} />
      <TableCell content={items?.phoneNumber} />
      <TableCell content={items?.city ?? "-"} />

      {/* Show if this is the currently selected host */}
      {host?.id === items.id && (
        <TableCell content="✓" className="text-blue-500" />
      )}
    </tr>
  );
};

export default SelectHostDesktopRow;

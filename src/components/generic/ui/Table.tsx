// components/generic/ui/Table.tsx
import React from "react";
import clsx from "clsx";

export interface ColumnDefinition<T extends object> {
  accessorKey: keyof T;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

// ✅ --- NEW: Internal Checkbox Component ---
const SelectionCheckbox = ({
  checked,
  onChange,
  indeterminate,
  disabled = false,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  disabled?: boolean;
}) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="h-4 w-4 border-gray-300 text-[#0096FF] focus:ring-[#0096FF] disabled:cursor-not-allowed disabled:bg-gray-200"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

// ✅ --- UPDATED: Props Interface ---
interface CustomTableProps<T extends object> {
  data: T[];
  columns: ColumnDefinition<T>[];
  getUniqueRowId: (item: T) => string | number;

  // Optional selection props
  selectedRowIds?: Set<string | number>;
  onRowSelect?: (rowId: string | number, rowData: T) => void;
  onSelectAll?: (areAllSelected: boolean) => void;
  isRowSelectable?: (rowData: T) => boolean;
}

export function CustomTable<T extends object>({
  data,
  columns,
  getUniqueRowId,
  selectedRowIds,
  onRowSelect,
  onSelectAll,
  isRowSelectable,
}: CustomTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  // --- Selection Logic ---
  const canSelect = !!selectedRowIds && !!onRowSelect && !!onSelectAll;

  // Find rows that are eligible to be selected
  const selectableData = isRowSelectable ? data.filter(isRowSelectable) : data;
  const selectableRowIds = selectableData.map(getUniqueRowId);

  const isAllSelected =
    canSelect &&
    selectableRowIds.length > 0 &&
    selectableRowIds.every((id) => selectedRowIds.has(id));
  const isIndeterminate =
    canSelect && selectedRowIds.size > 0 && !isAllSelected;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {/* ✅ SELECTION HEADER */}
            {canSelect && (
              <th scope="col" className="px-6 py-4 text-left">
                <SelectionCheckbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  disabled={selectableData.length === 0}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.header}
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const rowId = getUniqueRowId(item);
            const isSelected = canSelect && selectedRowIds.has(rowId);
            const isSelectable = isRowSelectable ? isRowSelectable(item) : true;

            return (
              <tr
                key={rowId}
                className={clsx(
                  "transition-colors",
                  isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                )}
              >
                {/* ✅ SELECTION CELL */}
                {canSelect && (
                  <td className="px-6 py-5">
                    <SelectionCheckbox
                      checked={isSelected}
                      onChange={() => onRowSelect(rowId, item)}
                      disabled={!isSelectable}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={`${rowId}-${col.accessorKey.toString()}`}
                    className="px-6 py-5 whitespace-nowrap text-sm text-gray-800"
                  >
                    {col.cell
                      ? col.cell(item)
                      : (item[col.accessorKey] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

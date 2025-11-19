// components/generic/ui/Table.tsx
import React from "react";
import clsx from "clsx";

export interface ColumnDefinition<T extends object> {
  accessorKey: keyof T;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

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
      className="h-5 w-5 rounded border-gray-300 text-[#0096FF] focus:ring-2 focus:ring-[#0096FF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

interface CustomTableProps<T extends object> {
  data: T[];
  columns: ColumnDefinition<T>[];
  getUniqueRowId: (item: T) => string | number;
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl text-gray-200 mb-4">Table</div>
        <p className="text-gray-500 text-lg">No data available</p>
      </div>
    );
  }

  const canSelect = !!selectedRowIds && !!onRowSelect && !!onSelectAll;
  const selectableData = isRowSelectable ? data.filter(isRowSelectable) : data;
  const selectableRowIds = selectableData.map(getUniqueRowId);

  const isAllSelected =
    canSelect &&
    selectableRowIds.length > 0 &&
    selectableRowIds.every((id) => selectedRowIds.has(id));
  const isIndeterminate =
    canSelect && selectedRowIds.size > 0 && !isAllSelected;

  const lastColumnIndex = columns.length - 1;

  return (
    <div className="w-full">
      {/* ====================== DESKTOP / TABLET ====================== */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const rowId = getUniqueRowId(item);
              const isSelected = canSelect && selectedRowIds.has(rowId);
              const isSelectable = isRowSelectable
                ? isRowSelectable(item)
                : true;

              return (
                <tr
                  key={rowId}
                  className={clsx(
                    "transition-colors duration-150",
                    isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                  )}
                >
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
                      className="px-6 py-5 text-sm text-gray-800 whitespace-nowrap"
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

      {/* ====================== MOBILE: ENHANCED CARD LAYOUT ====================== */}
      <div className="lg:hidden space-y-4 py-4">
        {/* Select All Bar */}
        {canSelect && selectableData.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <SelectionCheckbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
              <span className="font-medium text-gray-700">
                {isAllSelected
                  ? `${selectedRowIds.size} selected`
                  : "Select all"}
              </span>
            </div>
            {isAllSelected && (
              <button
                onClick={() => onSelectAll(false)}
                className="text-sm text-[#0096FF] font-medium"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Mobile Rows */}
        {data.map((item) => {
          const rowId = getUniqueRowId(item);
          const isSelected = canSelect && selectedRowIds.has(rowId);
          const isSelectable = isRowSelectable ? isRowSelectable(item) : true;

          return (
            <div
              key={rowId}
              className={clsx(
                "relative overflow-hidden border-2 bg-white transition-all duration-200",
                isSelected
                  ? "border-[#0096FF] ring-4 ring-[#0096FF]/10 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              )}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0096FF]" />
              )}

              <div className="p-5">
                {/* Checkbox */}
                {canSelect && (
                  <div className="flex justify-between items-start mb-4">
                    <SelectionCheckbox
                      checked={isSelected}
                      onChange={() => onRowSelect(rowId, item)}
                      disabled={!isSelectable}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  {columns.map((col, idx) => {
                    const isLastColumn = idx === lastColumnIndex;

                    return (
                      <div
                        key={col.accessorKey.toString()}
                        className={clsx(
                          "flex justify-between items-start",
                          idx > 0 && "pt-4 border-t border-gray-100"
                        )}
                      >
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex-1 pr-4">
                          {col.header}
                        </dt>

                        <dd
                          className={clsx(
                            "text-base font-medium text-gray-900 text-right",
                            isLastColumn ? "font-semibold text-[#0096FF]" : ""
                          )}
                        >
                          {col.cell
                            ? col.cell(item)
                            : (item[col.accessorKey] as React.ReactNode)}
                        </dd>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

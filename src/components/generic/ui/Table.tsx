import React from "react";

export interface ColumnDefinition<T extends object> {
  accessorKey: keyof T;

  header: string;

  cell?: (item: T) => React.ReactNode;
}

interface CustomTableProps<T extends object> {
  data: T[];

  columns: ColumnDefinition<T>[];

  getUniqueRowId: (item: T) => string | number;
}

export function CustomTable<T extends object>({
  data,
  columns,
  getUniqueRowId,
}: CustomTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
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
          {data.map((item) => (
            <tr
              key={getUniqueRowId(item)}
              className="transition-colors hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td
                  key={`${getUniqueRowId(item)}-${col.accessorKey.toString()}`}
                  className="px-6 py-5 whitespace-nowrap text-sm text-gray-800"
                >
                  {/* This is the core logic:
                    1. Check if a custom 'cell' render function exists.
                    2. If YES, call it with the row's item data.
                    3. If NO, just display the data from the 'accessorKey'.
                  */}
                  {col.cell
                    ? col.cell(item)
                    : (item[col.accessorKey] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

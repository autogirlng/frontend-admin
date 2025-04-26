"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import TableSearchFilter from "@/app/components/core/table/TableSearchFilter";
import { BookingTrips } from "@/app/types";
import { sampleBookingsTrip } from "@/app/utils/data";

const columns: ColumnDef<BookingTrips>[] = [
  {
    header: "Invoice Number",
    accessorKey: "invoiceNumber",
  },
  {
    header: "Booking Id",
    accessorKey: "bookingId",
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
  },
  {
    header: "Trip Number",
    accessorKey: "tripNumber",
  },
  {
    header: "Pickup Time",
    accessorKey: "pickupTime",
    cell: (info) => {
      const row = info.row.original;
      return `${new Date(row.pickupTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
  },
  {
    header: "Pickup Location ",
    accessorKey: "pickupLocation",
  },
  {
    header: "Driver Asgn",
    accessorKey: "driverAsgn",
    cell: (info) => {
      const value = info.getValue() as string;
      let className =
        "px-3 py-1 rounded-md text-white text-xs whitespace-nowrap";
      if (value === "Pending") {
        className += " bg-yellow-500";
      } else if (value === "Assigned") {
        className += " bg-green-500";
      } else if (value === "Unassigned") {
        className += " bg-gray-500";
      }
      return <span className={className}>{value}</span>;
    },
  },
  {
    header: "Host Asgn",
    accessorKey: "hostAsgn",
    cell: (info) => {
      const value = info.getValue() as string;
      let className =
        "px-3 py-1 rounded-md text-white text-xs whitespace-nowrap";
      if (value === "Pending") {
        className += " bg-yellow-500";
      } else if (value === "Assigned") {
        className += " bg-green-500";
      } else if (value === "Unassigned") {
        className += " bg-gray-500";
      }
      return <span className={className}>{value}</span>;
    },
  },
  {
    header: "Payment Status",
    accessorKey: "paymentStatus",
    cell: (info) => {
      const value = info.getValue() as string;
      let className =
        "px-4 py-1 rounded-lg text-white text-[10px] whitespace-nowrap";
      if (value === "Pending") {
        className += " bg-yellow-500";
      } else if (value === "Paid") {
        className += " bg-green-500";
      }
      return <span className={className}>{value}</span>;
    },
  },
  {
    header: "Ride Status",
    accessorKey: "rideStatus",
    cell: (info) => {
      const value = info.getValue() as string;
      let className =
        "px-4 py-1 rounded-lg text-white text-[10px] whitespace-nowrap";
      if (value === "Pending") {
        className += " bg-yellow-500";
      } else if (value === "Completed") {
        className += " bg-green-500";
      } else if (value === "Canceled") {
        className += " bg-red-500";
      }
      return <span className={className}>{value}</span>;
    },
  },
  {
    header: "Actions",
    cell: (_) => {
      return (
        <button className="text-gray-500 text-xs rounded-md p-2 shadow whitespace-nowrap">
          <BsThreeDotsVertical />
        </button>
      );
    },
  },
];

export default function TripsTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = useMemo<BookingTrips[]>(() => {
    return sampleBookingsTrip.filter(
      (booking) =>
        booking.invoiceNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const table = useReactTable<BookingTrips>({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Search & Filter */}
      <TableSearchFilter
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        placeholder="Search with Booking ID, or Guest name"
      />

      {/* 📱 Mobile View */}
      <div className="md:hidden overflow-x-auto -mb-2">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="bg-white shadow p-4 rounded-lg mb-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <h6 className="font-semibold">{row.original.invoiceNumber}</h6>
                <button className="text-[#101928] text-xs">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <p className="text-sm text-[#101928]">
                Booking ID: {row.original.bookingId}
              </p>
              <p className="text-sm text-gray-600">
                Customer Name: {row.original.customerName}
              </p>
              <p className="text-sm text-gray-600">
                Time:{" "}
                {new Date(row.original.pickupTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="flex space-x-2 mt-2">
                <span
                  className={`px-2 py-1 text-white rounded-md text-[0.7rem] whitespace-nowrap ${
                    row.original.driverAsgn === "Pending"
                      ? "bg-yellow-500"
                      : row.original.driverAsgn === "Assigned"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  Driver: {row.original.driverAsgn}
                </span>
                <span
                  className={`px-2 py-1 text-white rounded-md text-[0.7rem] whitespace-nowrap ${
                    row.original.hostAsgn === "Pending"
                      ? "bg-yellow-500"
                      : row.original.hostAsgn === "Assigned"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  Host: {row.original.hostAsgn}
                </span>
                <span
                  className={`px-2 py-1 text-white rounded-md text-[0.7rem] whitespace-nowrap ${
                    row.original.paymentStatus === "Pending"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  Payment: {row.original.paymentStatus}
                </span>
                <span
                  className={`px-2 py-1 text-white rounded-md text-[0.7rem] whitespace-nowrap ${
                    row.original.rideStatus === "Pending"
                      ? "bg-yellow-500"
                      : row.original.rideStatus === "Completed"
                      ? "bg-green-500"
                      : row.original.rideStatus === "Canceled"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                >
                  Ride: {row.original.rideStatus}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">No results found.</p>
        )}
      </div>

      {/* 🖥️ Desktop Table View */}
      <div className="hidden md:block rounded-lg">
        <div className="overflow-x-auto">
          {" "}
          {/* Enable scroll if content is wider */}
          <table className="w-full border-collapse">
            <thead className="bg-[#F7F9FC] rounded-md py-3">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 text-[#101928] text-[12px] border-b-[0.2px]
                        border-b-slate-50 text-left font-normal whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 text-xs text-[#101928] whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔄 Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-center space-x-2 mt-4 text-sm">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded-md shadow ${
              table.getCanPreviousPage()
                ? "text-gray-800"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaChevronLeft className="text-sm" />
          </button>
          {table.getPageOptions().map((page) => (
            <button
              key={page}
              onClick={() => table.setPageIndex(page)}
              className={`px-3 py-1 rounded-md border ${
                table.getState().pagination.pageIndex === page
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded-md shadow ${
              table.getCanNextPage()
                ? "text-gray-800"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}

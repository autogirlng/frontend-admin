import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineFilter } from "react-icons/ai";

interface Booking {
  bookingId: string;
  guestName: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Confirmed";
  price: number;
}

const sampleBookings: Booking[] = [
  {
    bookingId: "BK123",
    guestName: "John Doe",
    vehicle: "Toyota Camry",
    startDate: "2024-03-10",
    endDate: "2024-03-15",
    status: "Pending",
    price: 50000,
  },
  {
    bookingId: "BK456",
    guestName: "Jane Smith",
    vehicle: "Honda Civic",
    startDate: "2024-04-05",
    endDate: "2024-04-10",
    status: "Confirmed",
    price: 60000,
  },
];

const columns: ColumnDef<Booking>[] = [
  {
    header: "Booking ID",
    accessorKey: "bookingId",
  },
  {
    header: "Guest Name",
    accessorKey: "guestName",
  },
  {
    header: "Vehicle",
    accessorKey: "vehicle",
  },
  {
    header: "Date",
    accessorKey: "startDate",
    cell: (info) => {
      const row = info.row.original;
      return `${new Date(row.startDate).toLocaleDateString()} - ${new Date(
        row.endDate
      ).toLocaleDateString()}`;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => (
      <span
        className={`px-3 py-1 rounded-md text-white ${
          info.getValue() === "Pending" ? "bg-yellow-500" : "bg-green-500"
        }`}
      >
        {info.getValue() as string}
      </span>
    ),
  },
  {
    header: "Price (NGN)",
    accessorKey: "price",
    cell: (info) =>
      `NGN ${new Intl.NumberFormat("en-NG").format(info.getValue() as number)}`,
  },
];

export default function BookingTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = useMemo<Booking[]>(() => {
    return sampleBookings.filter(
      (booking) =>
        booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const table = useReactTable<Booking>({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col space-y-4">
      {/* 🔍 Search & Filter */}
      <div className="flex  md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by Booking ID or Guest Name"
          className="w-full md:w-2/3 px-4 py-3 mt-1 border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex items-center gap-2 px-4  py-3 text-[#667185] bg-white shadow rounded-xl cursor-pointer">
          <AiOutlineFilter />
          <p className="hidden md:block">Filter</p>
          <FaChevronDown />
        </div>
      </div>

      {/* 📱 Mobile View */}
      <div className="md:hidden">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="bg-white shadow p-4 rounded-lg mb-2">
              <div className="flex justify-between items-center">
                <h6 className="font-bold">{row.original.guestName}</h6>
                <button className="text-gray-700">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Booking ID: {row.original.bookingId}
              </p>
              <p className="text-sm text-gray-600">
                Vehicle: {row.original.vehicle}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(row.original.startDate).toLocaleDateString()} -{" "}
                {new Date(row.original.endDate).toLocaleDateString()}
              </p>
              <span
                className={`px-4 py-1 text-white rounded-md ${
                  row.original.status === "Pending"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {row.original.status}
              </span>
              <p className="text-sm font-bold mt-2">
                Price: NGN{" "}
                {new Intl.NumberFormat("en-NG").format(row.original.price)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
      </div>

      {/* 🖥️ Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#E4E7EC] rounded-md py-3">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-[#344054] text-sm border-b"
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
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔄 Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded-md shadow ${
              table.getCanPreviousPage()
                ? "text-gray-800"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaChevronLeft />
          </button>

          {table.getPageOptions().map((page) => (
            <button
              key={page}
              onClick={() => table.setPageIndex(page)}
              className={`px-3 py-1 rounded-md border ${
                table.getState().pagination.pageIndex === page
                  ? "border-blue-500 text-blue-600 font-bold"
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
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

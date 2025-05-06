"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import PageLayout from "@/components/dashboard/PageLayout";
import CurvedFilledButton from "@/components/core/button/CurvedFilledButton";
import CurvedOutlinedButton from "@/components/core/button/CurvedOutlinedButton";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

const HostPage = () => {
  const originalData: Host[] = [
    {
      id: "12345678",
      name: "Meduka Crystal",
      email: "alexander.adeyemi@gmail.com",
      phone: "+234 802 345 6789",
      location: "Lagos",
    },
    {
      id: "12345679",
      name: "Turner Maduike",
      email: "benjamin.balogun@email.com",
      phone: "+234 818 456 7890",
      location: "Abuja",
    },
    {
      id: "12345680",
      name: "Maduike Chisom",
      email: "charlotte.chukwuma@email.com",
      phone: "+234 814 567 8901",
      location: "Enugu",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtered data
  const filteredData = useMemo(
    () =>
      originalData.filter((host) =>
        Object.values(host).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [searchQuery]
  );

  const columns: ColumnDef<Host>[] = [
    { accessorKey: "id", header: "Host ID" },
    { accessorKey: "name", header: "Host" },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => {
        const email = getValue() as string;
        return (
          <a
            href={`mailto:${email}`}
            className=" hover:underline hover:text-blue-500"
          >
            {email}
          </a>
        );
      },
    },
    { accessorKey: "phone", header: "Phone Number" },
    { accessorKey: "location", header: "Location" },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const router = useRouter();
  return (
    <PageLayout
      buttons={
        <>
          <CurvedOutlinedButton title="Save Draft" />
          <CurvedFilledButton title="Next" disabled={false} />
        </>
      }
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Host</h2>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search for Host"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow w-full rounded-2xl p-3 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <CurvedFilledButton
          rounded="rounded-2xl whitespace-nowrap py-3 px-5"
          title="+ Add New Host"
          onClick={() => router.push("/dashboard/host-onboarding")}
        />
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left">
          <thead className="bg-[#E4E7EC] rounded-md py-3">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 border-gray-50 border-b">
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No hosts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default HostPage;

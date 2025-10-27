"use client";

import React, { useState } from "react";
import { useGetHosts } from "@/lib/hooks/host-management/useHosts";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Host } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import { AlertCircle, Search, View, Edit, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";

export default function HostsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch data using our hook
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData, // True when fetching new page
  } = useGetHosts(currentPage, debouncedSearchTerm);

  const hosts = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Define Actions for the Menu ---
  const getHostActions = (host: Host): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: View,
      onClick: () => toast.success(`Viewing ${host.fullName}`),
      // Example: router.push(`/admin/hosts/${host.id}`)
    },
    {
      label: "Edit Host",
      icon: Edit,
      onClick: () => toast.success(`Editing ${host.fullName}`),
    },
    {
      label: "Deactivate",
      icon: Trash2,
      onClick: () => {
        if (
          window.confirm(
            `Are you sure you want to deactivate ${host.fullName}?`
          )
        ) {
          toast.error(`Deactivating ${host.fullName}`);
          // Example: deleteMutation.mutate(host.id)
        }
      },
      danger: true,
    },
  ];

  // --- Define Columns for the Table ---
  const columns: ColumnDefinition<Host>[] = [
    {
      header: "Full Name",
      accessorKey: "fullName",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Vehicles",
      accessorKey: "totalVehicles",
    },
    {
      header: "Status",
      accessorKey: "active",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getHostActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hosts</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all hosts on the platform.
            </p>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Hosts"
            id="search"
            hideLabel
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* --- Table Display --- */}
        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load hosts.</span>
          </div>
        )}
        {!isLoading && !isError && hosts.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No hosts found.</p>
          </div>
        )}

        {/* Table: Use opacity for loading state on refetch */}
        {!isError && (hosts.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={hosts}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        {/* --- 2. USE THE NEW COMPONENT --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>
    </>
  );
}

"use client";

import React, { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import TextInput from "@/components/generic/ui/TextInput";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionMenu } from "@/components/generic/ui/ActionMenu";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { useGetDriverApplications } from "./useDriverApplications";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { DriverApplication } from "./types";
import { format } from "date-fns";
import CustomBack from "@/components/generic/CustomBack";

export default function DriverApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<
    number | undefined
  >(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useGetDriverApplications(currentPage, 10, {
    searchTerm: debouncedSearchTerm,
    yearsOfExperience,
  });

  const applications = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const columns: ColumnDefinition<DriverApplication>[] = [
    {
      header: "Applicant Name",
      accessorKey: "fullName",
      cell: (app) => (
        <div>
          <p className="font-medium text-gray-900">{app.fullName}</p>
          <p className="text-xs text-gray-500">{app.email}</p>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "primaryPhoneNumber",
    },
    {
      header: "Experience",
      accessorKey: "yearsOfExperience",
      cell: (app) => (
        <span className="font-medium">{app.yearsOfExperience} Years</span>
      ),
    },
    {
      header: "Date Applied",
      accessorKey: "createdAt",
      cell: (app) => format(new Date(app.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (app) => {
        let color = "bg-gray-100 text-gray-700";
        if (app.status === "APPROVED") color = "bg-green-100 text-green-700";
        if (app.status === "REJECTED") color = "bg-red-100 text-red-700";
        if (app.status === "REVIEWED") color = "bg-blue-100 text-blue-700";
        if (app.status === "PENDING") color = "bg-yellow-100 text-yellow-700";

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}
          >
            {app.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (app) => (
        <ActionMenu
          actions={[
            {
              label: "View Details",
              icon: Eye,
              onClick: () => setSelectedAppId(app.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <main className="py-2 max-w-8xl mx-auto px-0 sm:px-0 lg:px-0">
      <CustomBack />
      <div className="mt-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Driver Applications
        </h1>
        <p className="text-gray-600 mt-1">
          Review and manage incoming applications from drivers.
        </p>
      </div>
      <div className="bg-white p-4 border border-gray-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              label="Search Applications"
              id="search"
              hideLabel
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: 40 }}
            />
          </div>

          <Button
            variant="secondary"
            className="w-full md:w-auto h-[46px]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "More Filters"}
          </Button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
            <div>
              <TextInput
                label="Years of Experience"
                id="yearsOfExperience"
                type="number"
                min="1"
                max="40"
                placeholder="e.g. 3"
                value={yearsOfExperience || ""}
                onChange={(e) =>
                  setYearsOfExperience(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
            <div className="flex items-end pb-1">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setYearsOfExperience(undefined);
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium py-3 px-2"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
      {isLoading ? (
        <CustomLoader />
      ) : isError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-600 font-medium">
            Failed to load applications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <CustomTable
            data={applications}
            columns={columns}
            getUniqueRowId={(item) => item.id}
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      {selectedAppId && (
        <ApplicationDetailModal
          applicationId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </main>
  );
}

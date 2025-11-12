// app/dashboard/settings/roles/UserRoleManager.tsx
"use client";

import React, { useState } from "react";
import { useGetAdmins } from "@/lib/hooks/admin/useAdmins"; // Adjust path
import { AdminUser, PaginatedResponse } from "./types";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import TextInput from "@/components/generic/ui/TextInput";
import CustomLoader from "@/components/generic/CustomLoader";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { User, Search, Settings } from "lucide-react";
import Button from "@/components/generic/ui/Button";

interface UserRoleManagerProps {
  onAssignClick: (user: AdminUser) => void;
}

export function UserRoleManager({ onAssignClick }: UserRoleManagerProps) {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: adminData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetAdmins(page, debouncedSearchTerm);

  const admins = (adminData as PaginatedResponse<AdminUser>)?.content || [];
  const totalPages =
    (adminData as PaginatedResponse<AdminUser>)?.totalPages || 0;

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <TextInput
          id="admin-search"
          hideLabel
          label="Search Admins"
          placeholder="Search admins by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          style={{ paddingLeft: 35 }}
        />
      </div>

      {/* Admin List */}
      <div className="flex-1 space-y-3 pr-2 h-[450px] overflow-y-auto">
        {isLoading && <CustomLoader />}
        {isError && <p className="text-red-500">Failed to load admins.</p>}
        {!isLoading && admins.length === 0 && (
          <p className="text-gray-500">No admins found.</p>
        )}
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-gray-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-auto px-3"
              onClick={() => onAssignClick(admin)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Roles
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isPlaceholderData}
      />
    </div>
  );
}

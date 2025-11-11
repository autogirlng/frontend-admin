// app/dashboard/autogirl/AssignAdminModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Plus, AlertCircle, User } from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { useGetAdmins } from "@/lib/hooks/admin/useAdmins"; // Adjust path
import { useAssignDepartment } from "@/lib/hooks/admin/useDepartments";
import { Department, AdminUser, PaginatedResponse } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import clsx from "clsx";

interface AssignAdminModalProps {
  department: Department;
  onClose: () => void;
}

export function AssignAdminModal({
  department,
  onClose,
}: AssignAdminModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: adminData,
    isLoading: isSearching,
    isError,
    isPlaceholderData,
  } = useGetAdmins(page, debouncedSearchTerm);

  const assignMutation = useAssignDepartment();

  // Filter for admins who are NOT already in a department
  const unassignedAdmins = useMemo(() => {
    return (
      (adminData as PaginatedResponse<AdminUser>)?.content.filter(
        (admin) => !admin.departmentName
      ) || []
    );
  }, [adminData]);

  const totalPages =
    (adminData as PaginatedResponse<AdminUser>)?.totalPages || 0;

  const handleAssign = (userId: string) => {
    setSelectedUserId(userId); // Set loading state for this button
    assignMutation.mutate(
      { userId, departmentId: department.id },
      {
        onSuccess: () => {
          setSelectedUserId(null);
          // Don't close, let them add more
        },
        onError: () => setSelectedUserId(null),
      }
    );
  };

  const renderResults = () => {
    if (isSearching && !adminData) {
      return (
        <div className="h-64">
          <CustomLoader />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center gap-2 p-4 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <span className="font-semibold">Failed to load admins.</span>
        </div>
      );
    }
    if (unassignedAdmins.length === 0) {
      return (
        <p className="p-4 text-center text-gray-500 h-64">
          No unassigned admins found.
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {unassignedAdmins.map((admin: AdminUser) => {
          const isLoading = selectedUserId === admin.id;
          return (
            <div
              key={admin.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                variant="primary"
                size="sm"
                className="w-auto px-3"
                onClick={() => handleAssign(admin.id)}
                isLoading={isLoading}
                disabled={assignMutation.isPending}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Assign Admin to {department.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={assignMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              label="Search Unassigned Admins"
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
          <div
            className={clsx(
              "max-h-80 overflow-y-auto pr-2",
              isPlaceholderData && "opacity-50"
            )}
          >
            {renderResults()}
          </div>
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isPlaceholderData}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={assignMutation.isPending}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

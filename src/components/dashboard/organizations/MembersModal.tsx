"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { OrganizationMember } from "./types";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomLoader from "@/components/generic/CustomLoader";
import { useGetOrganizationMembers } from "@/lib/hooks/organizations/useOrganizations";

interface MembersModalProps {
  organizationId: string;
  organizationName: string;
  onClose: () => void;
}

const formatPrice = (price: number = 0) => `₦${price.toLocaleString()}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatRole = (role: string) =>
  role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function MembersModal({
  organizationId,
  organizationName,
  onClose,
}: MembersModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const { data: membersData, isLoading } = useGetOrganizationMembers(organizationId, currentPage);
  const members = membersData?.content ?? [];
  const totalPages = membersData?.totalPages ?? 0;

  const columns: ColumnDefinition<OrganizationMember>[] = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.firstName} {item.lastName}
          </div>
          <div className="text-gray-500">{item.email}</div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item) => (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
          {formatRole(item.role)}
        </span>
      ),
    },
    {
      header: "Amount Spent",
      accessorKey: "amountSpent",
      cell: (item) => <span>{formatPrice(item.amountSpent)}</span>,
    },
    {
      header: "Joined",
      accessorKey: "joinedAt",
      cell: (item) => <span>{formatDate(item.joinedAt)}</span>,
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
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Members
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{organizationName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <CustomLoader size="sm" showText={false} />
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
              <AlertCircle className="h-8 w-8" />
              <span>No members found.</span>
            </div>
          ) : (
            <>
              <CustomTable
                data={members}
                columns={columns}
                getUniqueRowId={(item) => item.memberId}
              />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

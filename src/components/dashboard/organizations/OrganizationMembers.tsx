"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { AlertCircle, Search } from "lucide-react";
import { OrganizationMember } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { useGetOrganizationMembers } from "@/lib/hooks/organizations/useOrganizations";

interface OrganizationMembersProps {
  organizationId: string;
  organizationName?: string;
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

export default function OrganizationMembers({
  organizationId,
  organizationName,
}: OrganizationMembersProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const { data: membersData, isLoading } = useGetOrganizationMembers(
    organizationId,
    currentPage
  );
  const totalPages = membersData?.totalPages ?? 0;

  const filteredMembers = useMemo(() => {
    const members = membersData?.content ?? [];
    if (!searchTerm.trim()) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(
      (m: OrganizationMember) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term)
    );
  }, [searchTerm, membersData?.content]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

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
    <>
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          {organizationName && (
            <p className="text-lg text-gray-600 mt-1">{organizationName}</p>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Members"
            id="search-org-members"
            hideLabel
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
            <AlertCircle className="h-8 w-8" />
            <span>No members found.</span>
          </div>
        ) : (
          <>
            <CustomTable
              data={filteredMembers}
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
      </main>
    </>
  );
}

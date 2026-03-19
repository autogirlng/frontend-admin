"use client";

import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { OrganizationAdmin } from "./types";
import { useGetOrganizationDetails } from "@/lib/hooks/organizations/useOrganizations";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

interface OrganizationDetailProps {
  organizationId: string;
}

interface DetailRow {
  id: string;
  label: string;
  value: React.ReactNode;
}

const formatPrice = (price: number = 0) => `₦${price.toLocaleString()}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const detailColumns: ColumnDefinition<DetailRow>[] = [
  {
    header: "Field",
    accessorKey: "label",
    cell: (item) => (
      <span className="text-sm font-medium text-gray-500">{item.label}</span>
    ),
  },
  {
    header: "Value",
    accessorKey: "value",
    cell: (item) => (
      <span className="font-semibold text-gray-900">
        {item.value || <span className="text-gray-400">N/A</span>}
      </span>
    ),
  },
];

const adminColumns: ColumnDefinition<OrganizationAdmin>[] = [
  {
    header: "Name",
    accessorKey: "firstName",
    cell: (item) => (
      <span className="font-medium text-gray-900">
        {item.firstName} {item.lastName}
      </span>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: (item) => (
      <span className="text-gray-600 break-all">{item.email}</span>
    ),
  },
  {
    header: "Phone",
    accessorKey: "phoneNumber",
    cell: (item) => <span className="text-gray-600">{item.phoneNumber}</span>,
  },
];

export default function OrganizationDetail({
  organizationId,
}: OrganizationDetailProps) {
  const { data: org, isLoading, isError } = useGetOrganizationDetails(organizationId);

  const businessInfoRows: DetailRow[] = org
    ? [
        { id: "rc", label: "RC Number", value: org.rcNumber },
        { id: "industry", label: "Industry", value: org.industry },
        { id: "created", label: "Created", value: formatDate(org.createdAt) },
        {
          id: "kyc",
          label: "KYC Status",
          value: (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              {org.kycDetails.status.replace(/_/g, " ")}
            </span>
          ),
        },
      ]
    : [];

  const statsRows: DetailRow[] = org
    ? [
        { id: "staff", label: "Total Staff", value: String(org.totalStaffCount) },
        { id: "bookings", label: "Total Bookings", value: String(org.totalBookingsDone) },
        { id: "wallet", label: "Wallet Balance", value: formatPrice(org.walletBalance) },
        { id: "funded", label: "Total Funded", value: formatPrice(org.totalAmountFunded) },
        { id: "spent", label: "Total Spent", value: formatPrice(org.totalAmountSpent) },
      ]
    : [];

  const bankRows: DetailRow[] = org
    ? [
        { id: "acctNum", label: "Account Number", value: org.virtualAccountNumber },
        { id: "bank", label: "Bank Name", value: org.bankName },
        { id: "acctName", label: "Account Name", value: org.accountName },
      ]
    : [];

  return (
    <>
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Details
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : isError || !org ? (
          <div className="flex flex-col items-center gap-2 p-10 text-red-500 bg-red-50 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <p className="font-medium">Failed to load organization details.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  {org.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${
                    org.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {org.active ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {org.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Business Information
              </h4>
              <CustomTable
                data={businessInfoRows}
                columns={detailColumns}
                getUniqueRowId={(item) => item.id}
              />
            </div>

            {/* Statistics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Statistics
              </h4>
              <CustomTable
                data={statsRows}
                columns={detailColumns}
                getUniqueRowId={(item) => item.id}
              />
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Bank Details
              </h4>
              <CustomTable
                data={bankRows}
                columns={detailColumns}
                getUniqueRowId={(item) => item.id}
              />
            </div>

            {/* Admins */}
            {org.admins.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Admins ({org.admins.length})
                </h4>
                <CustomTable
                  data={org.admins}
                  columns={adminColumns}
                  getUniqueRowId={(item) => item.userId}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

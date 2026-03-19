"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Organization } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import {
  Search,
  View,
  FileText,
  CreditCard,
  Users,
  ShoppingCart,
  AlertCircle,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import { useGetPendingKycOrganizations, useReviewKyc } from "@/lib/hooks/organizations/useOrganizations";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getKycStatusClasses = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "SUBMITTED":
      return "bg-yellow-100 text-yellow-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const handleCopyRcNumber = (rcNumber: string) => {
  navigator.clipboard.writeText(rcNumber);
  toast.success("RC number copied!");
};

export default function AllPendingApprovals() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const [rejectingOrg, setRejectingOrg] = useState<Organization | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const reviewKycMutation = useReviewKyc();

  const { data: orgData, isLoading } = useGetPendingKycOrganizations(
    currentPage,
    searchTerm
  );
  const organizations = useMemo(
    () => orgData?.content ?? [],
    [orgData?.content]
  );
  const totalPages = orgData?.totalPages ?? 0;

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handleApprove = (org: Organization) => {
    reviewKycMutation.mutate(
      {
        orgId: org.organizationId,
        payload: { status: "APPROVED", remarks: "" },
      },
      {
        onSuccess: () => toast.success("KYC approved successfully"),
        onError: () => toast.error("Failed to approve KYC"),
      }
    );
  };

  const handleRejectSubmit = () => {
    if (!rejectingOrg || !rejectRemarks.trim()) return;
    reviewKycMutation.mutate(
      {
        orgId: rejectingOrg.organizationId,
        payload: { status: "REJECTED", remarks: rejectRemarks },
      },
      {
        onSuccess: () => {
          toast.success("KYC rejected successfully");
          setRejectingOrg(null);
          setRejectRemarks("");
        },
        onError: () => toast.error("Failed to reject KYC"),
      }
    );
  };

  const getOrgActions = (org: Organization): ActionMenuItem[] => [
    {
      label: "Organization Details",
      icon: View,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/details`
        ),
    },
    {
      label: "Booking Details",
      icon: ShoppingCart,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/bookings`
        ),
    },
    {
      label: "KYC History",
      icon: FileText,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/kyc-history`
        ),
    },
    {
      label: "Transactions",
      icon: CreditCard,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/transactions`
        ),
    },
    {
      label: "Members",
      icon: Users,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/members`
        ),
    },
    {
      label: "Approve",
      icon: CheckCircle,
      onClick: () => handleApprove(org),
    },
    {
      label: "Reject",
      icon: XCircle,
      onClick: () => {
        setRejectingOrg(org);
        setRejectRemarks("");
      },
      danger: true,
    },
  ];

  const columns: ColumnDefinition<Organization>[] = [
    {
      header: "RC Number",
      accessorKey: "rcNumber",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-gray-700">
            {item.rcNumber || "N/A"}
          </span>
          {item.rcNumber && (
            <button
              onClick={() => handleCopyRcNumber(item.rcNumber)}
              className="text-gray-400 hover:text-[#0096FF] transition-colors p-1 rounded hover:bg-blue-50"
              title="Copy RC Number"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-gray-500">{item.creatorEmail}</div>
        </div>
      ),
    },
    { header: "Industry", accessorKey: "industry" },
    {
      header: "KYC Status",
      accessorKey: "kycStatus",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getKycStatusClasses(
            item.kycStatus
          )}`}
        >
          {item.kycStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (item) => <span>{formatDate(item.createdAt)}</span>,
    },
    {
      header: "Actions",
      accessorKey: "organizationId",
      cell: (item) => <ActionMenu actions={getOrgActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Pending Approvals
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Organizations with pending KYC verification.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Pending Organizations"
            id="search-pending-orgs"
            hideLabel
            type="text"
            placeholder="Search by name, RC number, industry, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : organizations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
            <AlertCircle className="h-8 w-8" />
            <p>No pending approvals found.</p>
          </div>
        ) : (
          <CustomTable
            data={organizations}
            columns={columns}
            getUniqueRowId={(item) => item.organizationId}
          />
        )}

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Reject Modal */}
        {rejectingOrg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => { setRejectingOrg(null); setRejectRemarks(""); }}
            />
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Reject KYC
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Organization: {rejectingOrg.name}
              </p>
              <div className="space-y-4">
                <TextInput
                  label="Remarks (required)"
                  id="reject-remarks"
                  type="text"
                  placeholder="Enter rejection reason..."
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  className="w-full"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" size="sm" onClick={() => { setRejectingOrg(null); setRejectRemarks(""); }}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!rejectRemarks.trim() || reviewKycMutation.isPending}
                    onClick={handleRejectSubmit}
                  >
                    {reviewKycMutation.isPending ? "Submitting..." : "Confirm Rejection"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Organization } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import {
  Search,
  Building2,
  CheckCircle,
  XCircle,
  View,
  ShoppingCart,
  FileText,
  CreditCard,
  Users,
  ArrowRight,
  Copy,
  CalendarPlus,
  TrendingDown,
  UserCheck,
  ShoppingBag,
  BarChart3,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const handleCopyRcNumber = (rcNumber: string) => {
  navigator.clipboard.writeText(rcNumber);
  toast.success("RC number copied!");
};
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { StatCard } from "@/components/dashboard/dashboard/StatsCard";
import CustomLoader from "@/components/generic/CustomLoader";
import {
  useGetOrganizations,
  useGetCorporateStats,
  useGetPendingKycOrganizations,
  useReviewKyc,
} from "@/lib/hooks/organizations/useOrganizations";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatKycStatus = (status: string) => {
  return status.replace(/_/g, " ");
};

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

export default function Organizations() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectingOrg, setRejectingOrg] = useState<Organization | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const { data: orgData, isLoading: orgsLoading } = useGetOrganizations(0, searchTerm, 10);
  const { data: stats, isLoading: statsLoading } = useGetCorporateStats();
  const { data: pendingData, isLoading: pendingLoading } = useGetPendingKycOrganizations(0, "", 10);
  const reviewKycMutation = useReviewKyc();

  const organizations = useMemo(() => orgData?.content ?? [], [orgData?.content]);
  const pendingOrgs = useMemo(() => pendingData?.content ?? [], [pendingData?.content]);

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
  ];

  const getPendingOrgActions = (org: Organization): ActionMenuItem[] => [
    ...getOrgActions(org),
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
          {formatKycStatus(item.kycStatus)}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (item) => <span>{formatDate(item.createdAt)}</span>,
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
      accessorKey: "organizationId",
      cell: (item) => <ActionMenu actions={getOrgActions(item)} />,
    },
  ];

  const pendingColumns: ColumnDefinition<Organization>[] = [
    ...columns.slice(0, -1),
    {
      header: "Actions",
      accessorKey: "organizationId",
      cell: (item) => <ActionMenu actions={getPendingOrgActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-lg text-gray-600 mt-1">
            Overview of all organizations on the platform.
          </p>
        </div>

        {/* Stat Cards */}
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Organizations"
              value={String(stats.totalOrganizations)}
              icon={Building2}
              iconColorClasses="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Active Organizations"
              value={String(stats.activeOrganizations)}
              icon={CheckCircle}
              iconColorClasses="bg-green-100 text-green-600"
            />
            <StatCard
              title="Inactive Organizations"
              value={String(stats.inactiveOrganizations)}
              icon={XCircle}
              iconColorClasses="bg-red-100 text-red-600"
            />
            <StatCard
              title="New This Month"
              value={String(stats.newOrganizationsThisMonth)}
              icon={CalendarPlus}
              iconColorClasses="bg-purple-100 text-purple-600"
            />
            <StatCard
              title="Churn Rate"
              value={`${stats.churnRatePercentage}%`}
              icon={TrendingDown}
              iconColorClasses="bg-orange-100 text-orange-600"
            />
            <StatCard
              title="Total Corporate Staff"
              value={String(stats.totalCorporateStaff)}
              icon={UserCheck}
              iconColorClasses="bg-indigo-100 text-indigo-600"
            />
            <StatCard
              title="Total Bookings"
              value={String(stats.totalCorporateBookings)}
              icon={ShoppingBag}
              iconColorClasses="bg-teal-100 text-teal-600"
            />
            <StatCard
              title="Avg Bookings / Org"
              value={String(stats.averageBookingsPerOrganization)}
              icon={BarChart3}
              iconColorClasses="bg-cyan-100 text-cyan-600"
            />
            <StatCard
              title="Global Wallet Balance"
              value={`₦${stats.totalGlobalWalletBalance.toLocaleString()}`}
              icon={Wallet}
              iconColorClasses="bg-emerald-100 text-emerald-600"
            />
            <StatCard
              title="Lifetime Funded"
              value={`₦${stats.totalLifetimeFunded.toLocaleString()}`}
              icon={ArrowUpCircle}
              iconColorClasses="bg-lime-100 text-lime-600"
            />
            <StatCard
              title="Lifetime Spent"
              value={`₦${stats.totalLifetimeSpent.toLocaleString()}`}
              icon={ArrowDownCircle}
              iconColorClasses="bg-rose-100 text-rose-600"
            />
          </div>
        ) : null}

        {/* Search + View All */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              label="Search Organizations"
              id="search-orgs"
              hideLabel
              type="text"
              placeholder="Search by name, RC number, industry, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: 35 }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              size="smd"
              onClick={() => router.push("/dashboard/organizations/pending-approvals")}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <Clock className="mr-2 h-4 w-4" />
              Pending Approvals
            </Button>
            <Button
              variant="primary"
              size="smd"
              onClick={() => router.push("/dashboard/organizations/all")}
              className="w-full sm:w-auto min-w-50 whitespace-nowrap"
            >
              View All Organizations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        {orgsLoading ? (
          <div className="flex justify-center py-10">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : organizations.length === 0 ? (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No organizations found.</p>
          </div>
        ) : (
          <CustomTable
            data={organizations}
            columns={columns}
            getUniqueRowId={(item) => item.organizationId}
          />
        )}

        {/* Pending Approvals Preview */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Approvals
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/dashboard/organizations/pending-approvals")}
              className="whitespace-nowrap"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          {pendingLoading ? (
            <div className="flex justify-center py-8">
              <CustomLoader size="sm" showText={false} />
            </div>
          ) : pendingOrgs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-gray-500">
              <AlertCircle className="h-6 w-6" />
              <p>No pending approvals.</p>
            </div>
          ) : (
            <CustomTable
              data={pendingOrgs}
              columns={pendingColumns}
              getUniqueRowId={(item) => item.organizationId}
            />
          )}
        </div>

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
                  id="reject-remarks-org"
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

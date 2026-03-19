"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, AlertCircle, Search } from "lucide-react";
import { KycHistory } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { useGetKycHistory, useReviewKyc } from "@/lib/hooks/organizations/useOrganizations";
import { Toaster, toast } from "react-hot-toast";

interface OrganizationKycHistoryProps {
  organizationId: string;
  organizationName?: string;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClasses = (status: string) => {
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

export default function OrganizationKycHistory({
  organizationId,
  organizationName,
}: OrganizationKycHistoryProps) {
  const { data: kycRecords = [], isLoading } = useGetKycHistory(organizationId);
  const reviewKycMutation = useReviewKyc();
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewingKyc, setReviewingKyc] = useState<KycHistory | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");

  const openReview = (kyc: KycHistory, action: "APPROVED" | "REJECTED") => {
    setReviewingKyc(kyc);
    setReviewAction(action);
    setReviewRemarks("");
  };

  const closeReview = () => {
    setReviewingKyc(null);
    setReviewAction(null);
    setReviewRemarks("");
  };

  const canSubmit =
    reviewAction === "APPROVED" || (reviewAction === "REJECTED" && reviewRemarks.trim() !== "");

  const handleReviewSubmit = () => {
    if (!reviewingKyc || !reviewAction || !canSubmit) return;
    reviewKycMutation.mutate(
      {
        orgId: organizationId,
        payload: { status: reviewAction, remarks: reviewRemarks },
      },
      {
        onSuccess: () => {
          toast.success(
            reviewAction === "APPROVED"
              ? "KYC approved successfully"
              : "KYC rejected successfully"
          );
          closeReview();
        },
        onError: () => {
          toast.error("Failed to submit review");
        },
      }
    );
  };

  const handleApprove = () => {
    reviewKycMutation.mutate(
      {
        orgId: organizationId,
        payload: { status: "APPROVED", remarks: "" },
      },
      {
        onSuccess: () => {
          toast.success("KYC approved successfully");
        },
        onError: () => {
          toast.error("Failed to approve KYC");
        },
      }
    );
  };

  const getKycActions = (kyc: KycHistory): ActionMenuItem[] => [
    {
      label: "Approve",
      icon: CheckCircle,
      onClick: () => handleApprove(),
    },
    {
      label: "Reject",
      icon: XCircle,
      onClick: () => openReview(kyc, "REJECTED"),
      danger: true,
    },
  ];

  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return kycRecords;
    const term = searchTerm.toLowerCase();
    return kycRecords.filter(
      (r: KycHistory) =>
        (r.cacNumber || "").toLowerCase().includes(term) ||
        (r.officeAddress || "").toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term) ||
        (r.reviewedByEmail || "").toLowerCase().includes(term)
    );
  }, [searchTerm, kycRecords]);

  const columns: ColumnDefinition<KycHistory>[] = [
    {
      header: "CAC Number",
      accessorKey: "cacNumber",
      cell: (item) => (
        <span className="font-medium text-gray-900">
          {item.cacNumber || "N/A"}
        </span>
      ),
    },
    {
      header: "Office Address",
      accessorKey: "officeAddress",
      cell: (item) => (
        <span className="text-gray-600 truncate max-w-50 block">
          {item.officeAddress || "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(
            item.status
          )}`}
        >
          {item.status.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Submitted",
      accessorKey: "submittedAt",
      cell: (item) => <span>{formatDate(item.submittedAt)}</span>,
    },
    {
      header: "Reviewed By",
      accessorKey: "reviewedByEmail",
      cell: (item) => (
        <span className="text-gray-600">{item.reviewedByEmail || "N/A"}</span>
      ),
    },
    {
      header: "Reviewed At",
      accessorKey: "reviewedAt",
      cell: (item) => (
        <span className="text-gray-600">
          {item.reviewedAt ? formatDate(item.reviewedAt) : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "kycId",
      cell: (item) => <ActionMenu actions={getKycActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC History</h1>
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
            label="Search KYC History"
            id="search-kyc-history"
            hideLabel
            type="text"
            placeholder="Search by CAC number, address, status, or reviewer..."
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
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
            <AlertCircle className="h-8 w-8" />
            <span>No KYC history found.</span>
          </div>
        ) : (
          <CustomTable
            data={filteredRecords}
            columns={columns}
            getUniqueRowId={(item) => item.kycId}
          />
        )}

        {/* Reject Review Modal */}
        {reviewingKyc && reviewAction === "REJECTED" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeReview}
            />
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Reject KYC
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                CAC: {reviewingKyc.cacNumber}
              </p>
              <div className="space-y-4">
                <TextInput
                  label="Remarks (required)"
                  id="review-remarks"
                  type="text"
                  placeholder="Enter rejection reason..."
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  className="w-full"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" size="sm" onClick={closeReview}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!canSubmit || reviewKycMutation.isPending}
                    onClick={handleReviewSubmit}
                  >
                    {reviewKycMutation.isPending
                      ? "Submitting..."
                      : "Confirm Rejection"}
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

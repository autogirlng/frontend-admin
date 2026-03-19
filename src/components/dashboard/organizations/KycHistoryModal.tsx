"use client";

import React, { useState } from "react";
import { X, ClipboardCheck, AlertCircle } from "lucide-react";
import { KycHistory } from "./types";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { useGetKycHistory, useReviewKyc } from "@/lib/hooks/organizations/useOrganizations";
import { toast } from "react-hot-toast";

interface KycHistoryModalProps {
  organizationId: string;
  organizationName: string;
  onClose: () => void;
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

export function KycHistoryModal({
  organizationId,
  organizationName,
  onClose,
}: KycHistoryModalProps) {
  const { data: kycRecords = [], isLoading } = useGetKycHistory(organizationId);
  const reviewKycMutation = useReviewKyc();
  const [reviewingKyc, setReviewingKyc] = useState<KycHistory | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string>("");
  const [reviewRemarks, setReviewRemarks] = useState<string>("");

  const getKycActions = (kyc: KycHistory): ActionMenuItem[] => [
    {
      label: "Review",
      icon: ClipboardCheck,
      onClick: () => {
        setReviewingKyc(kyc);
        setReviewStatus("");
        setReviewRemarks("");
      },
    },
  ];

  const handleReviewSubmit = () => {
    if (!reviewingKyc || !reviewStatus || !reviewRemarks.trim()) return;
    reviewKycMutation.mutate(
      {
        orgId: organizationId,
        payload: { status: reviewStatus, remarks: reviewRemarks },
      },
      {
        onSuccess: () => {
          toast.success("KYC review submitted");
          setReviewingKyc(null);
          setReviewStatus("");
          setReviewRemarks("");
        },
        onError: () => {
          toast.error("Failed to submit review");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              KYC History
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
          ) : kycRecords.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
              <AlertCircle className="h-8 w-8" />
              <span>No KYC history found.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">CAC Number</th>
                      <th className="px-4 py-3">Office Address</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Reviewed By</th>
                      <th className="px-4 py-3">Reviewed At</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {kycRecords.map((kyc) => (
                      <tr key={kyc.kycId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">
                          {kyc.cacNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-50 truncate">
                          {kyc.officeAddress || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(
                              kyc.status
                            )}`}
                          >
                            {kyc.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(kyc.submittedAt)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {kyc.reviewedByEmail || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {kyc.reviewedAt ? formatDate(kyc.reviewedAt) : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <ActionMenu actions={getKycActions(kyc)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {kycRecords.map((kyc) => (
                  <div
                    key={kyc.kycId}
                    className="border border-gray-200 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {kyc.cacNumber || "N/A"}
                      </span>
                      <ActionMenu actions={getKycActions(kyc)} />
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Address: </span>
                      <span className="text-gray-600">
                        {kyc.officeAddress || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Status: </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(
                          kyc.status
                        )}`}
                      >
                        {kyc.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Submitted: </span>
                      <span className="text-gray-600">
                        {formatDate(kyc.submittedAt)}
                      </span>
                    </div>
                    {kyc.reviewedByEmail && (
                      <div className="text-sm">
                        <span className="text-gray-500">Reviewed by: </span>
                        <span className="text-gray-600">
                          {kyc.reviewedByEmail}
                        </span>
                      </div>
                    )}
                    {kyc.reviewRemarks && (
                      <div className="text-sm">
                        <span className="text-gray-500">Remarks: </span>
                        <span className="text-gray-600">
                          {kyc.reviewRemarks}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Sub-form */}
          {reviewingKyc && (
            <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Review KYC — {reviewingKyc.cacNumber}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Decision
                  </label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#0096FF] focus:ring-[#0096FF] focus:outline-none"
                  >
                    <option value="">Select decision...</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </div>
                <TextInput
                  label="Remarks"
                  id="review-remarks"
                  type="text"
                  placeholder="Enter review remarks..."
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  className="w-full"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setReviewingKyc(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!reviewStatus || !reviewRemarks.trim()}
                    onClick={handleReviewSubmit}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

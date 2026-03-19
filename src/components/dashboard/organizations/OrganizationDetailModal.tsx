"use client";

import React from "react";
import {
  X,
  Mail,
  Phone,
  Building2,
  Hash,
  Briefcase,
  Calendar,
  Users,
  ShoppingCart,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Landmark,
  User,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { useGetOrganizationDetails } from "@/lib/hooks/organizations/useOrganizations";
import CustomLoader from "@/components/generic/CustomLoader";

interface OrganizationDetailModalProps {
  organizationId: string;
  onClose: () => void;
}

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900 wrap-break-word">
        {value || <span className="text-gray-400">N/A</span>}
      </p>
    </div>
  </div>
);

const formatPrice = (price: number = 0) => `₦${price.toLocaleString()}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function OrganizationDetailModal({
  organizationId,
  onClose,
}: OrganizationDetailModalProps) {
  const { data: org, isLoading, isError } = useGetOrganizationDetails(organizationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Organization Details
          </h3>
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
          ) : isError || !org ? (
            <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
              <p>Failed to load organization details.</p>
            </div>
          ) : (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
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

            {/* Business Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Business Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem icon={Hash} label="RC Number" value={org.rcNumber} />
                <DetailItem
                  icon={Briefcase}
                  label="Industry"
                  value={org.industry}
                />
                <DetailItem
                  icon={Calendar}
                  label="Created"
                  value={formatDate(org.createdAt)}
                />
                <DetailItem
                  icon={Shield}
                  label="KYC Status"
                  value={org.kycDetails.status.replace(/_/g, " ")}
                />
              </div>
            </div>

            {/* Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Statistics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem
                  icon={Users}
                  label="Total Staff"
                  value={org.totalStaffCount}
                />
                <DetailItem
                  icon={ShoppingCart}
                  label="Total Bookings"
                  value={org.totalBookingsDone}
                />
                <DetailItem
                  icon={Wallet}
                  label="Wallet Balance"
                  value={formatPrice(org.walletBalance)}
                />
                <DetailItem
                  icon={ArrowUpCircle}
                  label="Total Funded"
                  value={formatPrice(org.totalAmountFunded)}
                />
                <DetailItem
                  icon={ArrowDownCircle}
                  label="Total Spent"
                  value={formatPrice(org.totalAmountSpent)}
                />
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Bank Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem
                  icon={CreditCard}
                  label="Account Number"
                  value={org.virtualAccountNumber}
                />
                <DetailItem
                  icon={Landmark}
                  label="Bank Name"
                  value={org.bankName}
                />
                <DetailItem
                  icon={User}
                  label="Account Name"
                  value={org.accountName}
                />
              </div>
            </div>

            {/* Admins */}
            {org.admins.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Admins ({org.admins.length})
                </h4>
                <div className="space-y-3">
                  {org.admins.map((admin) => (
                    <div
                      key={admin.userId}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {admin.firstName} {admin.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 break-all">
                          {admin.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {admin.phoneNumber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </div>

      </div>
    </div>
  );
}

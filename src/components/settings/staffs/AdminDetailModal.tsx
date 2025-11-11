// app/dashboard/settings/staffs/AdminDetailModal.tsx
"use client";

import React from "react";
import {
  X,
  AlertCircle,
  Mail,
  Phone,
  User,
  Shield,
  Briefcase,
  CheckCircle,
  XCircle,
  BadgeCheck,
} from "lucide-react";
import { useGetAdminDetails } from "@/lib/hooks/settings/useAdmins";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";

interface AdminDetailModalProps {
  adminId: string;
  onClose: () => void;
}

// --- Helper: Avatar Component ---
const Avatar = ({ src, name }: { src?: string; name: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-20 w-20 rounded-full object-cover"
      />
    );
  }
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <span className="text-3xl font-semibold text-gray-600">{initials}</span>
    </div>
  );
};

// --- Helper: Detail Item Component ---
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
    <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900 break-words">
        {value || <span className="text-gray-400">N/A</span>}
      </p>
    </div>
  </div>
);

// --- Helper: Info Card Wrapper ---
const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 border border-gray-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export function AdminDetailModal({ adminId, onClose }: AdminDetailModalProps) {
  const { data: admin, isLoading, isError } = useGetAdminDetails(adminId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-72">
          <CustomLoader />
        </div>
      );
    }

    if (isError || !admin) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load admin details.</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* --- Header Section --- */}
        <div className="flex items-center gap-4 p-4 bg-gray-50">
          <Avatar
            src={admin.profilePictureUrl}
            name={`${admin.firstName} ${admin.lastName}`}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {admin.firstName} {admin.lastName}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800`}
            >
              <BadgeCheck className="h-3 w-3" />
              {admin.userType}
            </span>
          </div>
        </div>

        {/* --- Main Details Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact & Role */}
          <InfoCard title="Contact & Role">
            <DetailItem icon={Mail} label="Email" value={admin.email} />
            <DetailItem
              icon={Phone}
              label="Phone Number"
              value={admin.phoneNumber}
            />
            <DetailItem
              icon={Briefcase}
              label="Department"
              value={admin.department?.name}
            />
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Roles</p>
              {admin.roles && admin.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {admin.roles.map((role) => (
                    <span
                      key={role.id}
                      className="px-2 py-0.5 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-base font-semibold text-gray-400">
                  No roles assigned
                </p>
              )}
            </div>
          </InfoCard>

          {/* Account Status */}
          <InfoCard title="Account Status">
            <DetailItem
              icon={CheckCircle}
              label="Email Verified"
              value={
                <span
                  className={
                    admin.emailVerified ? "text-green-600" : "text-red-600"
                  }
                >
                  {admin.emailVerified ? "Yes" : "No"}
                </span>
              }
            />
            <DetailItem
              icon={CheckCircle}
              label="Phone Verified"
              value={
                <span
                  className={
                    admin.phoneVerified ? "text-green-600" : "text-red-600"
                  }
                >
                  {admin.phoneVerified ? "Yes" : "No"}
                </span>
              }
            />
            <DetailItem icon={User} label="User ID" value={admin.userId} />
          </InfoCard>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Staff Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-lg">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

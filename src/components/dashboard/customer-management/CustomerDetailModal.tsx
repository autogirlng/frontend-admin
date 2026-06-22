"use client";

import React from "react";
import {
  X,
  AlertCircle,
  Mail,
  Phone,
  ShoppingCart,
  Users,
  Banknote,
  CheckCircle,
  XCircle,
  Code,
} from "lucide-react";
import { useGetCustomerDetails } from "@/lib/hooks/customer-management/useCustomers";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";

interface CustomerDetailModalProps {
  customerId: string;
  onClose: () => void;
}

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

const formatPrice = (price: number = 0) => {
  return `₦${price.toLocaleString()}`;
};

export function CustomerDetailModal({
  customerId,
  onClose,
}: CustomerDetailModalProps) {
  const {
    data: customer,
    isLoading,
    isError,
  } = useGetCustomerDetails(customerId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-72 flex items-center justify-center">
          <CustomLoader />
        </div>
      );
    }

    if (isError || !customer) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">
            Failed to load customer details.
          </span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Avatar src={customer.profilePictureUrl} name={customer.fullName} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.fullName}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 text-xs font-medium rounded-full ${
                customer.active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {customer.active ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {customer.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <DetailItem icon={Mail} label="Email" value={customer.email} />
          <DetailItem
            icon={Phone}
            label="Phone Number"
            value={customer.phoneNumber}
          />
          <DetailItem
            icon={ShoppingCart}
            label="Total Bookings"
            value={customer.totalBookings}
          />
          <DetailItem
            icon={Users}
            label="Total Referrals"
            value={customer.totalReferrals}
          />
          <DetailItem
            icon={Banknote}
            label="Referral Wallet"
            value={formatPrice(customer.referralWalletBalance)}
          />
          <DetailItem
            icon={Code}
            label="API Access"
            value={
              <span
                className={
                  customer.canSeeApi
                    ? "text-green-600 font-semibold"
                    : "text-gray-500"
                }
              >
                {customer.canSeeApi ? "Enabled" : "Disabled"}
              </span>
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white shadow-xl rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Customer Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{renderContent()}</div>
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-lg mt-auto">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

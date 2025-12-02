"use client";

import React from "react";
import { X, Tag, Calendar, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useGetCouponDetails } from "./useCoupons";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";

interface CouponDetailModalProps {
  couponId: string;
  onClose: () => void;
}

const DetailItem = ({ icon: Icon, label, value }: any) => (
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

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    amount
  );

export function CouponDetailModal({
  couponId,
  onClose,
}: CouponDetailModalProps) {
  const { data: coupon, isLoading, isError } = useGetCouponDetails(couponId);

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="h-64">
          <CustomLoader />
        </div>
      );
    if (isError || !coupon) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span>Failed to load details.</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0096FF]">{coupon.code}</h2>
            <p className="text-sm text-gray-600">{coupon.description}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              coupon.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {coupon.active ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 border-b pb-2">
              Value & Limits
            </h4>
            <DetailItem
              icon={Tag}
              label="Discount Amount"
              value={formatPrice(coupon.discountAmount)}
            />
            <DetailItem
              icon={Users}
              label="Usage Count"
              value={coupon.usageCount}
            />
            <DetailItem
              icon={Users}
              label="Usage Limit"
              value={coupon.usageLimit ?? "Unlimited"}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 border-b pb-2">
              Validity
            </h4>
            <DetailItem
              icon={Calendar}
              label="Start Date"
              value={
                coupon.startDate
                  ? format(new Date(coupon.startDate), "MMM d, yyyy, h:mm a")
                  : "Immediate"
              }
            />
            <DetailItem
              icon={Calendar}
              label="Expiry Date"
              value={
                coupon.expiryDate
                  ? format(new Date(coupon.expiryDate), "MMM d, yyyy, h:mm a")
                  : "No Expiry"
              }
            />
          </div>
        </div>

        {coupon.specificUserId && (
          <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm text-blue-800">
            <span className="font-bold">Targeted User:</span>{" "}
            {coupon.specificUserName || coupon.specificUserId}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Coupon Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{renderContent()}</div>
        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

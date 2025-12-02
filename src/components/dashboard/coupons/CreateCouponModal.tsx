"use client";

import React, { useState, useEffect } from "react";
import { X, Tag, Calendar, User, DollarSign, Search } from "lucide-react";
import { useCreateCoupon } from "./useCoupons";
import { CreateCouponPayload } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Button from "@/components/generic/ui/Button";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";
import Select, { Option } from "@/components/generic/ui/Select";
import { useGetCustomers } from "./useUsers";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";

interface CreateCouponModalProps {
  onClose: () => void;
}

export function CreateCouponModal({ onClose }: CreateCouponModalProps) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const [specificUserId, setSpecificUserId] = useState<Option | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const debouncedUserSearch = useDebounce(userSearchTerm, 500);

  const {
    data: customersData,
    isLoading,
    isFetching,
  } = useGetCustomers(debouncedUserSearch, 0, 10);

  const rawContent = customersData?.content || [];

  const customerOptions: Option[] = rawContent.map((customer: any) => ({
    id: customer.id,
    name: customer.fullName || customer.email || "Unknown User",
  }));

  const isCustomersLoading = isLoading || isFetching;

  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let startIso = undefined;
    if (startDate && startTime) {
      startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
    }

    let expiryIso = undefined;
    if (expiryDate && expiryTime) {
      expiryIso = new Date(`${expiryDate}T${expiryTime}:00`).toISOString();
    }

    const payload: CreateCouponPayload = {
      code,
      description,
      discountAmount: Number(discountAmount),
      ...(usageLimit && { usageLimit: Number(usageLimit) }),
      ...(specificUserId && { specificUserId: specificUserId.id }),
      ...(startIso && { startDate: startIso }),
      ...(expiryIso && { expiryDate: expiryIso }),
    };

    createCoupon(payload, {
      onSuccess: onClose,
    });
  };

  let selectPlaceholder = "Select a user from list";
  if (isCustomersLoading) {
    selectPlaceholder = "Loading users...";
  } else if (customerOptions.length === 0) {
    selectPlaceholder = "No users found";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              Create New Coupon
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Set up discounts and usage limits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            disabled={isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:py-3 custom-scrollbar">
          <form
            id="create-coupon-form"
            onSubmit={handleSubmit}
            className="space-y-5 pb-40"
          >
            <div className="bg-white py-4 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" /> Value & Code
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <TextInput
                  label="Coupon Code *"
                  id="code"
                  placeholder="e.g. SAVE2025"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="font-mono tracking-wider uppercase"
                />
                <TextInput
                  label="Discount Amount (₦) *"
                  id="discount"
                  type="number"
                  placeholder="0.00"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  required
                />
              </div>
              <TextAreaInput
                label="Description *"
                id="desc"
                rows={2}
                placeholder="What is this coupon for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="bg-white py-4 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-purple-500" /> Restrictions
              </h4>

              <TextInput
                label="Usage Limit"
                id="limit"
                type="number"
                placeholder="Unlimited"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
              />

              <div className="space-y-2 pt-2 border-t border-gray-50">
                <label className="text-sm font-medium text-gray-700">
                  Filter Specific User (Optional)
                </label>

                <div className="relative">
                  <TextInput
                    label="Search Users"
                    id="search-user"
                    hideLabel
                    placeholder="Type name to search..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="!py-2 !text-xs !pl-8"
                    style={{ paddingLeft: 35 }}
                  />
                  <Search className="absolute left-2.5 top-4 h-4 w-4 text-gray-400" />
                </div>

                <Select
                  label="Select User"
                  hideLabel
                  options={customerOptions}
                  selected={specificUserId}
                  onChange={setSpecificUserId}
                  placeholder={selectPlaceholder}
                  disabled={isCustomersLoading}
                />
                <p className="text-[10px] text-gray-500">
                  Search above, then select from the dropdown.
                </p>
              </div>
            </div>

            <div className="bg-white py-4 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" /> Validity Period
              </h4>

              <div className="space-y-6">
                <ModernDateTimePicker
                  label="Start Date (Optional)"
                  dateValue={startDate}
                  timeValue={startTime}
                  onDateChange={setStartDate}
                  onTimeChange={setStartTime}
                  minDate={new Date().toISOString().split("T")[0]}
                />

                <ModernDateTimePicker
                  label="Expiry Date (Optional)"
                  dateValue={expiryDate}
                  timeValue={expiryTime}
                  onDateChange={setExpiryDate}
                  onTimeChange={setExpiryTime}
                  minDate={startDate}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex-none p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 sm:flex-none sm:w-32"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-coupon-form"
            variant="primary"
            isLoading={isPending}
            className="flex-1 sm:flex-none sm:w-40"
          >
            Create Coupon
          </Button>
        </div>
      </div>
    </div>
  );
}

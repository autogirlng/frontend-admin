"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Tag,
  Calendar,
  User,
  DollarSign,
  Search,
  Percent,
  ChevronDown,
  Loader2,
  Info,
} from "lucide-react";
import { useCreateCoupon } from "./useCoupons";
import { CreateCouponPayload, CouponType } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Button from "@/components/generic/ui/Button";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";
import Select, { Option } from "@/components/generic/ui/Select";
import { useGetCustomers } from "./useUsers";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { useGetOrganizations } from "@/components/settings/special-sale-booking-setup/useSpecialSales";

interface SearchableOrgSelectProps {
  value?: string;
  valueName?: string;
  onChange: (id: string, name: string) => void;
}

function SearchableOrganizationSelect({
  value,
  valueName,
  onChange,
}: SearchableOrgSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: orgs = [], isFetching } = useGetOrganizations(
    debouncedSearch,
    0,
    10,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700">
          Link Organization (Optional)
        </label>
        <Info
          className="w-4 h-4 ml-1 opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <div className="mt-1">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 text-left bg-white border transition duration-150 ease-in-out sm:text-sm 
            flex items-center justify-between cursor-pointer focus:outline-none
            h-[52px]
            ${
              isOpen
                ? "border-[#0096FF] ring-1 ring-[#0096FF]"
                : "border-gray-300 hover:border-[#0096FF]"
            }
          `}
        >
          <span
            className={`truncate pr-4 ${value ? "text-gray-900" : "text-gray-400"}`}
          >
            {valueName || "Search and select an organization"}
          </span>
          <ChevronDown
            className={`flex-shrink-0 w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-xl max-h-72 flex flex-col rounded-md overflow-hidden">
          <div className="sticky top-0 bg-gray-50 p-2 border-b border-gray-200 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#0096FF] focus:ring-1 focus:ring-[#0096FF]"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              {isFetching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0096FF] animate-spin" />
              )}
            </div>
          </div>

          <div className="overflow-y-auto py-1">
            {orgs.length === 0 && !isFetching ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No organizations found.
              </div>
            ) : (
              orgs.map((org) => (
                <div
                  key={org.organizationId}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === org.organizationId
                      ? "bg-blue-50 font-medium text-[#0096FF]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    onChange(org.organizationId, org.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {org.name}
                </div>
              ))
            )}

            {value && (
              <div
                className="px-4 py-2.5 text-sm text-red-500 cursor-pointer hover:bg-red-50 border-t border-gray-100 font-medium mt-1 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("", "");
                  setIsOpen(false);
                }}
              >
                Clear Selection
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CreateCouponModalProps {
  onClose: () => void;
}

export function CreateCouponModal({ onClose }: CreateCouponModalProps) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [couponType, setCouponType] = useState<CouponType>("FIXED_AMOUNT");
  const [usageLimit, setUsageLimit] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const [specificUserId, setSpecificUserId] = useState<Option | null>(null);
  const [organizationId, setOrganizationId] = useState("");
  const [organizationName, setOrganizationName] = useState("");

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
      couponType,
      ...(usageLimit && { usageLimit: Number(usageLimit) }),
      ...(specificUserId && { specificUserId: specificUserId.id }),
      ...(organizationId && { organizationId }),
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

              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCouponType("FIXED_AMOUNT")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    couponType === "FIXED_AMOUNT"
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" /> Fixed Amount
                </button>
                <button
                  type="button"
                  onClick={() => setCouponType("PERCENTAGE")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    couponType === "PERCENTAGE"
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" /> Percentage
                </button>
              </div>

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
                  label={
                    couponType === "PERCENTAGE"
                      ? "Percentage Discount (%) *"
                      : "Discount Amount (₦) *"
                  }
                  id="discount"
                  type="number"
                  placeholder="0.00"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  required
                  max={couponType === "PERCENTAGE" ? 100 : undefined}
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
              <div className="pt-2">
                <SearchableOrganizationSelect
                  value={organizationId}
                  valueName={organizationName}
                  onChange={(id, name) => {
                    setOrganizationId(id);
                    setOrganizationName(name);
                  }}
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-50 mt-2">
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

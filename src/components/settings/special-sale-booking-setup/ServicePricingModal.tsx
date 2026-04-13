"use client";

import React, { useState, useEffect, useRef } from "react";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import Button from "@/components/generic/ui/Button";
import { Plus, Trash2, Search, ChevronDown, Loader2, Info } from "lucide-react";
import {
  useCreateServicePricing,
  useUpdateServicePricing,
  useGetOrganizations,
} from "./useSpecialSales";
import { useGetVehicleTypes } from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ServicePricing, PricingItem, RideType } from "./types";

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
          Organization
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
            h-[52px] /* Explicitly locking height to match TextInput */
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
            {valueName || "Search Org (Optional)"}
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

interface ServicePricingModalProps {
  initialData?: ServicePricing | null;
  onClose: () => void;
}

const rideTypes: Option[] = [
  { id: "BASIC", name: "Basic" },
  { id: "EXECUTIVE", name: "Executive" },
];

export function ServicePricingModal({
  initialData,
  onClose,
}: ServicePricingModalProps) {
  const [name, setName] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState("");
  const [rideType, setRideType] = useState<RideType>("BASIC");
  const [outskirtFee, setOutskirtFee] = useState<string>("0");
  const [extremeFee, setExtremeFee] = useState<string>("0");

  const [pricingItems, setPricingItems] = useState<any[]>([
    { bookingTypeId: "", organizationId: "", organizationName: "", price: "" },
  ]);

  const createMutation = useCreateServicePricing();
  const updateMutation = useUpdateServicePricing();
  const { data: vehicleTypes = [] } = useGetVehicleTypes();
  const { data: bookingTypes = [] } = useGetBookingTypes();

  const isEditMode = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setVehicleTypeId(initialData.vehicleTypeId);
      setRideType(initialData.rideType);
      setOutskirtFee(String(initialData.outskirtFee));
      setExtremeFee(String(initialData.extremeFee));
      setPricingItems(
        initialData.pricingItems.length > 0
          ? initialData.pricingItems
          : [
              {
                bookingTypeId: "",
                organizationId: "",
                organizationName: "",
                price: "",
              },
            ],
      );
    }
  }, [initialData]);

  const handleItemChange = (
    index: number,
    field: keyof PricingItem,
    value: any,
  ) => {
    const newItems = [...pricingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setPricingItems(newItems);
  };

  const addItem = () => {
    setPricingItems([
      ...pricingItems,
      {
        bookingTypeId: "",
        organizationId: "",
        organizationName: "",
        price: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setPricingItems(pricingItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const payload = {
      name,
      vehicleTypeId,
      rideType,
      outskirtFee: Number(outskirtFee),
      extremeFee: Number(extremeFee),
      pricingItems: pricingItems
        .filter(
          (item) =>
            item.bookingTypeId && item.price !== "" && Number(item.price) >= 0,
        )
        .map((item) => ({
          ...item,
          price: Number(item.price),
        })),
    };

    if (isEditMode && initialData) {
      updateMutation.mutate(
        { id: initialData.id, payload },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const vehicleTypeOptions = vehicleTypes.map((vt) => ({
    id: vt.id,
    name: vt.name,
  }));

  const bookingTypeOptions = bookingTypes.map((bt) => ({
    id: bt.id,
    name: bt.name,
  }));

  return (
    <ActionModal
      title={isEditMode ? "Edit Service Pricing" : "New Service Pricing"}
      message="Configure pricing rules for a specific vehicle category."
      actionLabel={isEditMode ? "Update" : "Create"}
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={isPending}
      variant="primary"
    >
      <div className="space-y-4 mt-4 max-h-[65vh] overflow-y-auto pr-2 pb-32">
        <TextInput
          id="config-name"
          label="Configuration Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Executive SUV"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Vehicle Type"
            options={vehicleTypeOptions}
            selected={vehicleTypeOptions.find((v) => v.id === vehicleTypeId)}
            onChange={(opt) => setVehicleTypeId(opt.id)}
          />
          <Select
            label="Ride Type"
            options={rideTypes}
            selected={rideTypes.find((r) => r.id === rideType)}
            onChange={(opt) => setRideType(opt.id as RideType)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            id="outskirt-fee"
            label="Outskirt Fee"
            type="number"
            value={outskirtFee}
            onChange={(e) => setOutskirtFee(e.target.value)}
          />
          <TextInput
            id="extreme-fee"
            label="Extreme Fee"
            type="number"
            value={extremeFee}
            onChange={(e) => setExtremeFee(e.target.value)}
          />
        </div>

        <div className="border-t pt-5 mt-2">
          <div className="flex justify-between items-center mb-4">
            <label className="text-base font-semibold text-gray-900">
              Pricing Details
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={addItem}
              className="w-auto h-8 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Rule
            </Button>
          </div>

          <div className="space-y-4">
            {pricingItems.map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 bg-gray-50 border border-gray-200 relative"
              >
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Rule {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={pricingItems.length === 1}
                    className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded transition-colors disabled:opacity-30"
                    title="Remove Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Select
                    label="Booking Type"
                    options={bookingTypeOptions}
                    selected={bookingTypeOptions.find(
                      (b) => b.id === item.bookingTypeId,
                    )}
                    onChange={(opt) =>
                      handleItemChange(index, "bookingTypeId", opt.id)
                    }
                    placeholder="Select Type"
                  />
                  <SearchableOrganizationSelect
                    value={item.organizationId}
                    valueName={item.organizationName}
                    onChange={(id, name) => {
                      const newItems = [...pricingItems];
                      newItems[index] = {
                        ...newItems[index],
                        organizationId: id,
                        organizationName: name,
                      };
                      setPricingItems(newItems);
                    }}
                  />
                </div>
                <div className="w-full sm:w-1/2 sm:pr-2">
                  <TextInput
                    id={`price-${index}`}
                    label="Price"
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "price",
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ActionModal>
  );
}

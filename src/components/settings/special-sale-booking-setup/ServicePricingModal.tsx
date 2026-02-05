"use client";

import React, { useState, useEffect } from "react";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import Button from "@/components/generic/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import {
  useCreateServicePricing,
  useUpdateServicePricing,
} from "./useSpecialSales";
import { useGetVehicleTypes } from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { ServicePricing, PricingItem, RideType } from "./types";

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
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([
    { bookingTypeId: "", price: 0 },
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
          : [{ bookingTypeId: "", price: 0 }],
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
    setPricingItems([...pricingItems, { bookingTypeId: "", price: 0 }]);
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
      pricingItems: pricingItems.filter(
        (item) => item.bookingTypeId && item.price >= 0,
      ),
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
      <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
        <TextInput
          id="config-name"
          label="Configuration Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Executive SUV"
        />

        <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-2 gap-4">
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

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Pricing Items
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={addItem}
              className="w-auto h-8 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {pricingItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Select
                    label="Booking Type"
                    hideLabel={index > 0}
                    options={bookingTypeOptions}
                    selected={bookingTypeOptions.find(
                      (b) => b.id === item.bookingTypeId,
                    )}
                    onChange={(opt) =>
                      handleItemChange(index, "bookingTypeId", opt.id)
                    }
                    placeholder="Select Type"
                  />
                </div>
                <div className="w-32">
                  <TextInput
                    id={`price-${index}`}
                    label="Price"
                    hideLabel={index > 0}
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", Number(e.target.value))
                    }
                  />
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="mb-2.5 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  disabled={pricingItems.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ActionModal>
  );
}

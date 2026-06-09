"use client";

import React, { useState, useEffect } from "react";
import {
  useGetVehicleById,
  useApproveVehicle,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import { useGetDiscountDurations } from "@/lib/hooks/set-up/discount-durations/useDiscountDurations";
import {
  VehicleStatus,
  VehiclePrice,
  VehicleDiscount,
  PlatformFeeType,
  ApproveVehiclePayload,
} from "./types";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import CustomLoader from "@/components/generic/CustomLoader";

interface ApproveVehicleModalProps {
  vehicleId: string;
  onClose: () => void;
}

type PricingState = Record<
  string,
  { price: number; platformFeeType: PlatformFeeType; name: string }
>;
type DiscountState = Record<string, { percentage: number }>;

export function ApproveVehicleModal({
  vehicleId,
  onClose,
}: ApproveVehicleModalProps) {
  const {
    data: vehicleData,
    isLoading: isLoadingVehicle,
    isError: isVehicleError,
  } = useGetVehicleById(vehicleId);

  const { data: discountDurations, isLoading: isLoadingDiscounts } =
    useGetDiscountDurations();

  const approveMutation = useApproveVehicle();

  const [pricing, setPricing] = useState<PricingState>({});
  const [discounts, setDiscounts] = useState<DiscountState>({});
  const [extraHourlyRate, setExtraHourlyRate] = useState(0);
  const [outskirtFee, setOutskirtFee] = useState(0);
  const [extremeFee, setExtremeFee] = useState(0);

  useEffect(() => {
    if (vehicleData && discountDurations) {
      const initialPricing: PricingState = {};
      vehicleData.supportedBookingTypes.forEach((bt) => {
        const existingPrice = vehicleData.pricing?.find(
          (p) => p.bookingTypeId === bt.id,
        );
        initialPricing[bt.id] = {
          price: existingPrice?.price || 0,
          platformFeeType: existingPrice?.platformFeeType || "HOST_FEE",
          name: bt.name,
        };
      });
      setPricing(initialPricing);

      const initialDiscounts: DiscountState = {};
      discountDurations.forEach((dd) => {
        const existingDiscount = vehicleData.discounts?.find(
          (d) => d.discountDurationId === dd.id,
        );
        initialDiscounts[dd.id] = {
          percentage: existingDiscount?.percentage || 0,
        };
      });
      setDiscounts(initialDiscounts);
      setExtraHourlyRate(vehicleData.extraHourlyRate || 0);
      setOutskirtFee(vehicleData.outskirtFee || 0);
      setExtremeFee(vehicleData.extremeFee || 0);
    }
  }, [vehicleData, discountDurations]);

  const handlePriceChange = (id: string, value: string) => {
    const price = Number(value) || 0;
    setPricing((prev) => ({
      ...prev,
      [id]: { ...prev[id], price },
    }));
  };

  const handleFeeTypeChange = (id: string, option: Option) => {
    const platformFeeType = option.id as PlatformFeeType;
    setPricing((prev) => ({
      ...prev,
      [id]: { ...prev[id], platformFeeType },
    }));
  };

  const handleDiscountChange = (id: string, value: string) => {
    const percentage = Number(value) || 0;
    setDiscounts((prev) => ({
      ...prev,
      [id]: { percentage },
    }));
  };

  const handleSubmit = () => {
    const pricingPayload: VehiclePrice[] = Object.entries(pricing)
      .filter(([id, data]) => data.price > 0)
      .map(([id, data]) => ({
        bookingTypeId: id,
        bookingTypeName: data.name,
        price: data.price,
        platformFeeType: data.platformFeeType,
      }));
    const discountsPayload: VehicleDiscount[] = Object.entries(discounts)
      .filter(([id, data]) => data.percentage > 0)
      .map(([id, data]) => ({
        discountDurationId: id,
        percentage: data.percentage,
      }));

    const payload: ApproveVehiclePayload = {
      status: VehicleStatus.APPROVED,
      pricing: pricingPayload,
      discounts: discountsPayload,
      extraHourlyRate: Number(extraHourlyRate) || 0,
      outskirtFee: Number(outskirtFee) || 0,
      extremeFee: Number(extremeFee) || 0,
    };

    approveMutation.mutate({ id: vehicleId, payload }, { onSuccess: onClose });
  };

  const feeTypeOptions: Option[] = [
    { id: "HOST_FEE", name: "Host Fee" },
    { id: "AUTOGIRL_FEE", name: "Autogirl Fee" },
  ];

  const isLoading =
    isLoadingVehicle || isLoadingDiscounts || approveMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Approve & Set Pricing
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-8 overflow-y-auto">
          {isLoadingVehicle && <CustomLoader />}
          {isVehicleError && (
            <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load vehicle data. Cannot set pricing.</p>
            </div>
          )}
          {vehicleData && discountDurations && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Set Pricing
                  </h3>
                  <p className="text-sm text-gray-500">
                    Set the price for each booking type this vehicle supports.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicleData.supportedBookingTypes?.map((bt) => (
                    <div
                      key={bt.id}
                      className="p-4 border rounded-md bg-gray-50 space-y-3"
                    >
                      <label className="text-sm font-semibold text-gray-800">
                        {bt.name}
                      </label>
                      <TextInput
                        label={`Price for ${bt.name}`}
                        id={`price-${bt.id}`}
                        hideLabel
                        type="number"
                        min="0"
                        placeholder="Price (NGN)"
                        value={pricing[bt.id]?.price || ""}
                        onChange={(e) =>
                          handlePriceChange(bt.id, e.target.value)
                        }
                      />
                      <Select
                        label={`Fee type for ${bt.name}`}
                        hideLabel
                        options={feeTypeOptions}
                        selected={feeTypeOptions.find(
                          (o) =>
                            o.id ===
                            (pricing[bt.id]?.platformFeeType || "HOST_FEE"),
                        )}
                        onChange={(opt) => handleFeeTypeChange(bt.id, opt)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Set Discounts
                  </h3>
                  <p className="text-sm text-gray-500">
                    Set discount percentages for longer durations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discountDurations.map((dd) => (
                    <TextInput
                      key={dd.id}
                      label={`${dd.name} (${dd.minDays}-${dd.maxDays} days) %`}
                      id={`discount-${dd.id}`}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 5"
                      value={discounts[dd.id]?.percentage || ""}
                      onChange={(e) =>
                        handleDiscountChange(dd.id, e.target.value)
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Additional Fees
                  </h3>
                  <p className="text-sm text-gray-500">
                    Set penalties for late returns and out-of-bound travel.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextInput
                    label="Extra Hourly Rate (NGN)"
                    id="extraHourlyRate"
                    type="number"
                    min="0"
                    placeholder="e.g., 5000"
                    value={extraHourlyRate || ""}
                    onChange={(e) => setExtraHourlyRate(Number(e.target.value))}
                  />
                  <TextInput
                    label="Outskirt Fee (NGN)"
                    id="outskirtFee"
                    type="number"
                    min="0"
                    placeholder="e.g., 10000"
                    value={outskirtFee || ""}
                    onChange={(e) => setOutskirtFee(Number(e.target.value))}
                  />
                  <TextInput
                    label="Extreme Fee (NGN)"
                    id="extremeFee"
                    type="number"
                    min="0"
                    placeholder="e.g., 20000"
                    value={extremeFee || ""}
                    onChange={(e) => setExtremeFee(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || isVehicleError || !vehicleData}
            className="w-auto px-5"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Approve Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
}

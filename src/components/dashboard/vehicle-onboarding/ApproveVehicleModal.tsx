"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import CustomLoader from "@/components/generic/CustomLoader";

interface ApproveVehicleModalProps {
  vehicleId: string;
  onClose: () => void;
}

type PricingState = Record<
  string, // bookingTypeId
  { price: number; platformFeeType: PlatformFeeType; name: string }
>;
type DiscountState = Record<
  string, // discountDurationId
  { percentage: number }
>;

export function ApproveVehicleModal({
  vehicleId,
  onClose,
}: ApproveVehicleModalProps) {
  // --- Data Fetching ---
  const {
    data: vehicleData,
    isLoading: isLoadingVehicle,
    isError: isVehicleError,
  } = useGetVehicleById(vehicleId);

  const { data: discountDurations, isLoading: isLoadingDiscounts } =
    useGetDiscountDurations();

  const approveMutation = useApproveVehicle();

  // --- Form State ---
  const [pricing, setPricing] = useState<PricingState>({});
  const [discounts, setDiscounts] = useState<DiscountState>({});
  const [extraHourlyRate, setExtraHourlyRate] = useState(0);

  // --- Effect to pre-populate the form once data is loaded ---
  useEffect(() => {
    if (vehicleData && discountDurations) {
      // 1. Pre-populate Pricing
      const initialPricing: PricingState = {};
      vehicleData.supportedBookingTypes.forEach((bt) => {
        const existingPrice = vehicleData.pricing.find(
          (p) => p.bookingTypeId === bt.id
        );
        initialPricing[bt.id] = {
          price: existingPrice?.price || 0,
          platformFeeType: existingPrice?.platformFeeType || "HOST_FEE",
          name: bt.name,
        };
      });
      setPricing(initialPricing);

      // 2. Pre-populate Discounts
      const initialDiscounts: DiscountState = {};
      discountDurations.forEach((dd) => {
        const existingDiscount = vehicleData.discounts.find(
          (d) => d.discountDurationId === dd.id
        );
        initialDiscounts[dd.id] = {
          percentage: existingDiscount?.percentage || 0,
        };
      });
      setDiscounts(initialDiscounts);

      // 3. Pre-populate Extra Hourly Rate
      setExtraHourlyRate(vehicleData.extraHourlyRate || 0);
    }
  }, [vehicleData, discountDurations]);

  // --- State Updaters for the Form ---
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

  // --- Form Submission ---
  const handleSubmit = () => {
    // 1. Format Pricing payload
    const pricingPayload: VehiclePrice[] = Object.entries(pricing)
      .filter(([id, data]) => data.price > 0)
      .map(([id, data]) => ({
        bookingTypeId: id,
        bookingTypeName: data.name,
        price: data.price,
        platformFeeType: data.platformFeeType,
      }));

    // 2. Format Discounts payload
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
      <div className="relative w-full max-w-3xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* --- Modal Header --- */}
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

        {/* --- Modal Body --- */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {isLoadingVehicle && <CustomLoader />}
          {isVehicleError && (
            <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load vehicle data. Cannot set pricing.</p>
            </div>
          )}

          {/* --- Form Rendered When Data is Ready --- */}
          {vehicleData && discountDurations && (
            <>
              {/* --- Pricing Section --- */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Set Pricing
                </h3>
                <p className="text-sm text-gray-500">
                  Set the price for each booking type this vehicle supports.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicleData.supportedBookingTypes.map((bt) => (
                    <div
                      key={bt.id}
                      className="p-3 border rounded-md bg-gray-50 space-y-2"
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
                        placeholder="Price"
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
                            (pricing[bt.id]?.platformFeeType || "HOST_FEE")
                        )}
                        onChange={(opt) => handleFeeTypeChange(bt.id, opt)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Discounts Section --- */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Set Discounts
                </h3>
                <p className="text-sm text-gray-500">
                  Set discount percentages for longer durations.
                </p>
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

              {/* --- Extra Hourly Rate --- */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Extra Hourly Rate
                </h3>
                <p className="text-sm text-gray-500">
                  Set a price for each extra hour a guest is late.
                </p>
                <TextInput
                  label="Extra Hourly Rate"
                  id="extraHourlyRate"
                  hideLabel
                  type="number"
                  min="0"
                  placeholder="e.g., 500"
                  value={extraHourlyRate || ""}
                  onChange={(e) => setExtraHourlyRate(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </div>

        {/* --- Modal Footer --- */}
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

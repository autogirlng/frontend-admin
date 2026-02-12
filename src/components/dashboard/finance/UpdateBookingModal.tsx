"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Layers,
  Map,
  Trash2,
  Plus,
  Ticket,
  Banknote,
  Calculator,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";

import AddressInput from "@/components/generic/ui/AddressInput";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

import {
  useGetBooking,
  useGetCalculation,
  useGetVehicleDetails,
  useUpdateBooking,
} from "@/lib/hooks/finance/useFinanceBookings";
import { UpdateBookingPayload } from "./bookings/types";

interface UpdateBookingModalProps {
  bookingId: string;
  onClose: () => void;
}

type DiscountType = "coupon" | "amount";

export const UpdateBookingModal: React.FC<UpdateBookingModalProps> = ({
  bookingId,
  onClose,
}) => {
  const { data: booking, isLoading: isBookingLoading } =
    useGetBooking(bookingId);

  const { data: calculation, isLoading: isCalculationLoading } =
    useGetCalculation(booking?.calculationId || null);

  const { data: vehicle, isLoading: isVehicleLoading } = useGetVehicleDetails(
    booking?.vehicle?.id || null,
  );

  const updateBookingMutation = useUpdateBooking();

  const [formData, setFormData] = useState<UpdateBookingPayload | null>(null);
  const [discountType, setDiscountType] = useState<DiscountType>("coupon");

  useEffect(() => {
    if (calculation && calculation.requestedSegments && booking) {
      let payloadCoupon = "";
      let payloadDiscount = 0;
      let initialDiscountType: DiscountType = "coupon";

      const bookingData = booking as any;

      if (bookingData.couponCode) {
        payloadCoupon = bookingData.couponCode;
        initialDiscountType = "coupon";
      } else if (bookingData.discountAmount && bookingData.discountAmount > 0) {
        payloadDiscount = bookingData.discountAmount;
        initialDiscountType = "amount";
      }

      setDiscountType(initialDiscountType);

      setFormData({
        couponCode: payloadCoupon,
        discountAmount: payloadDiscount,
        segments: calculation.requestedSegments.map((seg) => ({
          bookingTypeId: seg.bookingTypeId,
          startDate: seg.startDate,
          startTime: seg.startTime,
          pickupLatitude: seg.pickupLatitude,
          pickupLongitude: seg.pickupLongitude,
          dropoffLatitude: seg.dropoffLatitude,
          dropoffLongitude: seg.dropoffLongitude,
          pickupLocationString: seg.pickupLocationString,
          dropoffLocationString: seg.dropoffLocationString,
          areaOfUse: seg.areaOfUse || [],
        })),
      });
    }
  }, [calculation, booking]);

  const handleDiscountTypeChange = (type: DiscountType) => {
    setDiscountType(type);
  };

  const handleRootFieldChange = (
    field: "couponCode" | "discountAmount",
    value: string | number,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleSegmentChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      // @ts-ignore
      newSegments[index] = { ...newSegments[index], [field]: value };
      return { ...prev, segments: newSegments };
    });
  };

  const handleLocationSelect = (
    index: number,
    type: "pickup" | "dropoff",
    coords: any,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      if (type === "pickup") {
        newSegments[index].pickupLatitude = coords.latitude;
        newSegments[index].pickupLongitude = coords.longitude;
      } else {
        newSegments[index].dropoffLatitude = coords.latitude;
        newSegments[index].dropoffLongitude = coords.longitude;
      }
      return { ...prev, segments: newSegments };
    });
  };

  const handleAreaOfUseChange = (
    segmentIndex: number,
    areaIndex: number,
    value: string,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      const newAreas = [...newSegments[segmentIndex].areaOfUse];
      newAreas[areaIndex] = { ...newAreas[areaIndex], areaOfUseName: value };
      newSegments[segmentIndex] = {
        ...newSegments[segmentIndex],
        areaOfUse: newAreas,
      };
      return { ...prev, segments: newSegments };
    });
  };

  const handleAreaOfUseLocationSelect = (
    segmentIndex: number,
    areaIndex: number,
    coords: any,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      const newAreas = [...newSegments[segmentIndex].areaOfUse];
      newAreas[areaIndex] = {
        ...newAreas[areaIndex],
        areaOfUseLatitude: coords.latitude,
        areaOfUseLongitude: coords.longitude,
      };
      newSegments[segmentIndex] = {
        ...newSegments[segmentIndex],
        areaOfUse: newAreas,
      };
      return { ...prev, segments: newSegments };
    });
  };

  const handleRemoveAreaOfUse = (segmentIndex: number, areaIndex: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      const newAreas = newSegments[segmentIndex].areaOfUse.filter(
        (_, i) => i !== areaIndex,
      );
      newSegments[segmentIndex] = {
        ...newSegments[segmentIndex],
        areaOfUse: newAreas,
      };
      return { ...prev, segments: newSegments };
    });
  };

  const handleAddAreaOfUse = (segmentIndex: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      const currentAreas = newSegments[segmentIndex].areaOfUse || [];
      newSegments[segmentIndex] = {
        ...newSegments[segmentIndex],
        areaOfUse: [
          ...currentAreas,
          { areaOfUseName: "", areaOfUseLatitude: 0, areaOfUseLongitude: 0 },
        ],
      };
      return { ...prev, segments: newSegments };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const finalPayload = {
      ...formData,
      couponCode: discountType === "coupon" ? formData.couponCode : "",
      discountAmount: discountType === "amount" ? formData.discountAmount : 0,
    };

    updateBookingMutation.mutate(
      { bookingId, payload: finalPayload },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const bookingTypeOptions =
    vehicle?.allPricingOptions.map((opt) => ({
      id: opt.bookingTypeId,
      name: `${opt.bookingTypeName} (₦${opt.price.toLocaleString()})`,
    })) || [];

  const isSyncing =
    !!booking?.calculationId && !calculation && !isCalculationLoading;

  const isLoading =
    isBookingLoading ||
    isCalculationLoading ||
    isSyncing ||
    (!!booking?.vehicle?.id && isVehicleLoading);

  const bData = booking as any;
  const originalPrice = bData?.originalPrice || 0;
  const currentTotalPrice = bData?.totalPrice || 0;
  const currentDiscount = bData?.discountAmount || 0;
  const currentCoupon = bData?.couponCode;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* --- Header --- */}
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Update Booking
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Invoice:{" "}
              <span className="font-mono">
                {booking?.invoiceNumber || "Loading..."}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- Content --- */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
              <CustomLoader />
              <p className="text-sm">Syncing booking details...</p>
            </div>
          ) : !formData ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p>Could not load booking details.</p>
            </div>
          ) : (
            <form
              id="update-booking-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* --- FINANCIAL SUMMARY DASHBOARD --- */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    Current Financial Breakdown
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Original Price */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">
                      Original
                    </p>
                    <p className="text-sm font-semibold text-gray-700 line-through decoration-gray-400">
                      ₦{originalPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Discount Info */}
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">
                      {currentCoupon ? "Coupon Applied" : "Discount"}
                    </p>
                    {currentDiscount > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-600">
                          - ₦{currentDiscount.toLocaleString()}
                        </span>
                        {currentCoupon && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md w-fit mt-0.5 border border-green-200">
                            {currentCoupon}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>

                  {/* Divider (Visual for mobile) */}
                  <div className="hidden sm:flex items-center justify-center text-gray-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Total Price */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">
                      Total Paid/Due
                    </p>
                    <p className="text-lg font-extrabold text-blue-700">
                      ₦{currentTotalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- PROMOTIONS INPUT SECTION --- */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50/80 p-3 border-b border-orange-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-orange-100 rounded text-orange-600">
                      {discountType === "coupon" ? (
                        <Ticket className="w-3 h-3" />
                      ) : (
                        <Banknote className="w-3 h-3" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                      Update Promo
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex bg-white rounded-lg p-0.5 border border-orange-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange("coupon")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        discountType === "coupon"
                          ? "bg-orange-500 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Coupon
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange("amount")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        discountType === "amount"
                          ? "bg-orange-500 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Amount
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {discountType === "coupon" ? (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                      <TextInput
                        label="Enter Coupon Code"
                        id="couponCode"
                        value={formData.couponCode || ""}
                        onChange={(e) =>
                          handleRootFieldChange("couponCode", e.target.value)
                        }
                        placeholder="e.g. SUMMER2026"
                      />
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                      <TextInput
                        label="Enter Discount Amount (₦)"
                        id="discountAmount"
                        type="number"
                        value={formData.discountAmount || ""}
                        onChange={(e) =>
                          handleRootFieldChange(
                            "discountAmount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* --- SEGMENTS SECTION --- */}
              {formData.segments.map((segment, index) => {
                const currentType = bookingTypeOptions.find(
                  (opt) => opt.id === segment.bookingTypeId,
                );

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="bg-gray-50/80 p-3 border-b border-gray-100 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        Booking #{index + 1}
                      </span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="p-4 space-y-5">
                      {/* Booking Type */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Layers className="h-3 w-3" /> Type
                        </label>
                        <Select
                          label="Booking Type"
                          hideLabel
                          options={bookingTypeOptions}
                          selected={currentType || null}
                          onChange={(option) =>
                            handleSegmentChange(
                              index,
                              "bookingTypeId",
                              option.id,
                            )
                          }
                          placeholder={
                            vehicle
                              ? "Select Booking Type"
                              : "Loading options..."
                          }
                          className="w-full"
                        />
                      </div>

                      {/* Schedule */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Schedule
                        </label>
                        <ModernDateTimePicker
                          label="Start Date & Time"
                          required
                          dateValue={segment.startDate}
                          timeValue={segment.startTime}
                          minDate={new Date().toISOString().split("T")[0]}
                          onDateChange={(val) =>
                            handleSegmentChange(index, "startDate", val)
                          }
                          onTimeChange={(val) =>
                            handleSegmentChange(index, "startTime", val)
                          }
                        />
                      </div>

                      {/* Locations */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Locations
                        </label>
                        <div className="space-y-4">
                          <AddressInput
                            label="Pickup Location"
                            id={`pickup-${index}`}
                            value={segment.pickupLocationString}
                            onChange={(val) =>
                              handleSegmentChange(
                                index,
                                "pickupLocationString",
                                val,
                              )
                            }
                            onLocationSelect={(coords) =>
                              handleLocationSelect(index, "pickup", coords)
                            }
                          />

                          <AddressInput
                            label="Dropoff Location"
                            id={`dropoff-${index}`}
                            value={segment.dropoffLocationString}
                            onChange={(val) =>
                              handleSegmentChange(
                                index,
                                "dropoffLocationString",
                                val,
                              )
                            }
                            onLocationSelect={(coords) =>
                              handleLocationSelect(index, "dropoff", coords)
                            }
                          />
                        </div>
                      </div>

                      {/* Area of Use */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Map className="h-3 w-3" /> Area of Use
                          </label>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddAreaOfUse(index)}
                            className="h-6 px-2 text-[10px] text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Area
                          </Button>
                        </div>

                        {segment.areaOfUse && segment.areaOfUse.length > 0 ? (
                          <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {segment.areaOfUse.map((area, areaIndex) => (
                              <div
                                key={areaIndex}
                                className="flex items-start gap-2"
                              >
                                <div className="flex-1">
                                  <AddressInput
                                    label={`Area ${areaIndex + 1}`}
                                    id={`areaofuse-${index}-${areaIndex}`}
                                    value={area.areaOfUseName}
                                    onChange={(val) =>
                                      handleAreaOfUseChange(
                                        index,
                                        areaIndex,
                                        val,
                                      )
                                    }
                                    onLocationSelect={(coords) =>
                                      handleAreaOfUseLocationSelect(
                                        index,
                                        areaIndex,
                                        coords,
                                      )
                                    }
                                    placeholder="Enter area or city"
                                    className="bg-white"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveAreaOfUse(index, areaIndex)
                                  }
                                  className="mt-7 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Remove Area"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
                            No areas of use defined.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </form>
          )}
        </div>

        {/* --- Footer --- */}
        <div className="flex-none p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={updateBookingMutation.isPending}
            className="flex-1 sm:flex-none sm:w-32"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="update-booking-form"
            variant="primary"
            isLoading={updateBookingMutation.isPending}
            className="flex-1 sm:flex-none sm:w-40"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

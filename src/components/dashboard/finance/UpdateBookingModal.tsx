"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, MapPin, Layers } from "lucide-react";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import Select from "@/components/generic/ui/Select";

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

export const UpdateBookingModal: React.FC<UpdateBookingModalProps> = ({
  bookingId,
  onClose,
}) => {
  const { data: booking, isLoading: isBookingLoading } =
    useGetBooking(bookingId);

  const { data: calculation, isLoading: isCalculationLoading } =
    useGetCalculation(booking?.calculationId || null);

  const { data: vehicle, isLoading: isVehicleLoading } = useGetVehicleDetails(
    booking?.vehicle?.id || null
  );

  const updateBookingMutation = useUpdateBooking();
  const [formData, setFormData] = useState<UpdateBookingPayload | null>(null);

  useEffect(() => {
    if (calculation && calculation.requestedSegments) {
      setFormData({
        couponCode: "",
        discountAmount: 0,
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
  }, [calculation]);

  const handleSegmentChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSegments = [...prev.segments];
      // @ts-ignore - Dynamic key assignment
      newSegments[index] = { ...newSegments[index], [field]: value };
      return { ...prev, segments: newSegments };
    });
  };

  const handleLocationSelect = (
    index: number,
    type: "pickup" | "dropoff",
    coords: { latitude: number; longitude: number }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    updateBookingMutation.mutate(
      { bookingId, payload: formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
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
              {formData.segments.map((segment, index) => {
                const currentType = bookingTypeOptions.find(
                  (opt) => opt.id === segment.bookingTypeId
                );

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50/80 p-3 border-b border-gray-100 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        Booking #{index + 1}
                      </span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="p-4 space-y-5">
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
                              option.id
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
                                val
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
                                val
                              )
                            }
                            onLocationSelect={(coords) =>
                              handleLocationSelect(index, "dropoff", coords)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </form>
          )}
        </div>

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

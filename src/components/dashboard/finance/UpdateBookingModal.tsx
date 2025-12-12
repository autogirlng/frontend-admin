"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { Toaster } from "react-hot-toast";

// Ensure these import paths match your project structure
import AddressInput from "@/components/generic/ui/AddressInput";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

import {
  useGetBooking,
  useGetCalculation,
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
  // 1. Fetch Booking
  const { data: booking, isLoading: isBookingLoading } =
    useGetBooking(bookingId);

  // 2. Fetch Calculation (using the ID from the booking)
  // We use the optional chaining '?.' and fallback to null to prevent errors if booking is loading
  const { data: calculation, isLoading: isCalculationLoading } =
    useGetCalculation(booking?.calculationId || null);

  const updateBookingMutation = useUpdateBooking();
  const [formData, setFormData] = useState<UpdateBookingPayload | null>(null);

  // 3. Sync Data: When calculation loads, populate the form
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
          // We load the existing string exactly as it is from the API
          pickupLocationString: seg.pickupLocationString,
          dropoffLocationString: seg.dropoffLocationString,
          areaOfUse: seg.areaOfUse || [],
        })),
      });
    }
  }, [calculation]);

  // --- Handlers ---

  // Update text fields (Date, Time, Location Strings)
  const handleSegmentChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (!formData) return;
    const newSegments = [...formData.segments];

    // We update the field directly with the value provided
    // This ensures no cropping happens on the location string
    newSegments[index] = { ...newSegments[index], [field]: value };

    setFormData({ ...formData, segments: newSegments });
  };

  // Update Coordinates (Lat/Long) when a location is selected from the dropdown
  const handleLocationSelect = (
    index: number,
    type: "pickup" | "dropoff",
    coords: { latitude: number; longitude: number }
  ) => {
    if (!formData) return;
    const newSegments = [...formData.segments];

    if (type === "pickup") {
      newSegments[index].pickupLatitude = coords.latitude;
      newSegments[index].pickupLongitude = coords.longitude;
    } else {
      newSegments[index].dropoffLatitude = coords.latitude;
      newSegments[index].dropoffLongitude = coords.longitude;
    }

    setFormData({ ...formData, segments: newSegments });
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

  // Logic to determine if we are still waiting for data
  const isSyncing =
    !!booking?.calculationId && !calculation && !isCalculationLoading;
  const isLoading = isBookingLoading || isCalculationLoading || isSyncing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Update Booking</h2>
            <p className="text-sm text-gray-500">
              Invoice: {booking?.invoiceNumber || "Loading..."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grow">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <CustomLoader />
              <p className="text-sm text-gray-500">
                Syncing booking details...
              </p>
            </div>
          ) : !formData ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-red-500">
              <p>Could not load booking details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {formData.segments.map((segment, index) => (
                <div
                  key={index}
                  className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      Trip Segment {index + 1}
                    </span>
                  </div>

                  {/* Date & Time Picker */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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

                  <div className="grid grid-cols-1 gap-5">
                    {/* Pickup Address Input */}
                    <AddressInput
                      label="Pickup Location"
                      id={`pickup-${index}`}
                      value={segment.pickupLocationString}
                      // 1. TEXT UPDATE: Directly updates state with the full string from AddressInput
                      onChange={(val) =>
                        handleSegmentChange(index, "pickupLocationString", val)
                      }
                      // 2. COORDINATE UPDATE: Updates lat/long when a place is clicked
                      onLocationSelect={(coords) =>
                        handleLocationSelect(index, "pickup", coords)
                      }
                    />

                    {/* Dropoff Address Input */}
                    <AddressInput
                      label="Dropoff Location"
                      id={`dropoff-${index}`}
                      value={segment.dropoffLocationString}
                      onChange={(val) =>
                        handleSegmentChange(index, "dropoffLocationString", val)
                      }
                      onLocationSelect={(coords) =>
                        handleLocationSelect(index, "dropoff", coords)
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={onClose}
                  disabled={updateBookingMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={updateBookingMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ArrowRightLeft,
  SplitSquareHorizontal,
  ArrowLeft,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import { useGetVehiclesForDropdown } from "@/lib/hooks/booking-management/useBookings";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { BookingSegment } from "./types";
import toast from "react-hot-toast";

import {
  useMoveBookingSegments,
  useSplitMoveBookingSegment,
} from "@/lib/hooks/finance/usePayments";

import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

interface TransferVehicleModalProps {
  segment: BookingSegment;
  onClose: () => void;
}

export function TransferVehicleModal({
  segment,
  onClose,
}: TransferVehicleModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [transferMode, setTransferMode] = useState<"FULL" | "SPLIT">("FULL");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [waivePriceDifference, setWaivePriceDifference] = useState(true);

  const [sliceStartDate, setSliceStartDate] = useState("");
  const [sliceStartTimeStr, setSliceStartTimeStr] = useState("");

  const [sliceEndDate, setSliceEndDate] = useState("");
  const [sliceEndTimeStr, setSliceEndTimeStr] = useState("");

  const [newBookingTypeId, setNewBookingTypeId] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useGetVehiclesForDropdown(debouncedSearch);
  const { data: bookingTypes, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();

  const moveSegmentsMutation = useMoveBookingSegments();
  const splitMoveMutation = useSplitMoveBookingSegment();

  const vehicleOptions = useMemo(() => {
    if (!vehiclesData) return [];
    return vehiclesData.map((v: any) => ({
      id: v.id,
      name: `${v.name} (${v.vehicleIdentifier})`,
    }));
  }, [vehiclesData]);

  const bookingTypeOptions = useMemo(() => {
    if (!bookingTypes) return [];
    return bookingTypes.map((bt: any) => ({
      id: bt.id,
      name: bt.name,
    }));
  }, [bookingTypes]);

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!selectedVehicleId) {
      toast.error("Please select a new vehicle.");
      return;
    }

    if (transferMode === "FULL") {
      moveSegmentsMutation.mutate(
        {
          bookingId: segment.bookingId,
          payload: {
            newVehicleId: selectedVehicleId,
            segmentIds: [segment.segmentId],
            waivePriceDifference,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      if (
        !sliceStartDate ||
        !sliceStartTimeStr ||
        !sliceEndDate ||
        !sliceEndTimeStr ||
        !newBookingTypeId
      ) {
        toast.error("Please fill in all split transfer fields.");
        return;
      }

      let formattedStart = "";
      let formattedEnd = "";
      try {
        formattedStart = new Date(
          `${sliceStartDate}T${sliceStartTimeStr}:00`,
        ).toISOString();
        formattedEnd = new Date(
          `${sliceEndDate}T${sliceEndTimeStr}:00`,
        ).toISOString();
      } catch (e) {
        toast.error("Invalid date or time selected.");
        return;
      }

      if (new Date(formattedEnd) <= new Date(formattedStart)) {
        toast.error("End time must be after the start time.");
        return;
      }

      splitMoveMutation.mutate(
        {
          bookingId: segment.bookingId,
          segmentId: segment.segmentId,
          payload: {
            newVehicleId: selectedVehicleId,
            sliceStartTime: formattedStart,
            sliceEndTime: formattedEnd,
            newBookingTypeId,
            waivePriceDifference,
          },
        },
        { onSuccess: onClose },
      );
    }
  };

  const isSubmitting =
    moveSegmentsMutation.isPending || splitMoveMutation.isPending;

  return (
    <ActionModal
      title={
        step === 1
          ? "Transfer Options"
          : transferMode === "FULL"
            ? "Full Vehicle Transfer"
            : "Split Vehicle Transfer"
      }
      message={
        step === 1 ? (
          "Please select how you would like to transfer this booking segment."
        ) : (
          <span>
            You are moving the <strong>{segment.bookingTypeName}</strong> trip
            currently assigned to <strong>{segment.vehicleName}</strong>.
          </span>
        )
      }
      actionLabel={step === 1 ? "Continue" : "Transfer Segment"}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isSubmitting}
      variant="primary"
    >
      {step === 1 ? (
        <div className="space-y-4 pt-4 text-left max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
          <label
            className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
              transferMode === "FULL"
                ? "border-[#0096FF] bg-blue-50 ring-1 ring-[#0096FF]"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex h-5 items-center">
              <input
                type="radio"
                name="transferMode"
                value="FULL"
                checked={transferMode === "FULL"}
                onChange={() => setTransferMode("FULL")}
                className="h-4 w-4 text-[#0096FF] border-gray-300 focus:ring-[#0096FF]"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-gray-700" /> Actual
                Transfer (Full)
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Transfer the trip 'E.g: Day 2' to a different vehicle entirely,
                keeping the same dates and times.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
              transferMode === "SPLIT"
                ? "border-[#0096FF] bg-blue-50 ring-1 ring-[#0096FF]"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex h-5 items-center">
              <input
                type="radio"
                name="transferMode"
                value="SPLIT"
                checked={transferMode === "SPLIT"}
                onChange={() => setTransferMode("SPLIT")}
                className="h-4 w-4 text-[#0096FF] border-gray-300 focus:ring-[#0096FF]"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                <SplitSquareHorizontal className="w-4 h-4 text-gray-700" />{" "}
                Split Transfer
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Split this segment by a specific date & time and move the new
                slice to a different vehicle. 'E.g: Used in Monthly Bookings.'
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-5 pt-4 text-left max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center text-sm font-medium text-[#0096FF] hover:text-[#007ACC] transition-colors -mt-2 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to options
          </button>

          {transferMode === "SPLIT" && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Split Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <ModernDateTimePicker
                  label="Slice Start Time"
                  dateValue={sliceStartDate}
                  timeValue={sliceStartTimeStr}
                  onDateChange={setSliceStartDate}
                  onTimeChange={setSliceStartTimeStr}
                  required
                />

                <ModernDateTimePicker
                  label="Slice End Time"
                  dateValue={sliceEndDate}
                  timeValue={sliceEndTimeStr}
                  onDateChange={setSliceEndDate}
                  onTimeChange={setSliceEndTimeStr}
                  required
                />
              </div>
              <Select
                label="New Booking Type"
                options={bookingTypeOptions}
                selected={
                  bookingTypeOptions.find((bt) => bt.id === newBookingTypeId) ||
                  null
                }
                onChange={(opt) => setNewBookingTypeId(opt.id)}
                placeholder={
                  isLoadingBookingTypes ? "Loading..." : "Select Booking Type"
                }
                disabled={isLoadingBookingTypes}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <TextInput
                label="Search New Vehicle"
                id="vehicle-search"
                hideLabel
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or identifier..."
                className="!pl-9"
                style={{ paddingLeft: 40 }}
              />
            </div>

            <Select
              label="Select Vehicle"
              hideLabel
              options={vehicleOptions}
              selected={
                vehicleOptions.find((v: any) => v.id === selectedVehicleId) ||
                null
              }
              onChange={(opt) => setSelectedVehicleId(opt.id)}
              placeholder={
                isLoadingVehicles
                  ? "Searching..."
                  : vehicleOptions.length === 0 && debouncedSearch
                    ? "No approved vehicles found"
                    : "Select a vehicle"
              }
              disabled={isLoadingVehicles}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-4 group">
            <input
              type="checkbox"
              checked={waivePriceDifference}
              onChange={(e) => setWaivePriceDifference(e.target.checked)}
              className="w-4 h-4 text-[#0096FF] border-gray-300 rounded focus:ring-[#0096FF]"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Waive Price Difference
            </span>
          </label>
        </div>
      )}
    </ActionModal>
  );
}

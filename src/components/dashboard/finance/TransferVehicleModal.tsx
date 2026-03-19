"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  CheckSquare,
  Square,
  ArrowRightLeft,
  SplitSquareHorizontal,
  ArrowLeft,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { format } from "date-fns";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import CustomLoader from "@/components/generic/CustomLoader";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";
import { useGetVehiclesForDropdown } from "@/lib/hooks/booking-management/useBookings";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import {
  useGetBookingSegments,
  useMoveBookingSegments,
  useSplitMoveBookingSegment,
} from "@/lib/hooks/finance/usePayments";
import toast from "react-hot-toast";

interface TransferVehicleModalProps {
  bookingId: string;
  onClose: () => void;
}

export function TransferVehicleModal({
  bookingId,
  onClose,
}: TransferVehicleModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [transferMode, setTransferMode] = useState<"FULL" | "SPLIT">("FULL");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [waivePriceDifference, setWaivePriceDifference] = useState(true);

  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(
    new Set(),
  );

  const [splitSegmentId, setSplitSegmentId] = useState<string | null>(null);
  const [sliceStartDate, setSliceStartDate] = useState("");
  const [sliceStartTimeStr, setSliceStartTimeStr] = useState("");
  const [sliceEndDate, setSliceEndDate] = useState("");
  const [sliceEndTimeStr, setSliceEndTimeStr] = useState("");
  const [newBookingTypeId, setNewBookingTypeId] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: segments, isLoading: isLoadingSegments } =
    useGetBookingSegments(bookingId);
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

  useEffect(() => {
    if (segments && segments.length > 0) {
      if (selectedSegments.size === 0) {
        setSelectedSegments(new Set(segments.map((s) => s.segmentId)));
      }
      if (!splitSegmentId) {
        setSplitSegmentId(segments[0].segmentId);
      }
    }
  }, [segments, selectedSegments.size, splitSegmentId]);

  const toggleFullSegment = (segmentId: string) => {
    const newSelected = new Set(selectedSegments);
    if (newSelected.has(segmentId)) {
      newSelected.delete(segmentId);
    } else {
      newSelected.add(segmentId);
    }
    setSelectedSegments(newSelected);
  };

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
      if (selectedSegments.size === 0) {
        toast.error("Please select at least one segment to transfer.");
        return;
      }

      moveSegmentsMutation.mutate(
        {
          bookingId,
          payload: {
            newVehicleId: selectedVehicleId,
            segmentIds: Array.from(selectedSegments),
            waivePriceDifference,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      if (!splitSegmentId) {
        toast.error("Please select a segment to split.");
        return;
      }
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
          bookingId,
          segmentId: splitSegmentId,
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
            ? "Full Segment Transfer"
            : "Split Segment Transfer"
      }
      message={
        step === 1
          ? "Select how you would like to transfer this booking."
          : transferMode === "FULL"
            ? "Select the segments you wish to move entirely to a new vehicle."
            : "Select one segment to split, define the new slice boundaries, and assign it to a new vehicle."
      }
      actionLabel={step === 1 ? "Continue" : "Transfer Vehicle"}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isSubmitting}
      variant="primary"
    >
      <div className="max-h-[60vh] md:max-h-[65vh] overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 -mr-1 sm:-mr-2 no-scrollbar">
        {step === 1 ? (
          <div className="space-y-4 pt-4 text-left pb-2">
            <label
              className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                transferMode === "FULL"
                  ? "border-[#0096FF] bg-blue-50 ring-1 ring-[#0096FF]"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex h-5 items-center shrink-0">
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
                  <ArrowRightLeft className="w-4 h-4 text-gray-700 shrink-0" />{" "}
                  Actual Transfer (Full)
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Transfer the trip 'E.g: Day 2' to a different vehicle
                  entirely, keeping the same dates and times.
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
              <div className="flex h-5 items-center shrink-0">
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
                  <SplitSquareHorizontal className="w-4 h-4 text-gray-700 shrink-0" />{" "}
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
          <div className="space-y-5 pt-4 pb-2 text-left">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center text-sm font-medium text-[#0096FF] hover:text-[#007ACC] transition-colors -mt-2 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1 shrink-0" /> Back to options
            </button>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {transferMode === "FULL"
                  ? "Select Trips to Move"
                  : "Select Trip to Split"}
              </h4>
              {isLoadingSegments ? (
                <CustomLoader />
              ) : segments && segments.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border border-gray-200 divide-y divide-gray-200 rounded-md">
                  {segments.map((segment) => {
                    const isSelected =
                      transferMode === "FULL"
                        ? selectedSegments.has(segment.segmentId)
                        : splitSegmentId === segment.segmentId;

                    return (
                      <div
                        key={segment.segmentId}
                        className={`flex flex-col sm:flex-row sm:items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() =>
                          transferMode === "FULL"
                            ? toggleFullSegment(segment.segmentId)
                            : setSplitSegmentId(segment.segmentId)
                        }
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-[#0096FF] shrink-0"
                        >
                          {transferMode === "FULL" ? (
                            isSelected ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )
                          ) : isSelected ? (
                            <CheckCircle2 className="w-5 h-5 fill-blue-50 text-[#0096FF]" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1 text-sm min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                            <span className="font-medium text-gray-900 truncate">
                              {segment.bookingTypeName}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                              {segment.currentVehicleIdentifier}
                            </span>
                          </div>
                          <div className="text-gray-600 text-xs flex flex-col gap-0.5">
                            <p>
                              {format(
                                new Date(segment.startDateTime),
                                "MMM d, yyyy HH:mm",
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(segment.endDateTime),
                                "MMM d, yyyy HH:mm",
                              )}
                            </p>
                            <p
                              className="truncate"
                              title={`${segment.pickupLocation} to ${segment.dropoffLocation}`}
                            >
                              {segment.pickupLocation} &rarr;{" "}
                              {segment.dropoffLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center border border-gray-200 rounded-md">
                  No segments found for this booking.
                </div>
              )}
            </div>
            {transferMode === "SPLIT" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Split Configuration
                </h4>
                <div className="grid grid-cols-1 gap-4 pt-1">
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
                    bookingTypeOptions.find(
                      (bt) => bt.id === newBookingTypeId,
                    ) || null
                  }
                  onChange={(opt) => setNewBookingTypeId(opt.id)}
                  placeholder={
                    isLoadingBookingTypes ? "Loading..." : "Select Booking Type"
                  }
                  disabled={isLoadingBookingTypes}
                />
              </div>
            )}
            <div className="space-y-4 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 shrink-0" />
                <TextInput
                  label="Search New Vehicle"
                  id="vehicle-search"
                  hideLabel
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or identifier..."
                  className="!pl-9 w-full"
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

            <label className="flex items-center gap-2 cursor-pointer pt-2 group w-fit">
              <input
                type="checkbox"
                checked={waivePriceDifference}
                onChange={(e) => setWaivePriceDifference(e.target.checked)}
                className="w-4 h-4 text-[#0096FF] border-gray-300 rounded focus:ring-[#0096FF] shrink-0"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Waive Price Difference
              </span>
            </label>
          </div>
        )}
      </div>
    </ActionModal>
  );
}

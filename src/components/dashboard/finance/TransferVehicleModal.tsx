"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, CheckSquare, Square } from "lucide-react";
import { format } from "date-fns";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import CustomLoader from "@/components/generic/CustomLoader";
import { useGetVehiclesForDropdown } from "@/lib/hooks/booking-management/useBookings";
import {
  useGetBookingSegments,
  useMoveBookingSegments,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(
    new Set(),
  );
  const [waivePriceDifference, setWaivePriceDifference] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: segments, isLoading: isLoadingSegments } =
    useGetBookingSegments(bookingId);
  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useGetVehiclesForDropdown(debouncedSearch);
  const moveSegmentsMutation = useMoveBookingSegments();

  const vehicleOptions = useMemo(() => {
    if (!vehiclesData) return [];
    return vehiclesData.map((v: any) => ({
      id: v.id,
      name: `${v.name} (${v.vehicleIdentifier})`,
    }));
  }, [vehiclesData]);

  useEffect(() => {
    if (segments && segments.length > 0 && selectedSegments.size === 0) {
      setSelectedSegments(new Set(segments.map((s) => s.segmentId)));
    }
  }, [segments]);

  const toggleSegment = (segmentId: string) => {
    const newSelected = new Set(selectedSegments);
    if (newSelected.has(segmentId)) {
      newSelected.delete(segmentId);
    } else {
      newSelected.add(segmentId);
    }
    setSelectedSegments(newSelected);
  };

  const handleConfirm = () => {
    if (!selectedVehicleId || selectedSegments.size === 0) {
      toast.error("Please select a vehicle and at least one segment");
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
  };

  return (
    <ActionModal
      title="Transfer Booking to New Vehicle"
      message="Select the segments you wish to move and choose a new vehicle for the transfer."
      actionLabel="Transfer Booking"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={moveSegmentsMutation.isPending}
      variant="primary"
    >
      <div className="space-y-5 pt-4 text-left">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Select Trips
          </h4>
          {isLoadingSegments ? (
            <CustomLoader />
          ) : segments && segments.length > 0 ? (
            <div className="max-h-48 overflow-y-auto border border-gray-200 divide-y divide-gray-200">
              {segments.map((segment) => {
                const isSelected = selectedSegments.has(segment.segmentId);
                return (
                  <div
                    key={segment.segmentId}
                    className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                    onClick={() => toggleSegment(segment.segmentId)}
                  >
                    <button type="button" className="mt-0.5 text-[#0096FF]">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">
                          {segment.bookingTypeName}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
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

        {/* Vehicle Search and Selection */}
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

        {/* Waive Price Difference Checkbox */}
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
    </ActionModal>
  );
}

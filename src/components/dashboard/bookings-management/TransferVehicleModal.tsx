"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import { useGetVehiclesForDropdown } from "@/lib/hooks/booking-management/useBookings";
import { BookingSegment } from "./types";
import toast from "react-hot-toast";
import { useMoveBookingSegments } from "@/lib/hooks/finance/usePayments";

interface TransferVehicleModalProps {
  segment: BookingSegment;
  onClose: () => void;
}

export function TransferVehicleModal({
  segment,
  onClose,
}: TransferVehicleModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [waivePriceDifference, setWaivePriceDifference] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 500);

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

  const handleConfirm = () => {
    if (!selectedVehicleId) {
      toast.error("Please select a new vehicle.");
      return;
    }

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
  };

  return (
    <ActionModal
      title="Transfer Segment to New Vehicle"
      message={
        <span>
          You are moving the <strong>{segment.bookingTypeName}</strong> trip
          currently assigned to <strong>{segment.vehicleName}</strong>.
        </span>
      }
      actionLabel="Transfer Segment"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={moveSegmentsMutation.isPending}
      variant="primary"
    >
      <div className="space-y-5 pt-4 text-left">
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
            className="w-4 h-4 text-[#0096FF] border-gray-300 focus:ring-[#0096FF]"
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            Waive Price Difference
          </span>
        </label>
      </div>
    </ActionModal>
  );
}

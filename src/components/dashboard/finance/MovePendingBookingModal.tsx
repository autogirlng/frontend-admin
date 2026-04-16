"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import { useGetVehiclesForDropdown } from "@/lib/hooks/booking-management/useBookings";
import { useMovePendingBooking } from "@/lib/hooks/finance/usePayments";
import toast from "react-hot-toast";

interface MovePendingBookingModalProps {
  bookingId: string;
  onClose: () => void;
}

export function MovePendingBookingModal({
  bookingId,
  onClose,
}: MovePendingBookingModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [waivePriceDifference, setWaivePriceDifference] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useGetVehiclesForDropdown(debouncedSearch);

  const movePendingMutation = useMovePendingBooking();

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

    movePendingMutation.mutate(
      {
        bookingId,
        payload: {
          newVehicleId: selectedVehicleId,
          waivePriceDifference,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <ActionModal
      title="Move Pending Booking"
      message="Select a new vehicle to move this pending booking to."
      actionLabel="Move Booking"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={movePendingMutation.isPending}
      variant="primary"
    >
      <div className="space-y-4 pt-4 text-left">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 shrink-0" />
          <TextInput
            label="Search Vehicle"
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
            vehicleOptions.find((v: any) => v.id === selectedVehicleId) || null
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
    </ActionModal>
  );
}

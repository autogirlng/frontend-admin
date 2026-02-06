"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useSearchApprovedVehicles } from "@/lib/hooks/drivers-management/useVehicleSearch";
import { useAllocateVehicle } from "@/lib/hooks/finance/usePayments";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";

interface AllocateVehicleModalProps {
  bookingId: string;
  onClose: () => void;
}

export function AllocateVehicleModal({
  bookingId,
  onClose,
}: AllocateVehicleModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useSearchApprovedVehicles(debouncedSearch);

  const allocateMutation = useAllocateVehicle();

  const vehicleOptions = useMemo(() => {
    if (!vehiclesData?.content) return [];
    return vehiclesData.content.map((v) => ({
      id: v.id,
      name: `${v.name} (${v.vehicleIdentifier})`,
    }));
  }, [vehiclesData]);

  const handleConfirm = () => {
    if (!selectedVehicleId) return;
    allocateMutation.mutate(
      { bookingId, vehicleId: selectedVehicleId },
      { onSuccess: onClose },
    );
  };

  return (
    <ActionModal
      title="Allocate Vehicle"
      message="This booking requires a vehicle allocation. Please select an approved vehicle."
      actionLabel="Allocate"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={allocateMutation.isPending}
      variant="primary"
    >
      <div className="space-y-4 pt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <TextInput
            label="Search Vehicle"
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
            vehicleOptions.find((v) => v.id === selectedVehicleId) || null
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
    </ActionModal>
  );
}

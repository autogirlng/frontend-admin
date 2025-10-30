// app/dashboard/trips/AssignDriverModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select, { Option } from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { useGetMyDrivers } from "@/lib/hooks/drivers-management/useDrivers"; // Re-using driver hook
import { useAssignDriver } from "@/lib/hooks/trips-management/useTrips";
import { Trip } from "./types";
import { Driver } from "@/components/dashboard/drivers-management/types"; // Adjust path

interface AssignDriverModalProps {
  trip: Trip;
  onClose: () => void;
}

export function AssignDriverModal({ trip, onClose }: AssignDriverModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Option | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use the drivers hook to find a driver
  const { data: paginatedDrivers, isLoading: isSearching } = useGetMyDrivers(
    0,
    debouncedSearchTerm
  );

  const assignDriverMutation = useAssignDriver();

  const driverOptions: Option[] = useMemo(() => {
    return (
      paginatedDrivers?.content.map((d: Driver) => ({
        id: d.id,
        name: `${d.fullName} (${d.driverIdentifier})`,
      })) || []
    );
  }, [paginatedDrivers]);

  const handleSubmit = () => {
    if (!selectedDriver) return;

    assignDriverMutation.mutate(
      {
        tripId: trip.id,
        payload: { driverId: selectedDriver.id },
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <ActionModal
      title="Assign Driver"
      message={`Assign a driver to trip ${trip.bookingId}.`}
      actionLabel="Assign Driver"
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={assignDriverMutation.isPending}
      variant="primary"
    >
      <div className="space-y-4 mt-4">
        <TextInput
          label="Search for Driver"
          id="driver-search"
          placeholder="Type to search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          label="Select Driver"
          hideLabel
          options={driverOptions}
          selected={selectedDriver}
          onChange={setSelectedDriver}
          placeholder={isSearching ? "Searching..." : "Select a driver"}
          disabled={isSearching}
        />
      </div>
    </ActionModal>
  );
}

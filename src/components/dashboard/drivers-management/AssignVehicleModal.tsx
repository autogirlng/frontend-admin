// app/dashboard/drivers-management/AssignVehicleModal.tsx
"use client";

import React, { useState } from "react";
import { X, Search, Plus, AlertCircle, Car } from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { useSearchApprovedVehicles } from "@/lib/hooks/drivers-management/useVehicleSearch";
import { useAssignDriverToVehicle } from "@/lib/hooks/drivers-management/useDrivers";
import { Driver, PaginatedResponse, VehicleSearchResult } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";

// Avatar helper
const Avatar = ({ src, name }: { src?: string; name: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
      <span className="text-lg font-semibold text-gray-600">{initials}</span>
    </div>
  );
};

interface AssignVehicleModalProps {
  driver: Driver;
  onClose: () => void;
}

export function AssignVehicleModal({
  driver,
  onClose,
}: AssignVehicleModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); // State is named 'page'
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: vehicleData,
    isLoading: isSearching,
    isError,
    isPlaceholderData,
  } = useSearchApprovedVehicles(debouncedSearchTerm, page);

  const vehicles =
    (vehicleData as PaginatedResponse<VehicleSearchResult>)?.content || [];
  const totalPages =
    (vehicleData as PaginatedResponse<VehicleSearchResult>)?.totalPages || 0;

  const assignMutation = useAssignDriverToVehicle();

  const handleAssign = (vehicleId: string) => {
    setSelectedId(vehicleId);
    assignMutation.mutate(
      { vehicleId, driverId: driver.id },
      {
        onSuccess: onClose,
        onError: () => setSelectedId(null),
      }
    );
  };

  const renderResults = () => {
    if (isSearching && !vehicleData) {
      return (
        <div className="h-64">
          <CustomLoader />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center gap-2 p-4 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <span className="font-semibold">Failed to load vehicles.</span>
        </div>
      );
    }
    if (vehicles.length === 0) {
      return (
        <p className="p-4 text-center text-gray-500 h-64">
          {debouncedSearchTerm
            ? "No vehicles found."
            : "No approved vehicles available."}
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {vehicles.map((vehicle: VehicleSearchResult) => {
          const isLoading = selectedId === vehicle.id;
          return (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Car className="h-8 w-8 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">
                    {vehicle.vehicleIdentifier}
                  </p>
                  <p className="text-xs text-gray-400">
                    Owner: {vehicle.ownerName}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-auto px-3"
                onClick={() => handleAssign(vehicle.id)}
                isLoading={isLoading}
                disabled={assignMutation.isPending}
              >
                Assign
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Assign Vehicle to {driver.fullName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={assignMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              label="Search Approved Vehicles"
              id="search"
              hideLabel
              type="text"
              placeholder="Search by name, ID, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: 35 }}
            />
          </div>
          <div
            className={`max-h-80 overflow-y-auto pr-2 ${
              isPlaceholderData ? "opacity-50" : ""
            }`}
          >
            {renderResults()}
          </div>
          <PaginationControls
            // ✅ FIX: Changed 'currentPage' to 'page'
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isPlaceholderData}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

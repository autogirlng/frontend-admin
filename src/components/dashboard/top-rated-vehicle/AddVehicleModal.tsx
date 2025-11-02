// app/dashboard/top-rated/AddVehicleModal.tsx
"use client";

import React, { useState } from "react";
import { X, Search, Plus, AlertCircle } from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";

import { VehicleSearchResult } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import {
  useSearchApprovedVehicles,
  useAddFeaturedVehicle,
} from "@/lib/hooks/top-rated-vehicles/useFeaturedVehicles";

interface AddVehicleModalProps {
  onClose: () => void;
  /** Pass in current IDs to prevent adding duplicates */
  existingIds: Set<string>;
}

export function AddVehicleModal({
  onClose,
  existingIds,
}: AddVehicleModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: searchData,
    isLoading: isSearching,
    isError,
  } = useSearchApprovedVehicles(debouncedSearchTerm);

  const addMutation = useAddFeaturedVehicle();

  const handleAddVehicle = (vehicleId: string) => {
    setSelectedId(vehicleId); // Set loading state for this specific button
    addMutation.mutate(vehicleId, {
      onSuccess: () => {
        // Don't close, let user add more
        setSelectedId(null);
      },
      onError: () => {
        setSelectedId(null);
      },
    });
  };

  const renderResults = () => {
    if (isSearching) {
      return <CustomLoader />;
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center gap-2 p-4 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <span className="font-semibold">Failed to load vehicles.</span>
        </div>
      );
    }
    if (!searchData && debouncedSearchTerm.length <= 2) {
      return (
        <p className="p-4 text-center text-gray-500">
          Type 3 or more characters to search...
        </p>
      );
    }
    if (searchData && searchData.content.length === 0) {
      return (
        <p className="p-4 text-center text-gray-500">No vehicles found.</p>
      );
    }
    return (
      <div className="space-y-2">
        {searchData?.content.map((vehicle: VehicleSearchResult) => {
          const isAlreadyFeatured = existingIds.has(vehicle.id);
          const isLoading = selectedId === vehicle.id;
          return (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{vehicle.name}</p>
                <p className="text-sm text-gray-500">
                  {vehicle.vehicleIdentifier}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-auto px-3"
                onClick={() => handleAddVehicle(vehicle.id)}
                isLoading={isLoading}
                disabled={isAlreadyFeatured || addMutation.isPending}
              >
                {isAlreadyFeatured ? "Added" : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Add Top-Rated Vehicle
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={addMutation.isPending}
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
          <div className="max-h-80 overflow-y-auto pr-2">{renderResults()}</div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={addMutation.isPending}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

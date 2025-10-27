"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useBulkCreateVehicles,
  useGetVehicles,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { BulkCreateVehiclePayload, BulkCreateVehicleResponse } from "./types";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { X, User, Copy, ChevronLeft, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface AddVehicleModalProps {
  onClose: () => void;
}

export function AddVehicleModal({ onClose }: AddVehicleModalProps) {
  const router = useRouter();
  const [view, setView] = useState<"choice" | "bulk" | "success">("choice");

  // --- State for Bulk Form ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Option | null>(null);
  const [count, setCount] = useState(1);
  const [licensePlates, setLicensePlates] = useState("");
  const [bulkResult, setBulkResult] =
    useState<BulkCreateVehicleResponse | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Data Fetching for Bulk Form ---
  const { data: paginatedData, isLoading: isVehicleSearchLoading } =
    useGetVehicles(0, debouncedSearchTerm, ""); // Use existing hook for search

  const bulkCreateMutation = useBulkCreateVehicles();

  const vehicleOptions: Option[] = useMemo(() => {
    return (
      paginatedData?.content.map((v) => ({
        id: v.id,
        name: `${v.name} (${v.vehicleIdentifier})`,
      })) || []
    );
  }, [paginatedData]);

  // --- Handlers ---
  const handleIndividualClick = () => {
    router.push("/dashboard/onboarding");
    onClose();
  };

  const handleBulkClick = () => {
    setView("bulk");
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) {
      toast.error("Please select an existing vehicle to clone.");
      return;
    }

    const plates = licensePlates
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p);
    if (plates.length > 0 && plates.length !== count) {
      toast.error(
        `License plate count must be ${count} (to match vehicle count) or 0.`
      );
      return;
    }

    const payload: BulkCreateVehiclePayload = {
      existingVehicleId: selectedVehicle.id,
      count: Number(count),
      licensePlateNumbers: plates.length > 0 ? plates : undefined,
    };

    bulkCreateMutation.mutate(payload, {
      onSuccess: (data) => {
        setBulkResult(data);
        setView("success");
      },
    });
  };

  // --- Render Logic ---
  const renderChoiceView = () => (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        How do you want to add a vehicle?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Individual Card */}
        <button
          onClick={handleIndividualClick}
          className="flex flex-col items-center justify-center p-8 border shadow-sm hover:shadow-md transition-shadow"
        >
          <User className="h-12 w-12 text-indigo-600 mb-3" />
          <span className="text-lg font-semibold">Individual</span>
          <p className="text-sm text-gray-500 text-center mt-1">
            Fill out the multi-step form for one vehicle.
          </p>
        </button>
        {/* Bulk Card */}
        <button
          onClick={handleBulkClick}
          className="flex flex-col items-center justify-center p-8 border shadow-sm hover:shadow-md transition-shadow"
        >
          <Copy className="h-12 w-12 text-teal-600 mb-3" />
          <span className="text-lg font-semibold">Create in Bulk</span>
          <p className="text-sm text-gray-500 text-center mt-1">
            Clone an existing vehicle multiple times.
          </p>
        </button>
      </div>
    </>
  );

  const renderBulkView = () => (
    <form onSubmit={handleBulkSubmit}>
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => setView("choice")}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900 ml-2">
          Bulk Create Vehicles
        </h2>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          This will clone an existing vehicle's details (features, photos, etc.)
          to create multiple new ones.
        </p>
        <TextInput
          label="Search for Vehicle to Clone"
          id="vehicle-search"
          placeholder="Type to search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          label="Select Vehicle"
          hideLabel
          options={vehicleOptions}
          selected={selectedVehicle}
          onChange={setSelectedVehicle}
          placeholder={
            isVehicleSearchLoading ? "Searching..." : "Select a vehicle"
          }
        />
        <TextInput
          label="Number of Vehicles to Create"
          id="count"
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <TextAreaInput
          label="License Plate Numbers (Optional)"
          id="license-plates"
          placeholder="Enter one license plate per line. Leave blank to auto-generate."
          rows={3}
          value={licensePlates}
          onChange={(e) => setLicensePlates(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={bulkCreateMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={bulkCreateMutation.isPending}
          disabled={!selectedVehicle || count < 1}
        >
          Create {count} Vehicles
        </Button>
      </div>
    </form>
  );

  const renderSuccessView = () => (
    <div className="flex flex-col items-center text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900">
        Bulk Creation Successful
      </h2>
      <p className="text-gray-600 mt-2">
        Successfully created <strong>{bulkResult?.successfulCreations}</strong>{" "}
        new vehicles.
      </p>
      {bulkResult && bulkResult.createdVehicleIds.length > 0 && (
        <div className="mt-4 w-full text-left">
          <p className="text-sm font-medium">New Vehicle IDs:</p>
          <pre className="max-h-32 overflow-y-auto bg-gray-100 p-3 mt-2 text-xs">
            {bulkResult.createdVehicleIds.join("\n")}
          </pre>
        </div>
      )}
      <div className="mt-6">
        <Button variant="primary" onClick={onClose} className="w-auto px-6">
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white p-6 shadow-xl">
        {/* Close Button (visible on choice and bulk views) */}
        {view !== "success" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            disabled={bulkCreateMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Dynamic Content */}
        {view === "choice" && renderChoiceView()}
        {view === "bulk" && renderBulkView()}
        {view === "success" && renderSuccessView()}
      </div>
    </div>
  );
}

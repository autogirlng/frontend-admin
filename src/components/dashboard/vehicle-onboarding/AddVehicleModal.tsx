"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useBulkCreateVehicles,
  useGetVehicles,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import { useGetHosts } from "@/lib/hooks/host-management/useHosts";
import { Host } from "../host-management/types";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { BulkCreateVehiclePayload, BulkCreateVehicleResponse } from "./types";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { X, User, Copy, ChevronLeft, CheckCircle, Home } from "lucide-react";
import { toast } from "react-hot-toast";

interface AddVehicleModalProps {
  onClose: () => void;
}

export function AddVehicleModal({ onClose }: AddVehicleModalProps) {
  const router = useRouter();
  const [view, setView] = useState<"choice" | "bulk" | "success" | "host">(
    "choice"
  );

  // --- State for Bulk Form ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Option | null>(null);
  const [count, setCount] = useState(1);
  const [licensePlates, setLicensePlates] = useState("");
  const [bulkResult, setBulkResult] =
    useState<BulkCreateVehicleResponse | null>(null);

  // --- State for Host Form ---
  const [hostSearchTerm, setHostSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState<Option | null>(null);

  // --- Debouncing ---
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedHostSearchTerm = useDebounce(hostSearchTerm, 500);

  // --- Data Fetching for Forms ---
  const { data: paginatedData, isLoading: isVehicleSearchLoading } =
    useGetVehicles(0, debouncedSearchTerm, "");
  const { data: hostData, isLoading: isHostSearchLoading } = useGetHosts(
    0,
    debouncedHostSearchTerm
  );
  const bulkCreateMutation = useBulkCreateVehicles();

  // --- Memoized Options for Selects ---
  const vehicleOptions: Option[] = useMemo(() => {
    return (
      paginatedData?.content.map((v) => ({
        id: v.id,
        name: `${v.name} (${v.vehicleIdentifier})`,
      })) || []
    );
  }, [paginatedData]);

  const hostOptions: Option[] = useMemo(() => {
    return (
      hostData?.content.map((h: Host) => ({
        id: h.id,
        name: `${h.fullName} (${h.email})`,
      })) || []
    );
  }, [hostData]);

  // --- Handlers ---
  const handleIndividualClick = () => {
    router.push("/dashboard/onboarding");
    onClose();
  };

  const handleBulkClick = () => {
    setView("bulk");
  };

  // ✅ New handler for host click
  const handleHostClick = () => {
    setView("host");
  };

  // ✅ New handler for host form submission
  const handleHostSubmit = () => {
    if (!selectedHost) {
      toast.error("Please select a host to continue.");
      return;
    }
    router.push(`/dashboard/onboarding?hostId=${selectedHost.id}`);
    onClose();
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
      {/* ✅ Changed to 1-column grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Individual Card */}
        <button
          onClick={handleIndividualClick}
          className="flex items-center p-6 border shadow-sm hover:shadow-md transition-shadow"
        >
          <User className="h-10 w-10 text-indigo-600 mr-5" />
          <div>
            <span className="text-lg font-semibold text-left">Individual</span>
            <p className="text-sm text-gray-500 text-left mt-1">
              Fill out the multi-step form for one vehicle.
            </p>
          </div>
        </button>

        {/* ✅ New Host Card */}
        <button
          onClick={handleHostClick}
          className="flex items-center p-6 border shadow-sm hover:shadow-md transition-shadow"
        >
          <Home className="h-10 w-10 text-green-600 mr-5" />
          <div>
            <span className="text-lg font-semibold text-left">
              Host Vehicle Onboarding
            </span>
            <p className="text-sm text-gray-500 text-left mt-1">
              Onboard a new vehicle for an existing host.
            </p>
          </div>
        </button>

        {/* Bulk Card */}
        <button
          onClick={handleBulkClick}
          className="flex items-center p-6 border shadow-sm hover:shadow-md transition-shadow"
        >
          <Copy className="h-10 w-10 text-teal-600 mr-5" />
          <div>
            <span className="text-lg font-semibold text-left">
              Create in Bulk
            </span>
            <p className="text-sm text-gray-500 text-left mt-1">
              Clone an existing vehicle multiple times.
            </p>
          </div>
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

  // ✅ New render function for host selection
  const renderHostView = () => (
    <div>
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => setView("choice")}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900 ml-2">
          Host Vehicle Onboarding
        </h2>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          First, select the host who owns this new vehicle.
        </p>
        <TextInput
          label="Search for Host"
          id="host-search"
          placeholder="Type to search by name or email..."
          value={hostSearchTerm}
          onChange={(e) => setHostSearchTerm(e.target.value)}
        />
        <Select
          label="Select Host"
          hideLabel
          options={hostOptions}
          selected={selectedHost}
          onChange={setSelectedHost}
          placeholder={
            isHostSearchLoading ? "Searching hosts..." : "Select a host"
          }
        />
      </div>
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleHostSubmit}
          disabled={!selectedHost}
        >
          Continue
        </Button>
      </div>
    </div>
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
        {/* Close Button (visible on choice, bulk, and host views) */}
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
        {view === "host" && renderHostView()}
        {view === "success" && renderSuccessView()}
      </div>
    </div>
  );
}

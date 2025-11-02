// app/dashboard/top-rated/page.tsx
"use client";

import React, { useState, useMemo } from "react";

import { FeaturedVehicle } from "./types";

// Reusable Components
import Button from "@/components/generic/ui/Button";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { AddVehicleModal } from "./AddVehicleModal";
import { VehicleCard } from "./VehicleCard";

// Icons
import { AlertCircle, Plus, Star } from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  useGetFeaturedVehicles,
  useRemoveFeaturedVehicle,
} from "@/lib/hooks/top-rated-vehicles/useFeaturedVehicles";

export default function TopRatedVehiclesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<FeaturedVehicle | null>(null);

  // --- API Hooks ---
  const { data: paginatedData, isLoading, isError } = useGetFeaturedVehicles();
  const removeMutation = useRemoveFeaturedVehicle();

  const featuredVehicles = paginatedData?.content || [];

  // Create a Set of existing IDs to prevent adding duplicates in the modal
  const existingIds = useMemo(
    () => new Set(featuredVehicles.map((v) => v.id)),
    [featuredVehicles]
  );

  // --- Modal Handlers ---
  const openRemoveModal = (vehicle: FeaturedVehicle) => {
    setSelectedVehicle(vehicle);
    setIsRemoveModalOpen(true);
  };
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsRemoveModalOpen(false);
    setSelectedVehicle(null);
  };
  const handleRemoveConfirm = () => {
    if (selectedVehicle) {
      removeMutation.mutate(selectedVehicle.id, {
        onSuccess: closeModals,
      });
    }
  };

  // --- Render Content ---
  const renderContent = () => {
    if (isLoading) {
      return <CustomLoader />;
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">
            Failed to load top-rated vehicles.
          </span>
        </div>
      );
    }
    if (featuredVehicles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-500 border-2 border-dashed rounded-lg">
          <Star className="h-16 w-16 text-gray-400 mb-4" />
          <p className="font-semibold">No Top-Rated Vehicles</p>
          <p className="text-sm">Click "Add Vehicle" to feature one.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onRemove={openRemoveModal}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Top-Rated Vehicles
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage the vehicles featured on the homepage.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* --- Content Grid --- */}
        {renderContent()}

        {/* No pagination needed for this page as per API */}
      </main>

      {/* --- Modals --- */}
      {isAddModalOpen && (
        <AddVehicleModal onClose={closeModals} existingIds={existingIds} />
      )}

      {isRemoveModalOpen && selectedVehicle && (
        <ActionModal
          title="Remove Vehicle"
          message={
            <>
              Are you sure you want to remove{" "}
              <strong className="text-gray-900">{selectedVehicle.name}</strong>{" "}
              from the top-rated list?
            </>
          }
          actionLabel="Yes, Remove"
          onClose={closeModals}
          onConfirm={handleRemoveConfirm}
          isLoading={removeMutation.isPending}
          variant="danger"
        />
      )}
    </>
  );
}

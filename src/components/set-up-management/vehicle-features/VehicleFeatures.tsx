"use client";

import React, { useState } from "react";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { VehicleFeature, VehicleFeaturePayload } from "./types";
import {
  useGetVehicleFeatures,
  useCreateVehicleFeature,
  useUpdateVehicleFeature,
  useDeleteVehicleFeature,
} from "@/lib/hooks/set-up/vehicle-features/useVehicleFeatures";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Reusable Form Component ---
interface VehicleFeatureFormProps {
  initialData?: VehicleFeature | null;
  isLoading: boolean;
  onSave: (data: VehicleFeaturePayload) => void;
  onCancel: () => void;
}

function VehicleFeatureForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: VehicleFeatureFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Feature Name"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Android Auto"
        required
      />

      <TextAreaInput
        label="Description (Optional)"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter a brief description for this feature..."
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

// --- Main Page Component ---
export default function VehicleFeaturesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<VehicleFeature | null>(
    null
  );

  // Get data from hooks
  const { data: vehicleFeatures, isLoading, isError } = useGetVehicleFeatures();
  const createMutation = useCreateVehicleFeature();
  const updateMutation = useUpdateVehicleFeature();
  const deleteMutation = useDeleteVehicleFeature();

  const handleOpenCreateModal = () => {
    setEditingFeature(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (feature: VehicleFeature) => {
    setEditingFeature(feature);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: VehicleFeaturePayload) => {
    if (editingFeature) {
      // Update
      updateMutation.mutate(
        { id: editingFeature.id, payload },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      // Create
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  // Define columns for our CustomTable
  const columns: ColumnDefinition<VehicleFeature>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (item) => (
        // Truncate long descriptions
        <span className="block max-w-sm truncate" title={item.description}>
          {item.description || "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-3" // Override fixed width
            onClick={() => handleOpenEditModal(item)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="w-auto px-3" // Override fixed width
            onClick={() => handleDelete(item.id)}
            disabled={deleteMutation.isPending}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vehicle Features
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage amenities and features for vehicles.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto px-5" // Override fixed width
            onClick={handleOpenCreateModal}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New
          </Button>
        </div>

        {/* --- Table Display --- */}
        {isLoading && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">
              Failed to load vehicle features.
            </span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={vehicleFeatures || []}
            columns={columns}
            getUniqueRowId={(item) => item.id}
          />
        )}
      </main>

      {/* --- Create/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingFeature ? "Edit" : "Create"} Vehicle Feature
            </h2>
            <VehicleFeatureForm
              initialData={editingFeature}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

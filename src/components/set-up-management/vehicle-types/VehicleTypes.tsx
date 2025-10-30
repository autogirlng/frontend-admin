"use client";

import React, { useState } from "react";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { VehicleType, VehicleTypePayload } from "./types";
import {
  useGetVehicleTypes,
  useCreateVehicleType,
  useUpdateVehicleType,
  useDeleteVehicleType,
} from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Reusable Form Component ---
interface VehicleTypeFormProps {
  initialData?: VehicleType | null;
  isLoading: boolean;
  onSave: (data: VehicleTypePayload) => void;
  onCancel: () => void;
}

function VehicleTypeForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: VehicleTypeFormProps) {
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
        label="Type Name (e.g., SUV, SEDAN_ELECTRIC)"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
        placeholder="e.g., SUV"
        required
      />

      <TextAreaInput
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter a brief description for this vehicle type..."
        rows={4}
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
export default function VehicleTypesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);

  // Get data from hooks
  const { data: vehicleTypes, isLoading, isError } = useGetVehicleTypes();
  const createMutation = useCreateVehicleType();
  const updateMutation = useUpdateVehicleType();
  const deleteMutation = useDeleteVehicleType();

  const handleOpenCreateModal = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (type: VehicleType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle type?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: VehicleTypePayload) => {
    if (editingType) {
      // Update
      updateMutation.mutate(
        { id: editingType.id, payload },
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

  // Helper function to format Name
  const formatTypeName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Define columns for our CustomTable
  const columns: ColumnDefinition<VehicleType>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (item) => (
        <span className="font-medium">{formatTypeName(item.name)}</span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (item) => (
        // Truncate long descriptions to keep the table clean
        <span className="block max-w-sm truncate" title={item.description}>
          {item.description}
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
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Types</h1>
            <p className="text-lg text-gray-600 mt-1">
              Define the categories of vehicles available on the platform.
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
            <span className="font-semibold">Failed to load vehicle types.</span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={vehicleTypes || []}
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
              {editingType ? "Edit" : "Create"} Vehicle Type
            </h2>
            <VehicleTypeForm
              initialData={editingType}
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

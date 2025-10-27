"use client";

import React, { useState } from "react";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { VehicleColor, VehicleColorPayload } from "./types";
import {
  useGetVehicleColors,
  useCreateVehicleColor,
  useUpdateVehicleColor,
  useDeleteVehicleColor,
} from "@/lib/hooks/set-up/vehicle-colors/useVehicleColors";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

// --- Reusable Form Component ---
interface VehicleColorFormProps {
  initialData?: VehicleColor | null;
  isLoading: boolean;
  onSave: (data: VehicleColorPayload) => void;
  onCancel: () => void;
}

function VehicleColorForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: VehicleColorFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [hexCode, setHexCode] = useState(initialData?.hexCode || "#000000");

  // Basic hex code validation
  const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidHex(hexCode)) {
      toast.error("Invalid hex code. Must be in #RRGGBB format.");
      return;
    }
    onSave({
      name,
      hexCode: hexCode.toUpperCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Color Name"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Midnight Black"
        required
      />

      <div className="flex items-end gap-3">
        {/* Native Color Picker for good UX */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview
          </label>
          <input
            type="color"
            value={isValidHex(hexCode) ? hexCode : "#000000"}
            onChange={(e) => setHexCode(e.target.value.toUpperCase())}
            className="mt-1 h-[50px] w-20 cursor-pointer rounded-md border border-gray-300 p-0"
          />
        </div>

        {/* Text Input for precise hex code */}
        <div className="flex-1">
          <TextInput
            label="Hex Code"
            id="hexCode"
            type="text"
            value={hexCode}
            onChange={(e) => setHexCode(e.target.value.toUpperCase())}
            placeholder="#FFFFFF"
            required
            maxLength={7}
          />
        </div>
      </div>

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
export default function VehicleColorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<VehicleColor | null>(null);

  // Get data from hooks
  const { data: vehicleColors, isLoading, isError } = useGetVehicleColors();
  const createMutation = useCreateVehicleColor();
  const updateMutation = useUpdateVehicleColor();
  const deleteMutation = useDeleteVehicleColor();

  const handleOpenCreateModal = () => {
    setEditingColor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (color: VehicleColor) => {
    setEditingColor(color);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: VehicleColorPayload) => {
    if (editingColor) {
      // Update
      updateMutation.mutate(
        { id: editingColor.id, payload },
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
  const columns: ColumnDefinition<VehicleColor>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Color",
      accessorKey: "hexCode",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full border border-gray-300"
            style={{ backgroundColor: item.hexCode }}
          ></div>
          <span>{item.hexCode}</span>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Colors</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage the available vehicle colors and their hex codes.
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
              Failed to load vehicle colors.
            </span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={vehicleColors || []}
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
              {editingColor ? "Edit" : "Create"} Vehicle Color
            </h2>
            <VehicleColorForm
              initialData={editingColor}
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

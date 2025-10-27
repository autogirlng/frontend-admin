"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  useGetPlatformFees,
  useCreatePlatformFee,
  useUpdatePlatformFee,
  useDeletePlatformFee,
} from "@/lib/hooks/set-up/platform-fees/usePlatformFees";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PlatformFee, PlatformFeePayload } from "./types";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Reusable Form Component ---
interface PlatformFeeFormProps {
  initialData?: PlatformFee | null;
  isLoading: boolean;
  onSave: (data: { feeType: string; feePercentage: number }) => void;
  onCancel: () => void;
}

function PlatformFeeForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: PlatformFeeFormProps) {
  const [feeType, setFeeType] = useState(initialData?.feeType || "");
  const [feePercentage, setFeePercentage] = useState(
    initialData?.feePercentage || 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feePercentage < 0) {
      alert("Fee percentage cannot be negative.");
      return;
    }
    onSave({
      feeType,
      feePercentage: Number(feePercentage),
    });
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Fee Type"
        id="feeType"
        type="text"
        value={feeType}
        onChange={(e) => setFeeType(e.target.value.toUpperCase())}
        placeholder="e.g., BOOKING_FEE"
        required
        disabled={isEditing} // Do not allow editing the feeType (ID)
        autoCapitalize="characters"
        className={isEditing ? "bg-gray-100 cursor-not-allowed" : ""}
      />

      <TextInput
        label="Fee Percentage (%)"
        id="feePercentage"
        type="number"
        value={feePercentage}
        onChange={(e) => setFeePercentage(Number(e.target.value))}
        required
        min="0"
        step="0.01"
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
          {isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

// --- Main Page Component ---
export default function PlatformFeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<PlatformFee | null>(null);

  // Get data from hooks
  const { data: platformFees, isLoading, isError } = useGetPlatformFees();
  const createMutation = useCreatePlatformFee();
  const updateMutation = useUpdatePlatformFee();
  const deleteMutation = useDeletePlatformFee();

  const handleOpenCreateModal = () => {
    setEditingFee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (fee: PlatformFee) => {
    setEditingFee(fee);
    setIsModalOpen(true);
  };

  const handleDelete = (feeType: string) => {
    if (window.confirm("Are you sure you want to delete this fee type?")) {
      deleteMutation.mutate(feeType);
    }
  };

  const handleSave = (data: { feeType: string; feePercentage: number }) => {
    if (editingFee) {
      // Update
      updateMutation.mutate(
        {
          feeType: editingFee.feeType,
          payload: { feePercentage: data.feePercentage },
        },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      // Create
      createMutation.mutate(data as PlatformFeePayload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  // Helper function to format Fee Type
  const formatFeeType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Define columns for our CustomTable
  const columns: ColumnDefinition<PlatformFee>[] = [
    {
      header: "Fee Type",
      accessorKey: "feeType",
      cell: (item) => (
        <span className="font-medium">{formatFeeType(item.feeType)}</span>
      ),
    },
    {
      header: "Percentage",
      accessorKey: "feePercentage",
      cell: (item) => `${item.feePercentage}%`,
    },
    {
      header: "Actions",
      accessorKey: "feeType",
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
            onClick={() => handleDelete(item.feeType)}
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
            <h1 className="text-3xl font-bold text-gray-900">Platform Fees</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage commission and service fees for the platform.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto px-5" // Override fixed width
            onClick={handleOpenCreateModal}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Fee
          </Button>
        </div>

        {/* --- Table Display --- */}
        {isLoading && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load platform fees.</span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={platformFees || []}
            columns={columns}
            getUniqueRowId={(item) => item.feeType}
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
              {editingFee ? "Edit" : "Create"} Platform Fee
            </h2>
            <PlatformFeeForm
              initialData={editingFee}
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

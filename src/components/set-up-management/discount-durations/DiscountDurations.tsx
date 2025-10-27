"use client";

import React, { useState } from "react";

import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { DiscountDuration, DiscountDurationPayload } from "./types";
import {
  useGetDiscountDurations,
  useCreateDiscountDuration,
  useUpdateDiscountDuration,
  useDeleteDiscountDuration,
} from "@/lib/hooks/set-up/discount-durations/useDiscountDurations";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Reusable Form Component ---
interface DiscountDurationFormProps {
  initialData?: DiscountDuration | null;
  isLoading: boolean;
  onSave: (data: DiscountDurationPayload) => void;
  onCancel: () => void;
}

function DiscountDurationForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: DiscountDurationFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [minDays, setMinDays] = useState(initialData?.minDays || 0);
  const [maxDays, setMaxDays] = useState(initialData?.maxDays || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(maxDays) <= Number(minDays)) {
      toast.error("Max Days must be greater than Min Days.");
      return;
    }
    onSave({
      name,
      minDays: Number(minDays),
      maxDays: Number(maxDays),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Display Name (e.g., 3+, 7+)"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., 3+ Days"
        required
      />

      <TextInput
        label="Min Days"
        id="minDays"
        type="number"
        value={minDays}
        onChange={(e) => setMinDays(Number(e.target.value))}
        required
        min="0"
      />

      <TextInput
        label="Max Days"
        id="maxDays"
        type="number"
        value={maxDays}
        onChange={(e) => setMaxDays(Number(e.target.value))}
        required
        min="0"
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
export default function DiscountDurationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDuration, setEditingDuration] =
    useState<DiscountDuration | null>(null);

  // Get data from hooks
  const { data: durations, isLoading, isError } = useGetDiscountDurations();
  const createMutation = useCreateDiscountDuration();
  const updateMutation = useUpdateDiscountDuration();
  const deleteMutation = useDeleteDiscountDuration();

  const handleOpenCreateModal = () => {
    setEditingDuration(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (duration: DiscountDuration) => {
    setEditingDuration(duration);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this duration?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: DiscountDurationPayload) => {
    if (editingDuration) {
      // Update
      updateMutation.mutate(
        { id: editingDuration.id, payload },
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
  const columns: ColumnDefinition<DiscountDuration>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Min Days",
      accessorKey: "minDays",
    },
    {
      header: "Max Days",
      accessorKey: "maxDays",
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
              Discount Durations
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage tiered durations for long-term discounts.
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
              Failed to load discount durations.
            </span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={durations || []}
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
              {editingDuration ? "Edit" : "Create"} Discount Duration
            </h2>
            <DiscountDurationForm
              initialData={editingDuration}
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

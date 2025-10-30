"use client";

import React, { useState } from "react";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { CsvUploadModal } from "@/components/generic/ui/CsvUploadModal";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { VehicleMake, VehicleMakePayload } from "./types";
import {
  useGetVehicleMakes,
  useCreateVehicleMake,
  useUpdateVehicleMake,
  useDeleteVehicleMake,
  useUploadVehicleMakesCsv,
} from "@/lib/hooks/set-up/vehicle-make-models/useVehicleMakes";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Form Component ---
interface VehicleMakeFormProps {
  initialData?: VehicleMake | null;
  isLoading: boolean;
  onSave: (data: VehicleMakePayload) => void;
  onCancel: () => void;
}

function VehicleMakeForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: VehicleMakeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [code, setCode] = useState(initialData?.code || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, code: code.toUpperCase() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Make Name (e.g., Toyota)"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Toyota"
        required
      />
      <TextInput
        label="Make Code (e.g., TYT)"
        id="code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g., TYT"
        required
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
export default function VehicleMakePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingMake, setEditingMake] = useState<VehicleMake | null>(null);

  const { data: makes, isLoading, isError } = useGetVehicleMakes();
  const createMutation = useCreateVehicleMake();
  const updateMutation = useUpdateVehicleMake();
  const deleteMutation = useDeleteVehicleMake();
  const uploadCsvMutation = useUploadVehicleMakesCsv();

  const handleOpenCreateModal = () => {
    setEditingMake(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (make: VehicleMake) => {
    setEditingMake(make);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this make?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: VehicleMakePayload) => {
    if (editingMake) {
      updateMutation.mutate(
        { id: editingMake.id, payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const columns: ColumnDefinition<VehicleMake>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-3"
            onClick={() => handleOpenEditModal(item)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="w-auto px-3"
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Makes</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage vehicle manufacturers (e.g., Toyota, Honda).
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="w-auto px-5"
              onClick={() => setIsCsvModalOpen(true)}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload CSV
            </Button>
            <Button
              variant="primary"
              className="w-auto px-5"
              onClick={handleOpenCreateModal}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        {isLoading && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load vehicle makes.</span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={makes || []}
            columns={columns}
            getUniqueRowId={(item) => item.id}
          />
        )}
      </main>

      {/* Create/Edit Modal */}
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
              {editingMake ? "Edit" : "Create"} Vehicle Make
            </h2>
            <VehicleMakeForm
              initialData={editingMake}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {isCsvModalOpen && (
        <CsvUploadModal
          title="Upload Vehicle Makes"
          onClose={() => setIsCsvModalOpen(false)}
          uploadMutation={uploadCsvMutation}
        />
      )}
    </>
  );
}

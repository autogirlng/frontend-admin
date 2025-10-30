"use client";

import React, { useState, useMemo } from "react";
import { useGetVehicleMakes } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleMakes";
import { VehicleModel, VehicleModelPayload } from "../vehicle-make-model/types";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { CsvUploadModal } from "@/components/generic/ui/CsvUploadModal";
import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  useCreateVehicleModel,
  useDeleteVehicleModel,
  useGetVehicleModels,
  useUpdateVehicleModel,
  useUploadVehicleModelsCsv,
} from "@/lib/hooks/set-up/vehicle-make-models/useVehicleModels";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Form Component ---
interface VehicleModelFormProps {
  initialData?: VehicleModel | null;
  isLoading: boolean;
  onSave: (data: VehicleModelPayload) => void;
  onCancel: () => void;
}

function VehicleModelForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: VehicleModelFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [selectedMake, setSelectedMake] = useState<Option | null>(
    initialData ? { id: initialData.makeId, name: initialData.makeName } : null
  );

  // Fetch all vehicle makes for the dropdown
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakes();

  const makeOptions: Option[] = useMemo(() => {
    return makes ? makes.map((make) => ({ id: make.id, name: make.name })) : [];
  }, [makes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMake) {
      alert("Please select a vehicle make.");
      return;
    }
    onSave({
      name,
      code: code.toUpperCase(),
      vehicleMakeId: selectedMake.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Vehicle Make"
        placeholder={isLoadingMakes ? "Loading makes..." : "Select a make"}
        options={makeOptions}
        selected={selectedMake}
        onChange={(option) => setSelectedMake(option)}
      />
      <TextInput
        label="Model Name (e.g., Corolla)"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Corolla"
        required
        disabled={!selectedMake}
      />
      <TextInput
        label="Model Code (e.g., TYC-M001)"
        id="code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g., TYC-M001"
        required
        disabled={!selectedMake}
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
export default function VehicleModelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);

  const { data: models, isLoading, isError } = useGetVehicleModels();
  const createMutation = useCreateVehicleModel();
  const updateMutation = useUpdateVehicleModel();
  const deleteMutation = useDeleteVehicleModel();
  const uploadCsvMutation = useUploadVehicleModelsCsv();

  const handleOpenCreateModal = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (model: VehicleModel) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: VehicleModelPayload) => {
    if (editingModel) {
      updateMutation.mutate(
        { id: editingModel.id, payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const columns: ColumnDefinition<VehicleModel>[] = [
    { header: "Model Name", accessorKey: "name" },
    { header: "Make", accessorKey: "makeName" },
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
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Models</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage specific models for each make (e.g., Corolla, Civic).
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
            <span className="font-semibold">
              Failed to load vehicle models.
            </span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={models || []}
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
              {editingModel ? "Edit" : "Create"} Vehicle Model
            </h2>
            <VehicleModelForm
              initialData={editingModel}
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
          title="Upload Vehicle Models"
          onClose={() => setIsCsvModalOpen(false)}
          uploadMutation={uploadCsvMutation}
        />
      )}
    </>
  );
}

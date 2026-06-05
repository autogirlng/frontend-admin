"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/generic/ui/Button";
import Select, { Option } from "@/components/generic/ui/Select";
import { Plus, Edit, Trash2, X, AlertCircle, ImagePlus } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { CustomerCategory, CustomerCategoryPayload } from "./types";
import {
  useGetCustomerCategories,
  useCreateCustomerCategory,
  useUpdateCustomerCategory,
  useDeleteCustomerCategory,
} from "@/lib/hooks/set-up/customer-categories/useCustomerCategories";
import { useGetVehicleTypes } from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { useUploadImage } from "@/lib/hooks/blog/useBlog";
import { VehicleType } from "@/components/set-up-management/vehicle-types/types";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// Helper to format vehicle type names like SEDAN_ELECTRIC -> Sedan Electric
const formatTypeName = (name: string) =>
  name
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

// --- Reusable Form Component ---
interface CustomerCategoryFormProps {
  initialData?: CustomerCategory | null;
  vehicleTypeOptions: VehicleType[];
  isLoading: boolean;
  onSave: (data: CustomerCategoryPayload) => void;
  onCancel: () => void;
}

function CustomerCategoryForm({
  initialData,
  vehicleTypeOptions,
  isLoading,
  onSave,
  onCancel,
}: CustomerCategoryFormProps) {
  const [vehicleTypeId, setVehicleTypeId] = useState(
    initialData?.vehicleType?.id || ""
  );
  const [image, setImage] = useState(initialData?.image || "");

  const { uploadImage, isUploading } = useUploadImage();

  const options: Option[] = vehicleTypeOptions.map((type) => ({
    id: type.id,
    name: formatTypeName(type.name),
  }));

  const selectedOption = options.find((o) => o.id === vehicleTypeId) || null;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploaded = await uploadImage(file);
    if (uploaded?.url) {
      setImage(uploaded.url);
    } else {
      toast.error("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleTypeId) {
      toast.error("Please select a vehicle type.");
      return;
    }
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }
    onSave({ vehicleTypeId, image });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Vehicle Type"
        options={options}
        selected={selectedOption}
        onChange={(option) => setVehicleTypeId(option.id)}
        placeholder="Select a vehicle type"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Image
        </label>
        <label
          htmlFor="customer-category-image"
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#0096FF] hover:bg-gray-50 transition-colors"
        >
          <input
            id="customer-category-image"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {image ? (
            <div className="relative h-24 w-24">
              <Image
                src={image}
                alt="Category"
                fill
                className="object-cover rounded-md"
                sizes="96px"
              />
            </div>
          ) : (
            <ImagePlus className="h-8 w-8 text-gray-400" />
          )}
          <span className="text-sm text-gray-500">
            {isUploading
              ? "Uploading..."
              : image
                ? "Click to replace image"
                : "Click to upload an image"}
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading || isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isUploading}
        >
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

// --- Main Page Component ---
export default function CustomerCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CustomerCategory | null>(null);

  // Get data from hooks
  const {
    data: customerCategories,
    isLoading,
    isError,
  } = useGetCustomerCategories();
  const { data: vehicleTypes } = useGetVehicleTypes();
  const createMutation = useCreateCustomerCategory();
  const updateMutation = useUpdateCustomerCategory();
  const deleteMutation = useDeleteCustomerCategory();

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CustomerCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer category? This cannot be undone."
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: CustomerCategoryPayload) => {
    if (editingCategory) {
      // Update
      updateMutation.mutate(
        { id: editingCategory.id, payload },
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

  // Each category is tied to a single vehicle type. When creating, only offer
  // vehicle types that don't already have a category. When editing, also keep
  // the category's own vehicle type available.
  const usedVehicleTypeIds = new Set(
    (customerCategories || []).map((c) => c.vehicleType?.id)
  );
  const availableVehicleTypes = (vehicleTypes || []).filter(
    (type) =>
      !usedVehicleTypeIds.has(type.id) ||
      type.id === editingCategory?.vehicleType?.id
  );

  // Define columns for our CustomTable
  const columns: ColumnDefinition<CustomerCategory>[] = [
    {
      header: "Image",
      accessorKey: "image",
      cell: (item) =>
        item.image ? (
          <div className="relative h-12 w-12">
            <Image
              src={item.image}
              alt={item.vehicleType?.name || "Category"}
              fill
              className="object-cover rounded-md"
              sizes="48px"
            />
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      header: "Vehicle Type",
      accessorKey: "vehicleType",
      cell: (item) => (
        <span className="font-medium">
          {item.vehicleType ? formatTypeName(item.vehicleType.name) : "—"}
        </span>
      ),
    },
    {
      header: "Description",
      accessorKey: "vehicleType",
      cell: (item) => (
        <span
          className="block max-w-sm truncate"
          title={item.vehicleType?.description}
        >
          {item.vehicleType?.description || "—"}
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
              Customer Categories
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage customer categories, each tied to a single vehicle type.
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
              Failed to load customer categories.
            </span>
          </div>
        )}
        {!isLoading && !isError && (
          <CustomTable
            data={customerCategories || []}
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
              {editingCategory ? "Edit" : "Create"} Customer Category
            </h2>
            <CustomerCategoryForm
              initialData={editingCategory}
              vehicleTypeOptions={availableVehicleTypes}
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

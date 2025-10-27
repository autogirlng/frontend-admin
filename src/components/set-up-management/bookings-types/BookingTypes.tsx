"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast"; // Make sure to add this to your root layout
import { BookingType, BookingTypePayload } from "./types";
import {
  useCreateBookingType,
  useDeleteBookingType,
  useGetBookingTypes,
  useUpdateBookingType,
} from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Reusable Form Component ---
// We can keep this in the same file for simplicity or move it
interface BookingTypeFormProps {
  initialData?: BookingType | null;
  isLoading: boolean;
  onSave: (data: BookingTypePayload) => void;
  onCancel: () => void;
}

function BookingTypeForm({
  initialData,
  isLoading,
  onSave,
  onCancel,
}: BookingTypeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [duration, setDuration] = useState(initialData?.durationInMinutes || 0);
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isActive, setIsActive] = useState(initialData?.defaultActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) {
      alert("Duration must be greater than 0.");
      return;
    }
    onSave({
      name,
      durationInMinutes: Number(duration),
      description,
      defaultActive: isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 py-4 px-3 block w-full border-1 border-black focus:outline-none sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700"
        >
          Duration (in minutes)
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
          min="1"
          className="mt-1 py-4 px-3 block w-full border-1 border-black focus:outline-none sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 py-4 px-3 block w-full border-1 border-black focus:outline-none sm:text-sm"
        />
      </div>
      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#007ACC] focus:ring-indigo-500"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active by default
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center border border-transparent bg-[#007ACC] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

// --- Main Page Component ---
export default function BookingTypesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookingType, setEditingBookingType] =
    useState<BookingType | null>(null);

  // Get data from hooks
  const { data: bookingTypes, isLoading, isError } = useGetBookingTypes();
  const createMutation = useCreateBookingType();
  const updateMutation = useUpdateBookingType();
  const deleteMutation = useDeleteBookingType();

  const handleOpenCreateModal = () => {
    setEditingBookingType(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bookingType: BookingType) => {
    setEditingBookingType(bookingType);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking type?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (payload: BookingTypePayload) => {
    if (editingBookingType) {
      // Update
      updateMutation.mutate(
        { id: editingBookingType.id, payload },
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
  const columns: ColumnDefinition<BookingType>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Duration",
      accessorKey: "durationInMinutes",
      cell: (item) => `${item.durationInMinutes} minutes`,
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Default Active",
      accessorKey: "defaultActive",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.defaultActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.defaultActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEditModal(item)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-900 disabled:text-gray-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* This ensures toasts are visible */}
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Booking Types</h1>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#007ACC] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>
        </div>

        {/* --- Table Display --- */}
        {isLoading && <CustomLoader />}
        {isError && <p className="text-red-600">Failed to load data.</p>}
        {!isLoading && !isError && (
          <CustomTable
            data={bookingTypes || []}
            columns={columns}
            getUniqueRowId={(item) => item.id}
          />
        )}
      </main>

      {/* --- Create/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingBookingType ? "Edit" : "Create"} Booking Type
            </h2>
            <BookingTypeForm
              initialData={editingBookingType}
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

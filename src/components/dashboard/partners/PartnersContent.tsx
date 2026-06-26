"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Globe,
  Mail,
  Phone,
  User,
  Upload,
  X,
  Check,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Select from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import { CustomTable, ColumnDefinition } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

import {
  useGetPartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from "@/lib/hooks/partners/usePartners";
import type {
  Partner,
  CreatePartnerPayload,
  UpdatePartnerPayload,
} from "./types";

const PARTNER_TYPES = [
  { id: "HOTEL", name: "Hotel" },
  { id: "RESTAURANT", name: "Restaurant" },
  { id: "CORPORATE", name: "Corporate" },
  { id: "REAL_ESTATE", name: "Real Estate" },
  { id: "HEALTHCARE", name: "Health care" },
  { id: "LOGISTICS", name: "Logistics" },
  { id: "EVENT_VENUE", name: "Event Venue" },
  { id: "OTHER", name: "Others" },
];

const DEFAULT_FORM: CreatePartnerPayload = {
  name: "",
  imageUrl: "",
  description: "",
  address: "",
  contactEmail: "",
  contactPhone: "",
  contactPersonName: "",
  website: "",
  partnerType: "",
  latitude: null,
  longitude: null,
};

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const STAGING_IMAGE_URL =
  "https://res.cloudinary.com/dgnalaojk/image/upload/f_auto,q_auto,w_800/v1767115432/trv57nsfk4ww6eudsj7f.jpg";

const IS_NON_PROD =
  process.env.NEXT_PUBLIC_APP_ENV === "staging" ||
  process.env.NODE_ENV === "development";

interface ImageUploaderProps {
  id: string;
  value: string;
  onChange: (url: string) => void;
}

function ImageUploader({ id, value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
      );
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.secure_url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const triggerPicker = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const fileInput = (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Partner Image
        </label>
        {IS_NON_PROD && (
          <button
            type="button"
            onClick={() => {
              onChange(STAGING_IMAGE_URL);
              toast.success("Staging image prefilled.");
            }}
            className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 hover:bg-blue-200 transition-colors font-semibold"
          >
            <Check className="w-3 h-3" />
            Prefill (Staging)
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group w-full h-44 border border-gray-200 overflow-hidden">
          <img
            src={value}
            alt="Partner preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={triggerPicker}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Change image"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {isUploading ? "Uploading..." : "Change"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/60 text-white text-xs font-medium hover:bg-red-500/80 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerPicker}
          disabled={isUploading}
          className="w-full h-44 border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-[#0096FF] hover:bg-blue-50/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-[#0096FF] animate-spin" />
              <span className="text-sm text-gray-500 font-medium">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">
                  Click to upload image
                </span>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </>
          )}
        </button>
      )}
      {isMounted && createPortal(fileInput, document.body)}
    </div>
  );
}

interface PartnerFormModalProps {
  editingPartner: Partner | null;
  isLoading: boolean;
  onSave: (data: CreatePartnerPayload | UpdatePartnerPayload) => void;
  onClose: () => void;
}

function PartnerFormModal({
  editingPartner,
  isLoading,
  onSave,
  onClose,
}: PartnerFormModalProps) {
  const [form, setForm] = useState<CreatePartnerPayload>(
    editingPartner
      ? {
          name: editingPartner.name,
          imageUrl: editingPartner.imageUrl,
          description: editingPartner.description,
          address: editingPartner.address,
          contactEmail: editingPartner.contactEmail,
          contactPhone: editingPartner.contactPhone,
          contactPersonName: editingPartner.contactPersonName,
          website: editingPartner.website,
          partnerType: editingPartner.partnerType,
          latitude: editingPartner.latitude,
          longitude: editingPartner.longitude,
        }
      : { ...DEFAULT_FORM },
  );

  const handleField = (field: keyof CreatePartnerPayload, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleLocationSelect = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      setForm((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    },
    [],
  );

  const handleSaveClick = () => {
    if (editingPartner) {
      onSave({
        ...form,
        id: editingPartner.id,
        isActive: editingPartner.active,
      } as UpdatePartnerPayload);
    } else {
      onSave(form);
    }
  };

  const selectedType =
    PARTNER_TYPES.find((t) => t.id === form.partnerType) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white shadow-xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingPartner ? "Edit Partner" : "Create New Partner"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          <ImageUploader
            id="partner-image-upload"
            value={form.imageUrl}
            onChange={(url) => handleField("imageUrl", url)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Partner Name"
              id="p-name"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
              placeholder="e.g. Federal Palace Hotel"
              required
            />
            <Select
              label="Partner Type"
              options={PARTNER_TYPES}
              selected={selectedType}
              onChange={(opt) => handleField("partnerType", opt.id)}
              placeholder="Select type"
            />
          </div>

          <TextAreaInput
            label="Description"
            id="p-description"
            value={form.description}
            onChange={(e) => handleField("description", e.target.value)}
            placeholder="Brief description of the partner..."
            rows={3}
          />

          <div>
            <AddressInput
              label="Address"
              id="p-address"
              value={form.address}
              onChange={(val) => handleField("address", val)}
              onLocationSelect={handleLocationSelect}
              placeholder="Start typing an address..."
            />
            {form.latitude !== null && form.longitude !== null && (
              <p className="mt-1 text-xs text-gray-400">
                📍 Coordinates resolved: {Number(form.latitude).toFixed(4)},{" "}
                {Number(form.longitude).toFixed(4)}
              </p>
            )}
          </div>

          <TextInput
            label="Website"
            id="p-website"
            type="url"
            value={form.website}
            onChange={(e) => handleField("website", e.target.value)}
            placeholder="https://www.example.com"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Contact Person Name"
              id="p-contactPersonName"
              value={form.contactPersonName}
              onChange={(e) => handleField("contactPersonName", e.target.value)}
              placeholder="James Millier"
            />
            <TextInput
              label="Contact Phone"
              id="p-contactPhone"
              type="tel"
              value={form.contactPhone}
              onChange={(e) => handleField("contactPhone", e.target.value)}
              placeholder="09068525606"
            />
          </div>

          <TextInput
            label="Contact Email"
            id="p-contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(e) => handleField("contactEmail", e.target.value)}
            placeholder="contact@example.com"
          />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={isLoading}
            onClick={handleSaveClick}
          >
            {editingPartner ? "Update Partner" : "Create Partner"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PartnersContent() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(0);
    }, 400);
  };

  const { data, isLoading, isError } = useGetPartners(page, debouncedSearch);
  const createMutation = useCreatePartner();
  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleSave = (payload: CreatePartnerPayload | UpdatePartnerPayload) => {
    if (editingPartner) {
      updateMutation.mutate(
        { id: editingPartner.id, payload: payload as UpdatePartnerPayload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createMutation.mutate(payload as CreatePartnerPayload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    });
  };

  const columns: ColumnDefinition<Partner>[] = [
    {
      header: "Partner",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-10 w-10 rounded object-cover flex-shrink-0 border border-gray-100"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-500">{item.address}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "partnerType",
      cell: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          {item.partnerType}
        </span>
      ),
    },
    {
      header: "Contact",
      accessorKey: "contactPersonName",
      cell: (item) => (
        <div className="space-y-0.5">
          <p className="text-sm text-gray-800 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-gray-400" />
            {item.contactPersonName}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Mail className="h-3 w-3 text-gray-400" />
            {item.contactEmail}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-400" />
            {item.contactPhone}
          </p>
        </div>
      ),
    },
    {
      header: "Operating States",
      accessorKey: "operatingStates",
      cell: (item) =>
        item.operatingStates?.length ? (
          <div className="flex flex-wrap gap-1">
            {item.operatingStates.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-700"
              >
                {s.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No states</span>
        ),
    },
    {
      header: "Status",
      accessorKey: "active",
      cell: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
            item.active
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {item.active ? "Active" : "Inactive"}
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
            className="w-auto px-3"
            onClick={() => router.push(`/dashboard/partners/${item.id}`)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-3"
            onClick={() => handleOpenEdit(item)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="w-auto px-3"
            onClick={() => setDeletingId(item.id)}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage hotels, restaurants, and other service partners.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto px-5"
            onClick={handleOpenCreate}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Partner
          </Button>
        </div>

        <div className="mb-6 max-w-sm">
          <TextInput
            label="Search"
            id="search"
            hideLabel
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search partners..."
          />
        </div>

        {isLoading && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load partners.</span>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-200">
                <Globe className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No partners found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {debouncedSearch
                    ? `No results for "${debouncedSearch}"`
                    : "Add your first partner to get started."}
                </p>
              </div>
            ) : (
              <CustomTable
                data={data?.content ?? []}
                columns={columns}
                getUniqueRowId={(item) => item.id}
              />
            )}
            <PaginationControls
              currentPage={page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </>
        )}
      </main>

      {isModalOpen && (
        <PartnerFormModal
          editingPartner={editingPartner}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Partner"
        message="Are you sure you want to delete this partner? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}

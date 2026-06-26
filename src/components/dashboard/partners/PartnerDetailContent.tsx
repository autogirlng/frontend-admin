"use client";

import React, { useState, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Globe,
  Mail,
  Phone,
  User,
  MapPin,
  Tag,
  AlertCircle,
  X,
  ExternalLink,
  Plus,
  Car,
  Upload,
  Loader2,
  ImageIcon,
  Check,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Select, { Option } from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import CustomLoader from "@/components/generic/CustomLoader";
import { apiClient } from "@/lib/apiClient";

import {
  useGetPartnerById,
  useGetPartnerPriorityVehicles,
  useUpdatePartner,
  useDeletePartner,
  useRemoveStateFromPartner,
  useRemoveVehicleFromPartner,
  useMapStatesToPartner,
  useMapVehiclesToPartner,
} from "@/lib/hooks/partners/usePartners";
import type {
  Partner,
  UpdatePartnerPayload,
  VehicleListItem,
  PartnerPriorityVehicle,
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

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const STAGING_IMAGE_URL =
  "https://res.cloudinary.com/dgnalaojk/image/upload/f_auto,q_auto,w_800/v1767115432/trv57nsfk4ww6eudsj7f.jpg";

function getPrimaryPhoto(
  photos: PartnerPriorityVehicle["photos"],
): string | null {
  const primary = photos.find((p) => p.isPrimary);
  return primary?.cloudinaryUrl ?? photos[0]?.cloudinaryUrl ?? null;
}

function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
      );
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.secure_url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Partner Image
        </label>
      </div>

      {value ? (
        <div className="relative group w-full h-40 border border-gray-200 overflow-hidden">
          <img
            src={value}
            alt="Partner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
              title="Change"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 rounded-full bg-red-500/50 text-white hover:bg-red-500/80"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-40 border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-[#0096FF] hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-7 w-7 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-7 w-7 text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload image
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />

      {process.env.NEXT_PUBLIC_APP_ENV === "staging" && (
        <button
          type="button"
          onClick={() => {
            onChange(STAGING_IMAGE_URL);
            toast.success("Staging image prefilled.");
          }}
          className="mt-2 inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 hover:bg-blue-200 transition-colors font-semibold"
        >
          <Check className="w-3 h-3" />
          Prefill Staging Image
        </button>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#0096FF] hover:underline flex items-center gap-1 mt-0.5"
          >
            {value}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm text-gray-900 mt-0.5 break-words">{value}</p>
        )}
      </div>
    </div>
  );
}

function EditModal({
  partner,
  isLoading,
  onSave,
  onClose,
}: {
  partner: Partner;
  isLoading: boolean;
  onSave: (payload: UpdatePartnerPayload) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UpdatePartnerPayload>({
    id: partner.id,
    name: partner.name,
    imageUrl: partner.imageUrl,
    description: partner.description,
    address: partner.address,
    contactEmail: partner.contactEmail,
    contactPhone: partner.contactPhone,
    contactPersonName: partner.contactPersonName,
    website: partner.website,
    partnerType: partner.partnerType,
    latitude: partner.latitude,
    longitude: partner.longitude,
    isActive: partner.active,
  });

  const set = (field: keyof UpdatePartnerPayload, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedType =
    PARTNER_TYPES.find((t) => t.id === form.partnerType) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white shadow-xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Partner</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <ImageUploader
            value={form.imageUrl}
            onChange={(url) => set("imageUrl", url)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Partner Name"
              id="edit-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
            <Select
              label="Partner Type"
              options={PARTNER_TYPES}
              selected={selectedType}
              onChange={(opt) => set("partnerType", opt.id)}
            />
          </div>

          <TextAreaInput
            label="Description"
            id="edit-desc"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
          />

          <div>
            <AddressInput
              label="Address"
              id="edit-address"
              value={form.address}
              onChange={(val) => set("address", val)}
              onLocationSelect={(c) =>
                setForm((p) => ({
                  ...p,
                  latitude: c.latitude,
                  longitude: c.longitude,
                }))
              }
            />
            {form.latitude != null && form.longitude != null && (
              <p className="mt-1 text-xs text-gray-400">
                📍 {Number(form.latitude).toFixed(4)},{" "}
                {Number(form.longitude).toFixed(4)}
              </p>
            )}
          </div>

          <TextInput
            label="Website"
            id="edit-website"
            type="url"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Contact Person Name"
              id="edit-cpn"
              value={form.contactPersonName}
              onChange={(e) => set("contactPersonName", e.target.value)}
            />
            <TextInput
              label="Contact Phone"
              id="edit-phone"
              type="tel"
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
            />
          </div>

          <TextInput
            label="Contact Email"
            id="edit-email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 text-[#0096FF] border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-medium">Active</span>
          </label>
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
            onClick={() => onSave(form)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Country {
  id: string;
  name: string;
}
interface GeoState {
  id: string;
  name: string;
}

function AddStatesModal({
  partnerId,
  existingStateIds,
  onClose,
}: {
  partnerId: string;
  existingStateIds: string[];
  onClose: () => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([]);
  const mapStatesMutation = useMapStatesToPartner();

  const { data: countries = [], isLoading: loadingCountries } = useQuery<
    Country[]
  >({
    queryKey: ["countries"],
    queryFn: () => apiClient.get<Country[]>("/countries"),
  });

  const { data: states = [], isLoading: loadingStates } = useQuery<GeoState[]>({
    queryKey: ["states", selectedCountry?.id],
    queryFn: () =>
      apiClient.get<GeoState[]>(`/states/country/${selectedCountry!.id}`),
    enabled: !!selectedCountry,
  });

  const availableStates = states.filter(
    (s) => !existingStateIds.includes(s.id),
  );

  const toggleState = (id: string) =>
    setSelectedStateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSave = () => {
    if (!selectedStateIds.length) {
      toast.error("Select at least one state.");
      return;
    }
    mapStatesMutation.mutate(
      { id: partnerId, payload: { stateIds: selectedStateIds } },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Operating States
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              1. Select a Country
            </p>
            {loadingCountries ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading countries...
              </div>
            ) : (
              <Select
                label="Country"
                hideLabel
                options={countries.map((c) => ({ id: c.id, name: c.name }))}
                selected={selectedCountry}
                onChange={(opt) => {
                  setSelectedCountry(opt);
                  setSelectedStateIds([]);
                }}
                placeholder="Choose a country..."
              />
            )}
          </div>

          {selectedCountry && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                2. Select States to Add
              </p>
              {loadingStates ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading states...
                </div>
              ) : availableStates.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200">
                  All states from this country are already assigned.
                </p>
              ) : (
                <div className="max-h-52 overflow-y-auto space-y-1 border border-gray-100 p-2">
                  {availableStates.map((s) => {
                    const checked = selectedStateIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded transition-colors ${checked ? "bg-indigo-50" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleState(s.id)}
                          className="h-4 w-4 text-[#0096FF] border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-800">{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {selectedStateIds.length > 0 && (
            <p className="text-xs text-[#0096FF] font-medium">
              {selectedStateIds.length} state
              {selectedStateIds.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={mapStatesMutation.isPending}
            disabled={!selectedStateIds.length}
            onClick={handleSave}
          >
            Add States
          </Button>
        </div>
      </div>
    </div>
  );
}

interface VehicleAssignment {
  vehicleId: string;
  priority: number;
}

function AssignVehiclesModal({
  partnerId,
  partnerSlug,
  assignedVehicleIds,
  onClose,
}: {
  partnerId: string;
  partnerSlug: string;
  assignedVehicleIds: string[];
  onClose: () => void;
}) {
  const [assignments, setAssignments] = useState<VehicleAssignment[]>(
    assignedVehicleIds.map((id, i) => ({ vehicleId: id, priority: i + 1 })),
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapVehiclesMutation = useMapVehiclesToPartner();

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const { data: vehicleData, isLoading: loadingVehicles } = useQuery<{
    content: VehicleListItem[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }>({
    queryKey: ["vehicles", "partner-modal", debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: "0",
        size: "20",
        status: "APPROVED",
      });
      if (debouncedSearch) params.append("searchTerm", debouncedSearch);
      return apiClient.get<{
        content: VehicleListItem[];
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      }>(`/vehicles?${params}`);
    },
  });

  const vehicles: VehicleListItem[] = vehicleData?.content ?? [];

  const toggleVehicle = (vehicleId: string) => {
    if (assignedVehicleIds.includes(vehicleId)) return;
    setAssignments((prev) => {
      if (prev.find((a) => a.vehicleId === vehicleId)) {
        return prev.filter((a) => a.vehicleId !== vehicleId);
      }
      const newCount = prev.filter(
        (a) => !assignedVehicleIds.includes(a.vehicleId),
      ).length;
      return [
        ...prev,
        { vehicleId, priority: assignedVehicleIds.length + newCount + 1 },
      ];
    });
  };

  const setPriority = (vehicleId: string, priority: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a.vehicleId === vehicleId ? { ...a, priority } : a)),
    );
  };

  const newAssignments = assignments.filter(
    (a) => !assignedVehicleIds.includes(a.vehicleId),
  );

  const handleSave = () => {
    if (!newAssignments.length) {
      toast.error("Select at least one new vehicle to assign.");
      return;
    }
    mapVehiclesMutation.mutate(
      {
        id: partnerId,
        slug: partnerSlug,
        payload: { vehicles: newAssignments },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Assign Vehicles
            </h2>
            {assignedVehicleIds.length > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {assignedVehicleIds.length} already assigned (shown as checked)
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <TextInput
            label="Search"
            id="v-search"
            hideLabel
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, plate number..."
          />

          {loadingVehicles ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-gray-200">
              <Car className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No vehicles found.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {vehicles.map((v) => {
                const assignment = assignments.find(
                  (a) => a.vehicleId === v.id,
                );
                const checked = !!assignment;
                const alreadyAssigned = assignedVehicleIds.includes(v.id);

                return (
                  <div
                    key={v.id}
                    className={`flex items-center gap-3 px-3 py-2.5 border transition-colors ${
                      alreadyAssigned
                        ? "bg-gray-50 border-gray-200 opacity-80"
                        : checked
                          ? "bg-indigo-50 border-indigo-200"
                          : "border-transparent hover:bg-gray-50 hover:border-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleVehicle(v.id)}
                      disabled={alreadyAssigned}
                      className="h-4 w-4 text-[#0096FF] border-gray-300 rounded flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {v.name}
                        </p>
                        {alreadyAssigned && (
                          <span className="inline-flex items-center px-1.5 py-0.5 text-xs bg-green-100 text-green-700 flex-shrink-0">
                            Assigned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {v.vehicleIdentifier}
                      </p>
                      {v.licensePlateNumber && (
                        <p className="text-xs text-gray-400">
                          {v.licensePlateNumber}
                        </p>
                      )}
                    </div>
                    {checked && !alreadyAssigned && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-gray-500">Priority</span>
                        <input
                          type="number"
                          min={1}
                          value={assignment!.priority}
                          onChange={(e) =>
                            setPriority(v.id, Number(e.target.value))
                          }
                          className="w-14 text-xs border border-gray-300 px-2 py-1 text-center focus:outline-none focus:border-[#0096FF]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {newAssignments.length > 0 && (
            <p className="text-xs text-[#0096FF] font-medium">
              {newAssignments.length} new vehicle
              {newAssignments.length > 1 ? "s" : ""} will be assigned
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={mapVehiclesMutation.isPending}
            disabled={!newAssignments.length}
            onClick={handleSave}
          >
            Assign{" "}
            {newAssignments.length > 0 ? `(${newAssignments.length})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignedVehicleCard({
  vehicle,
  onRemove,
}: {
  vehicle: PartnerPriorityVehicle;
  onRemove: () => void;
}) {
  const primaryPhoto = getPrimaryPhoto(vehicle.photos);
  const lowestPrice = vehicle.allPricingOptions.length
    ? Math.min(...vehicle.allPricingOptions.map((p) => p.price))
    : null;

  return (
    <div className="flex items-start gap-3 p-3 border border-gray-100 bg-gray-50 group">
      <div className="h-14 w-20 flex-shrink-0 bg-gray-200 overflow-hidden rounded">
        {primaryPhoto ? (
          <img
            src={primaryPhoto}
            alt={vehicle.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Car className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {vehicle.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {vehicle.vehicleIdentifier}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">
            {vehicle.vehicleTypeName}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500">
            {vehicle.numberOfSeats} seats
          </span>
          {lowestPrice !== null && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-600 font-medium">
                from ₦{lowestPrice.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        title="Remove vehicle"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PartnerDetailContent() {
  const pathname = usePathname();
  const partnerId = pathname.split("/").pop() ?? "";
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removingStateId, setRemovingStateId] = useState<string | null>(null);
  const [removingVehicle, setRemovingVehicle] =
    useState<PartnerPriorityVehicle | null>(null);
  const [addStatesOpen, setAddStatesOpen] = useState(false);
  const [assignVehiclesOpen, setAssignVehiclesOpen] = useState(false);

  const { data: partner, isLoading, isError } = useGetPartnerById(partnerId);

  const { data: assignedVehicles = [], isLoading: loadingVehicles } =
    useGetPartnerPriorityVehicles(partner?.slug);

  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();
  const removeStateMutation = useRemoveStateFromPartner();
  const removeVehicleMutation = useRemoveVehicleFromPartner();

  const assignedVehicleIds = useMemo(
    () => assignedVehicles.map((v) => v.id),
    [assignedVehicles],
  );

  const handleUpdate = (payload: UpdatePartnerPayload) => {
    updateMutation.mutate(
      { id: partnerId, payload },
      { onSuccess: () => setIsEditOpen(false) },
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(partnerId, {
      onSuccess: () => router.push("/dashboard/partners"),
    });
  };

  const handleRemoveVehicle = () => {
    if (!removingVehicle || !partner) return;
    removeVehicleMutation.mutate(
      { id: partnerId, slug: partner.slug, vehicleId: removingVehicle.id },
      { onSuccess: () => setRemovingVehicle(null) },
    );
  };

  if (isLoading) return <CustomLoader />;

  if (isError || !partner) {
    return (
      <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200">
        <AlertCircle className="h-8 w-8" />
        <span className="font-semibold">Failed to load partner.</span>
        <Button
          variant="secondary"
          className="w-auto px-4 mt-2"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const existingStateIds = partner.operatingStates?.map((s) => s.id) ?? [];

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Partners
        </button>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="w-auto px-4"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            className="w-auto px-4"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 mb-6 overflow-hidden">
        {partner.imageUrl && (
          <div className="h-52 w-full overflow-hidden">
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {partner.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{partner.slug}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold ${
                  partner.active
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {partner.active ? "Active" : "Inactive"}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {partner.partnerType}
              </span>
            </div>
          </div>
          {partner.description && (
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              {partner.description}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Contact & Location
          </h2>
          <InfoRow
            icon={User}
            label="Contact Person"
            value={partner.contactPersonName}
          />
          <InfoRow icon={Mail} label="Email" value={partner.contactEmail} />
          <InfoRow icon={Phone} label="Phone" value={partner.contactPhone} />
          <InfoRow icon={MapPin} label="Address" value={partner.address} />
          <InfoRow
            icon={Globe}
            label="Website"
            value={partner.website}
            href={partner.website}
          />
          <InfoRow
            icon={Tag}
            label="Coordinates"
            value={
              partner.latitude != null && partner.longitude != null
                ? `${partner.latitude}, ${partner.longitude}`
                : undefined
            }
          />
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Operating States
            </h2>
            <Button
              variant="secondary"
              className="w-auto px-3 h-8 text-xs"
              onClick={() => setAddStatesOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add States
            </Button>
          </div>

          {partner.operatingStates?.length ? (
            <div className="space-y-2">
              {partner.operatingStates.map((state) => (
                <div
                  key={state.id}
                  className="flex items-center justify-between px-3 py-2.5 border border-gray-100 bg-gray-50"
                >
                  <span className="text-sm text-gray-800 font-medium">
                    {state.name}
                  </span>
                  <button
                    onClick={() => setRemovingStateId(state.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove state"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200">
              <MapPin className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                No operating states assigned yet.
              </p>
              <button
                onClick={() => setAddStatesOpen(true)}
                className="mt-3 text-xs text-[#0096FF] hover:underline font-medium"
              >
                + Add states
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Assigned Vehicles
            </h2>
            {assignedVehicles.length > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {assignedVehicles.length} vehicle
                {assignedVehicles.length > 1 ? "s" : ""} assigned
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            className="w-auto px-3 h-8 text-xs"
            onClick={() => setAssignVehiclesOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Assign Vehicles
          </Button>
        </div>

        {loadingVehicles ? (
          <div className="flex items-center justify-center py-10 gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading assigned vehicles...
          </div>
        ) : assignedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignedVehicles.map((v) => (
              <AssignedVehicleCard
                key={v.id}
                vehicle={v}
                onRemove={() => setRemovingVehicle(v)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200">
            <Car className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No vehicles assigned yet.</p>
            <button
              onClick={() => setAssignVehiclesOpen(true)}
              className="mt-3 text-xs text-[#0096FF] hover:underline font-medium"
            >
              + Assign vehicles
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Metadata
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Created At
            </p>
            <p className="text-gray-900 mt-0.5">
              {new Date(partner.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Updated At
            </p>
            <p className="text-gray-900 mt-0.5">
              {new Date(partner.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditModal
          partner={partner}
          isLoading={updateMutation.isPending}
          onSave={handleUpdate}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {addStatesOpen && (
        <AddStatesModal
          partnerId={partnerId}
          existingStateIds={existingStateIds}
          onClose={() => setAddStatesOpen(false)}
        />
      )}

      {assignVehiclesOpen && (
        <AssignVehiclesModal
          partnerId={partnerId}
          partnerSlug={partner.slug}
          assignedVehicleIds={assignedVehicleIds}
          onClose={() => setAssignVehiclesOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Partner"
        message={`Are you sure you want to delete "${partner.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!removingStateId}
        title="Remove Operating State"
        message="Are you sure you want to remove this state from the partner?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => {
          if (!removingStateId) return;
          removeStateMutation.mutate(
            { id: partnerId, stateId: removingStateId },
            { onSuccess: () => setRemovingStateId(null) },
          );
        }}
        onCancel={() => setRemovingStateId(null)}
        isLoading={removeStateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!removingVehicle}
        title="Remove Vehicle"
        message={`Remove "${removingVehicle?.name}" from this partner?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleRemoveVehicle}
        onCancel={() => setRemovingVehicle(null)}
        isLoading={removeVehicleMutation.isPending}
      />
    </>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Car,
  Tag,
  Clock,
  Calendar,
  DollarSign,
  Search,
  AlertTriangle,
  X,
  Info,
  Plus,
} from "lucide-react";
import clsx from "clsx";
import {
  useGetPricingCatalog,
  useTogglePricingSheetStatus,
  useUpdatePricingSheet,
  useDeletePricingSheet,
  useCreatePricingSheet,
  PricingSheet,
  UpdatePricingSheetPayload,
  CreatePricingSheetPayload,
  PricingItem,
} from "@/lib/hooks/set-up/pricing-sheet/usePricingSheets";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import CustomLoader from "@/components/generic/CustomLoader";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS: Option[] = Array.from(
  { length: CURRENT_YEAR - 2010 + 10 },
  (_, i) => {
    const y = String(2010 + i);
    return { id: y, name: y };
  },
);
const UPGRADED_YEARS: Option[] = [{ id: "", name: "None" }, ...YEARS];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface SheetFormState {
  startYear: Option | null;
  endYear: Option | null;
  upgradedYear: Option | null;
  bookingType: Option | null;
  price: string;
}

function validateForm(f: SheetFormState): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!f.startYear) errs.startYear = "Start year is required.";
  if (!f.endYear) errs.endYear = "End year is required.";
  if (
    f.startYear &&
    f.endYear &&
    Number(f.startYear.id) > Number(f.endYear.id)
  ) {
    errs.endYear = "End year cannot be before start year.";
  }
  if (!f.bookingType) errs.bookingType = "Booking type is required.";
  if (!f.price || isNaN(Number(f.price)) || Number(f.price) <= 0)
    errs.price = "A valid price is required.";
  return errs;
}

interface SheetFormBodyProps {
  form: SheetFormState;
  errors: Record<string, string>;
  bookingTypeOptions: Option[];
  onChange: (patch: Partial<SheetFormState>) => void;
}

function SheetFormBody({
  form,
  errors,
  bookingTypeOptions,
  onChange,
}: SheetFormBodyProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Start Year"
          options={YEARS}
          selected={form.startYear}
          onChange={(v) => onChange({ startYear: v })}
          placeholder="Select"
          error={errors.startYear}
        />
        <Select
          label="End Year"
          options={YEARS}
          selected={form.endYear}
          onChange={(v) => onChange({ endYear: v })}
          placeholder="Select"
          error={errors.endYear}
        />
        <Select
          label="Upgraded Year"
          options={UPGRADED_YEARS}
          selected={form.upgradedYear}
          onChange={(v) => onChange({ upgradedYear: v })}
          placeholder="None"
        />
      </div>
      <Select
        label="Booking Type"
        options={bookingTypeOptions}
        selected={form.bookingType}
        onChange={(v) => onChange({ bookingType: v })}
        placeholder="Select booking type"
        error={errors.bookingType}
      />
      <TextInput
        label="Price (NGN)"
        id="sheet-price"
        type="number"
        value={form.price}
        onChange={(e) => onChange({ price: e.target.value })}
        error={errors.price}
        min={1}
      />
    </div>
  );
}

interface PricingItemRowProps {
  index: number;
  item: { bookingTypeId: string; price: string };
  bookingTypeOptions: Option[];
  usedBookingTypeIds: string[];
  error?: { bookingTypeId?: string; price?: string };
  onChange: (
    index: number,
    patch: Partial<{ bookingTypeId: string; price: string }>,
  ) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

function PricingItemRow({
  index,
  item,
  bookingTypeOptions,
  usedBookingTypeIds,
  error,
  onChange,
  onRemove,
  canRemove,
}: PricingItemRowProps) {
  const availableOptions = bookingTypeOptions.filter(
    (bt) => bt.id === item.bookingTypeId || !usedBookingTypeIds.includes(bt.id),
  );
  const selected =
    availableOptions.find((bt) => bt.id === item.bookingTypeId) ?? null;

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 flex items-center justify-center h-[50px] w-6 text-xs font-medium text-gray-400">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <Select
          label=""
          hideLabel
          options={availableOptions}
          selected={selected}
          onChange={(v) => onChange(index, { bookingTypeId: v.id })}
          placeholder="Booking type"
          error={error?.bookingTypeId}
        />
      </div>
      <div className="w-32 flex-shrink-0">
        <TextInput
          label=""
          hideLabel
          id={`pricing-item-price-${index}`}
          type="number"
          value={item.price}
          onChange={(e) => onChange(index, { price: e.target.value })}
          placeholder="Price (₦)"
          error={error?.price}
          min={1}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className={clsx(
          "flex-shrink-0 mt-[13px] p-1.5 rounded transition-colors",
          canRemove
            ? "text-red-400 hover:text-red-600 hover:bg-red-50"
            : "text-gray-200 cursor-not-allowed",
        )}
        title="Remove row"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface CreateSheetModalProps {
  makeName: string;
  modelId: string;
  modelName: string;
  bookingTypeOptions: Option[];
  onClose: () => void;
}

interface PricingItemDraft {
  bookingTypeId: string;
  price: string;
}

interface PricingItemErrors {
  bookingTypeId?: string;
  price?: string;
}

function emptyPricingItem(): PricingItemDraft {
  return { bookingTypeId: "", price: "" };
}

function CreateSheetModal({
  makeName,
  modelId,
  modelName,
  bookingTypeOptions,
  onClose,
}: CreateSheetModalProps) {
  const createMutation = useCreatePricingSheet();
  const [startYear, setStartYear] = useState<Option | null>(null);
  const [endYear, setEndYear] = useState<Option | null>(null);
  const [upgradedYear, setUpgradedYear] = useState<Option | null>(
    UPGRADED_YEARS[0],
  );
  const [yearErrors, setYearErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<PricingItemDraft[]>([emptyPricingItem()]);
  const [itemErrors, setItemErrors] = useState<PricingItemErrors[]>([{}]);

  const usedBookingTypeIds = items.map((i) => i.bookingTypeId).filter(Boolean);

  const updateItem = (index: number, patch: Partial<PricingItemDraft>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
    setItemErrors((prev) => prev.map((e, i) => (i === index ? {} : e)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, emptyPricingItem()]);
    setItemErrors((prev) => [...prev, {}]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setItemErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const yErrs: Record<string, string> = {};
    if (!startYear) yErrs.startYear = "Start year is required.";
    if (!endYear) yErrs.endYear = "End year is required.";
    if (startYear && endYear && Number(startYear.id) > Number(endYear.id)) {
      yErrs.endYear = "Cannot be before start year.";
    }
    setYearErrors(yErrs);

    const iErrs: PricingItemErrors[] = items.map((item) => {
      const e: PricingItemErrors = {};
      if (!item.bookingTypeId) e.bookingTypeId = "Select a booking type.";
      if (!item.price || isNaN(Number(item.price)) || Number(item.price) <= 0)
        e.price = "Enter a valid price.";
      return e;
    });
    setItemErrors(iErrs);

    const yearOk = Object.keys(yErrs).length === 0;
    const itemsOk = iErrs.every((e) => Object.keys(e).length === 0);
    return yearOk && itemsOk;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const payload: CreatePricingSheetPayload = {
      vehicleModelId: modelId,
      startYear: Number(startYear!.id),
      endYear: Number(endYear!.id),
      upgradedYear: upgradedYear?.id ? Number(upgradedYear.id) : null,
      pricingItems: items.map((it) => ({
        bookingTypeId: it.bookingTypeId,
        price: Number(it.price),
      })),
    };

    createMutation.mutate(payload, { onSuccess: onClose });
  };

  const canAddMore = items.length < bookingTypeOptions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Pricing Sheet
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {makeName} · {modelName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={createMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Vehicle Year Range
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Start Year"
                options={YEARS}
                selected={startYear}
                onChange={setStartYear}
                placeholder="Start"
                error={yearErrors.startYear}
              />
              <Select
                label="End Year"
                options={YEARS}
                selected={endYear}
                onChange={setEndYear}
                placeholder="End"
                error={yearErrors.endYear}
              />
              <Select
                label="Upgraded Year"
                options={UPGRADED_YEARS}
                selected={upgradedYear}
                onChange={setUpgradedYear}
                placeholder="None"
              />
            </div>
          </div>
          <div className="border-t border-gray-100" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">
                Pricing Items
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({items.length} of {bookingTypeOptions.length} booking types)
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 mb-1.5 pl-9 pr-8">
              <p className="flex-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Booking Type
              </p>
              <p className="w-32 flex-shrink-0 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price (₦)
              </p>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <PricingItemRow
                  key={idx}
                  index={idx}
                  item={item}
                  bookingTypeOptions={bookingTypeOptions}
                  usedBookingTypeIds={usedBookingTypeIds}
                  error={itemErrors[idx]}
                  onChange={updateItem}
                  onRemove={removeItem}
                  canRemove={items.length > 1}
                />
              ))}
            </div>
            {canAddMore && (
              <button
                type="button"
                onClick={addItem}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#0096FF] hover:text-[#007ACC] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add another booking type
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={createMutation.isPending}
            className="w-full sm:w-[140px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            isLoading={createMutation.isPending}
            className="w-full sm:w-[140px]"
          >
            Create Sheet
          </Button>
        </div>
      </div>
    </div>
  );
}

interface EditSheetModalProps {
  sheet: PricingSheet;
  bookingTypeOptions: Option[];
  onClose: () => void;
}

function EditSheetModal({
  sheet,
  bookingTypeOptions,
  onClose,
}: EditSheetModalProps) {
  const updateMutation = useUpdatePricingSheet();
  const [form, setForm] = useState<SheetFormState>({
    startYear: YEARS.find((y) => y.id === String(sheet.startYear)) ?? null,
    endYear: YEARS.find((y) => y.id === String(sheet.endYear)) ?? null,
    upgradedYear: sheet.upgradedYear
      ? (UPGRADED_YEARS.find((y) => y.id === String(sheet.upgradedYear)) ??
        UPGRADED_YEARS[0])
      : UPGRADED_YEARS[0],
    bookingType:
      bookingTypeOptions.find((b) => b.name === sheet.bookingTypeName) ?? null,
    price: String(sheet.price),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patch = (p: Partial<SheetFormState>) =>
    setForm((f) => ({ ...f, ...p }));

  const handleSave = () => {
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload: UpdatePricingSheetPayload = {
      startYear: Number(form.startYear!.id),
      endYear: Number(form.endYear!.id),
      upgradedYear: form.upgradedYear?.id ? Number(form.upgradedYear.id) : null,
      bookingTypeId: form.bookingType!.id,
      price: Number(form.price),
    };
    updateMutation.mutate({ id: sheet.id, payload }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Pricing Sheet
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {sheet.vehicleMakeName} · {sheet.vehicleModelName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={updateMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          <SheetFormBody
            form={form}
            errors={errors}
            bookingTypeOptions={bookingTypeOptions}
            onChange={patch}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="w-full sm:w-[140px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={updateMutation.isPending}
            className="w-full sm:w-[140px]"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CreateTarget {
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
}

interface SheetRowProps {
  sheet: PricingSheet;
  onEdit: (sheet: PricingSheet) => void;
  onDelete: (sheet: PricingSheet) => void;
  onToggle: (sheet: PricingSheet) => void;
}

function SheetRow({ sheet, onEdit, onDelete, onToggle }: SheetRowProps) {
  const isSheetActive = sheet.isActive ?? sheet.active;

  const actions: ActionMenuItem[] = [
    {
      label: "Edit",
      icon: Edit2,
      onClick: () => onEdit(sheet),
    },
    {
      label: isSheetActive ? "Deactivate" : "Activate",
      icon: isSheetActive ? ToggleLeft : ToggleRight,
      onClick: () => onToggle(sheet),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => onDelete(sheet),
      danger: true,
    },
  ];

  return (
    <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[150px_1fr_80px_140px_auto] items-center gap-x-4 gap-y-1 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
      <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit whitespace-nowrap">
        <Calendar className="h-3 w-3 flex-shrink-0" />
        <span>
          {sheet.startYear} - {sheet.endYear}
        </span>
        {sheet.upgradedYear && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span>{sheet.upgradedYear}</span>
          </>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {sheet.bookingTypeName}
        </p>
        <p className="text-xs text-gray-400 sm:hidden flex items-center gap-1 mt-0.5">
          <Calendar className="h-3 w-3" />
          {sheet.startYear} - {sheet.endYear}
          {sheet.upgradedYear && ` → ${sheet.upgradedYear}`}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
        <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        <span>{formatDuration(sheet.durationInMinutes)}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        {formatPrice(sheet.price)}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <span
          className={clsx(
            "hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
            isSheetActive
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600",
          )}
        >
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full flex-shrink-0",
              isSheetActive ? "bg-green-500" : "bg-red-400",
            )}
          />
          {isSheetActive ? "Active" : "Inactive"}
        </span>
        <ActionMenu actions={actions} />
      </div>
    </div>
  );
}

interface ModelAccordionProps {
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
  modelCode: string;
  sheets: PricingSheet[];
  bookingTypeOptions: Option[];
  searchQuery: string;
  onEdit: (sheet: PricingSheet) => void;
  onDelete: (sheet: PricingSheet) => void;
  onToggle: (sheet: PricingSheet) => void;
  onAddSheet: (target: CreateTarget) => void;
}

function ModelAccordion({
  makeId,
  makeName,
  modelId,
  modelName,
  modelCode,
  sheets,
  bookingTypeOptions,
  searchQuery,
  onEdit,
  onDelete,
  onToggle,
  onAddSheet,
}: ModelAccordionProps) {
  const [open, setOpen] = useState(true);

  const filtered = useMemo(() => {
    if (!searchQuery) return sheets;
    const q = searchQuery.toLowerCase();
    return sheets.filter(
      (s) =>
        s.bookingTypeName.toLowerCase().includes(q) ||
        String(s.startYear).includes(q) ||
        String(s.endYear).includes(q) ||
        String(s.upgradedYear ?? "").includes(q) ||
        String(s.price).includes(q),
    );
  }, [sheets, searchQuery]);

  const activeCount = sheets.filter((s) => s.isActive ?? s.active).length;

  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
        >
          <div className="flex items-center justify-center h-8 w-8 bg-indigo-50 text-indigo-600 rounded flex-shrink-0">
            <Tag className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {modelName}
            </p>
            <p className="text-xs text-gray-400">{modelCode}</p>
          </div>
        </button>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
              {sheets.length} sheet{sheets.length !== 1 ? "s" : ""}
            </span>
            {activeCount > 0 && (
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSheet({ makeId, makeName, modelId, modelName });
            }}
            className="flex items-center gap-1 text-xs font-medium text-[#0096FF] border border-[#0096FF] hover:bg-blue-50 px-2 py-1 transition-colors whitespace-nowrap"
            title={`Add sheet for ${modelName}`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Sheet</span>
          </button>

          <button onClick={() => setOpen((o) => !o)} className="p-1">
            <ChevronDown
              className={clsx(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-gray-400">
                {sheets.length === 0
                  ? "No pricing sheets yet for this model."
                  : "No results match your search."}
              </p>
              {sheets.length === 0 && (
                <button
                  onClick={() =>
                    onAddSheet({ makeId, makeName, modelId, modelName })
                  }
                  className="flex items-center gap-1.5 text-sm font-medium text-[#0096FF] hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add first sheet
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden sm:grid grid-cols-[150px_1fr_80px_140px_auto] gap-x-4 px-4 py-2 bg-gray-50/70 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <span>Year(s)</span>
                <span>Booking Type</span>
                <span>Duration</span>
                <span>Price</span>
                <span className="text-right">Status / Actions</span>
              </div>
              {filtered.map((sheet) => (
                <SheetRow
                  key={sheet.id}
                  sheet={sheet}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface MakeSectionProps {
  makeId: string;
  makeName: string;
  makeCode: string;
  models: {
    modelId: string;
    modelName: string;
    modelCode: string;
    pricingSheets: PricingSheet[];
  }[];
  bookingTypeOptions: Option[];
  searchQuery: string;
  onEdit: (sheet: PricingSheet) => void;
  onDelete: (sheet: PricingSheet) => void;
  onToggle: (sheet: PricingSheet) => void;
  onAddSheet: (target: CreateTarget) => void;
}

function MakeSection({
  makeId,
  makeName,
  makeCode,
  models,
  bookingTypeOptions,
  searchQuery,
  onEdit,
  onDelete,
  onToggle,
  onAddSheet,
}: MakeSectionProps) {
  const totalSheets = models.reduce(
    (sum, m) => sum + m.pricingSheets.length,
    0,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-9 w-9 bg-[#0096FF] text-white rounded-sm flex-shrink-0">
          <Car className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{makeName}</h3>
          <p className="text-xs text-gray-400">
            {makeCode} · {models.length} model{models.length !== 1 ? "s" : ""} ·{" "}
            {totalSheets} sheet{totalSheets !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="ml-0 sm:ml-12 space-y-2">
        {models.map((model) => (
          <ModelAccordion
            key={model.modelId}
            makeId={makeId}
            makeName={makeName}
            modelId={model.modelId}
            modelName={model.modelName}
            modelCode={model.modelCode}
            sheets={model.pricingSheets}
            bookingTypeOptions={bookingTypeOptions}
            searchQuery={searchQuery}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onAddSheet={onAddSheet}
          />
        ))}
      </div>
    </div>
  );
}

export default function PricingSheets() {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 1000);
  const isDebouncing = searchQuery !== debouncedSearch;

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const [editingSheet, setEditingSheet] = useState<PricingSheet | null>(null);
  const [deletingSheet, setDeletingSheet] = useState<PricingSheet | null>(null);
  const [togglingSheet, setTogglingSheet] = useState<PricingSheet | null>(null);
  const [createTarget, setCreateTarget] = useState<CreateTarget | null>(null);

  const { data, isLoading, isError } = useGetPricingCatalog(
    page,
    debouncedSearch,
  );
  const { data: bookingTypesRaw } = useGetBookingTypes();
  const deleteMutation = useDeletePricingSheet();
  const toggleMutation = useTogglePricingSheetStatus();

  const bookingTypeOptions: Option[] = useMemo(
    () => (bookingTypesRaw ?? []).map((bt) => ({ id: bt.id, name: bt.name })),
    [bookingTypesRaw],
  );

  const catalogContent = data?.content ?? [];

  const handleConfirmDelete = () => {
    if (!deletingSheet) return;
    deleteMutation.mutate(deletingSheet.id, {
      onSuccess: () => setDeletingSheet(null),
    });
  };

  const handleConfirmToggle = () => {
    if (!togglingSheet) return;
    toggleMutation.mutate(
      {
        id: togglingSheet.id,
        isActive: !(togglingSheet.isActive ?? togglingSheet.active),
      },
      { onSuccess: () => setTogglingSheet(null) },
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-3 lg:px-3 py-6 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Pricing Sheets
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage vehicle pricing by make, model, year range, and booking
              type.
            </p>
          </div>
          {data && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 self-start sm:self-auto">
              <DollarSign className="h-4 w-4 text-[#0096FF]" />
              <span className="text-sm font-medium text-gray-700">
                {data.totalItems} vehicle{data.totalItems !== 1 ? "s" : ""}{" "}
                listed
              </span>
            </div>
          )}
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, year, booking type, or price…"
            className="w-full pl-9 pr-10 py-3 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096FF] focus:border-[#0096FF] transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {isDebouncing ? (
              <svg
                className="animate-spin h-4 w-4 text-[#0096FF]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-24">
            <CustomLoader size="md" showText />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
            <p className="text-base font-medium text-gray-700">
              Failed to load pricing catalog.
            </p>
            <p className="text-sm text-gray-400">
              Please check your connection and try again.
            </p>
          </div>
        ) : catalogContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Info className="h-10 w-10 text-gray-300" />
            <p className="text-base font-medium text-gray-600">
              {searchQuery ? "No results found." : "No pricing sheets yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-[#0096FF] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {catalogContent.map((make) => (
              <MakeSection
                key={make.makeId}
                makeId={make.makeId}
                makeName={make.makeName}
                makeCode={make.makeCode}
                models={make.models}
                bookingTypeOptions={bookingTypeOptions}
                searchQuery={debouncedSearch}
                onEdit={setEditingSheet}
                onDelete={setDeletingSheet}
                onToggle={setTogglingSheet}
                onAddSheet={setCreateTarget}
              />
            ))}
          </div>
        )}
        {data && data.totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        )}
      </div>
      {createTarget && (
        <CreateSheetModal
          makeName={createTarget.makeName}
          modelId={createTarget.modelId}
          modelName={createTarget.modelName}
          bookingTypeOptions={bookingTypeOptions}
          onClose={() => setCreateTarget(null)}
        />
      )}
      {editingSheet && (
        <EditSheetModal
          sheet={editingSheet}
          bookingTypeOptions={bookingTypeOptions}
          onClose={() => setEditingSheet(null)}
        />
      )}
      <ConfirmModal
        isOpen={!!deletingSheet}
        variant="danger"
        title="Delete Pricing Sheet"
        message={
          deletingSheet ? (
            <span>
              Permanently delete the{" "}
              <strong>{deletingSheet.bookingTypeName}</strong> sheet for{" "}
              <strong>
                {deletingSheet.vehicleMakeName} {deletingSheet.vehicleModelName}{" "}
                ({deletingSheet.startYear} - {deletingSheet.endYear}
                {deletingSheet.upgradedYear
                  ? ` → ${deletingSheet.upgradedYear}`
                  : ""}
                )
              </strong>
              ? This cannot be undone.
            </span>
          ) : (
            ""
          )
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingSheet(null)}
        isLoading={deleteMutation.isPending}
      />
      <ConfirmModal
        isOpen={!!togglingSheet}
        variant={
          (togglingSheet?.isActive ?? togglingSheet?.active)
            ? "danger"
            : "primary"
        }
        title={
          (togglingSheet?.isActive ?? togglingSheet?.active)
            ? "Deactivate Pricing Sheet"
            : "Activate Pricing Sheet"
        }
        message={
          togglingSheet ? (
            <span>
              Are you sure you want to{" "}
              <strong>
                {(togglingSheet.isActive ?? togglingSheet.active)
                  ? "deactivate"
                  : "activate"}
              </strong>{" "}
              the <strong>{togglingSheet.bookingTypeName}</strong> sheet for{" "}
              <strong>
                {togglingSheet.vehicleMakeName} {togglingSheet.vehicleModelName}
              </strong>
              ?
            </span>
          ) : (
            ""
          )
        }
        confirmLabel={
          (togglingSheet?.isActive ?? togglingSheet?.active)
            ? "Deactivate"
            : "Activate"
        }
        cancelLabel="Cancel"
        onConfirm={handleConfirmToggle}
        onCancel={() => setTogglingSheet(null)}
        isLoading={toggleMutation.isPending}
      />
    </div>
  );
}

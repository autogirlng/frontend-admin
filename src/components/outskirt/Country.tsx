"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCountryManager } from "./useCountryManager";
import { parseWktToLatLngRings } from "./geo";
import type { ExistingPolygon } from "./BoundaryMap";
import {
  Loader2,
  Pencil,
  Trash2,
  Plus,
  Globe,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  MapPin,
} from "lucide-react";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import clsx from "clsx";

const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
];

export default function Country() {
  const router = useRouter();

  const {
    countries,
    isLoading,
    error,
    mode,
    editingCountry,
    handleCreateMode,
    handleEditMode,
    handleBackToList,
    form,
    handleFieldChange,
    drawnCoordinates,
    existingBoundaryRings,
    handleShapeCreated,
    handleSubmit,
    isSaving,
    handleDelete,
    isDeleting,
  } = useCountryManager();

  const [flyToLocation, setFlyToLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const BoundaryMapNoSSR = useMemo(
    () =>
      dynamic(() => import("./BoundaryMap"), {
        ssr: false,
        loading: () => (
          <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400 text-sm gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading map…
          </div>
        ),
      }),
    [],
  );

  if (isLoading) return <CustomLoader />;

  if (mode === "create" || mode === "edit") {
    const otherCountries: ExistingPolygon[] = countries
      .filter((c) => c.id !== editingCountry?.id && c.polygon)
      .map((c) => ({
        id: c.id,
        name: c.name,
        sublabel: c.shortname,
        color: "#94a3b8",
        rings: parseWktToLatLngRings(c.polygon),
      }));

    const hasRedrawn = drawnCoordinates.length > 0;
    const hasSavedBoundary = existingBoundaryRings.length > 0;

    const statusBanner = hasRedrawn
      ? {
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="h-4 w-4 shrink-0" />,
          text: `✓ New boundary drawn (${drawnCoordinates.length} pts) — ready to save.`,
        }
      : mode === "edit" && hasSavedBoundary
        ? {
            cls: "bg-amber-50 text-amber-700 border-amber-200",
            icon: <Pencil className="h-4 w-4 shrink-0" />,
            text: "Existing boundary loaded. Redraw to replace or update fields only.",
          }
        : {
            cls: "bg-blue-50 text-blue-700 border-blue-200",
            icon: <Globe className="h-4 w-4 shrink-0" />,
            text: "Draw the country boundary using the polygon tool →",
          };

    return (
      <div className="relative h-screen w-full overflow-hidden bg-slate-50">
        <ToastContainer />

        <div className="absolute inset-0">
          <BoundaryMapNoSSR
            currentShapeRings={mode === "edit" ? existingBoundaryRings : []}
            currentShapeLabel={editingCountry?.name}
            existingPolygons={otherCountries}
            onShapeCreated={handleShapeCreated}
            drawingColor="#16a34a"
            defaultCenter={[9.082, 8.6753]}
            defaultZoom={4}
            flyToLocation={flyToLocation}
            key={mode + (editingCountry?.id ?? "")}
          />
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 flex items-center gap-2.5 whitespace-nowrap">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            {mode === "edit" && hasSavedBoundary && !hasRedrawn
              ? `Editing ${editingCountry?.name} — redraw to replace`
              : "Draw country boundary using the polygon tool"}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] pointer-events-none flex flex-wrap gap-2 justify-center">
          {mode === "edit" && hasSavedBoundary && (
            <LegendPill
              color="#16a34a"
              label={`${editingCountry?.name} — current`}
              pulse
            />
          )}
          {hasRedrawn && (
            <LegendPill color="#16a34a" label="New boundary (replaces saved)" />
          )}
          {otherCountries.length > 0 && (
            <LegendPill color="#94a3b8" label="Other countries" />
          )}
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className={clsx(
            "absolute top-4 right-4 z-[550] flex items-center gap-2 px-4 py-2.5",
            "bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg",
            "text-sm font-medium text-slate-700 hover:bg-slate-50",
            "transition-all active:scale-95",
            showForm &&
              "bg-blue-600 text-black hover:bg-blue-700 shadow-blue-200/50",
          )}
        >
          {showForm ? (
            <>
              <XCircle className="h-4 w-4" /> Close Form
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" /> Edit Details
            </>
          )}
        </button>

        <div
          className={clsx(
            "absolute top-0 bottom-0 right-0 z-[520] w-full max-w-md",
            "bg-white border-l border-slate-200 shadow-2xl",
            "transition-transform duration-300 ease-in-out",
            showForm ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="h-full flex flex-col overflow-hidden">
            <div className="shrink-0 border-b border-slate-100 px-5 py-4 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm">
              <div>
                <h2 className="font-semibold text-slate-800">
                  {mode === "create"
                    ? "New Country"
                    : `Edit ${editingCountry?.name}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define country details
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-800"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="space-y-5">
                <div
                  className={clsx(
                    "flex items-start gap-2.5 p-3.5 text-sm border",
                    statusBanner.cls,
                  )}
                >
                  {statusBanner.icon}
                  <span>{statusBanner.text}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <FormField label="Country Name *" hint="e.g. Nigeria">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      placeholder="Nigeria"
                      className={inputCls}
                      required
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Short Name *" hint="ISO 2-letter">
                      <input
                        value={form.shortname}
                        onChange={(e) =>
                          handleFieldChange(
                            "shortname",
                            e.target.value.toUpperCase(),
                          )
                        }
                        placeholder="NG"
                        maxLength={3}
                        className={inputCls}
                        required
                      />
                    </FormField>
                    <FormField label="Dial Code *" hint="e.g. +234">
                      <input
                        value={form.country_code}
                        onChange={(e) =>
                          handleFieldChange("country_code", e.target.value)
                        }
                        placeholder="+234"
                        className={inputCls}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Continent *">
                    <div className="relative">
                      <select
                        value={form.continent}
                        onChange={(e) =>
                          handleFieldChange("continent", e.target.value)
                        }
                        className={clsx(inputCls, "appearance-none pr-8")}
                        required
                      >
                        <option value="">— Select continent —</option>
                        {CONTINENTS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Currency Name *" hint="e.g. Naira">
                      <input
                        value={form.currencyName}
                        onChange={(e) =>
                          handleFieldChange("currencyName", e.target.value)
                        }
                        placeholder="Naira"
                        className={inputCls}
                        required
                      />
                    </FormField>
                    <FormField label="Currency Symbol *" hint="e.g. ₦">
                      <input
                        value={form.currencySymbol}
                        onChange={(e) =>
                          handleFieldChange("currencySymbol", e.target.value)
                        }
                        placeholder="₦"
                        className={inputCls}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-slate-700">
                      Active
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleFieldChange("isActive", !form.isActive)
                      }
                      className={clsx(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        form.isActive ? "bg-blue-600" : "bg-slate-200",
                      )}
                    >
                      <span
                        className={clsx(
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                          form.isActive ? "translate-x-5" : "translate-x-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        handleBackToList();
                      }}
                      className="flex-1 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Cancel / Go Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSaving
                        ? "Saving…"
                        : mode === "edit"
                          ? "Save Changes"
                          : "Create Country"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-[510] md:hidden"
            onClick={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="max-w-8xl mx-auto py-2">
        <div className="mb-2">
          <CustomBack />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" /> Countries
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {countries.length}{" "}
              {countries.length === 1 ? "country" : "countries"} registered
            </p>
          </div>
          <button
            onClick={handleCreateMode}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Country
          </button>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          {countries.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No countries yet. Add your first one.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Country
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                    Code
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                    Continent
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                    Currency
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {countries.map((country) => (
                  <tr
                    key={country.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/outskirts/state?countryId=${country.id}`,
                      )
                    }
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {country.name}
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="text-xs text-slate-400">
                        {country.country_code}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono font-bold rounded">
                        {country.shortname}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-slate-600">
                      {country.continent}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-600">
                      {country.currencySymbol} {country.currencyName}
                    </td>
                    <td className="px-4 py-3.5">
                      {country.active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center text-black gap-1 justify-end ">
                        <button
                          onClick={() => handleEditMode(country)}
                          className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(country.id)}
                          disabled={isDeleting}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center flex items-center justify-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Click a country row to manage its states and geofence areas
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "block w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-300";

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-600">{label}</label>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function LegendPill({
  color,
  label,
  pulse = false,
}: {
  color: string;
  label: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 shadow px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-600">
      <span
        className={clsx(
          "h-2.5 w-2.5 rounded-full shrink-0",
          pulse && "animate-pulse",
        )}
        style={{ background: color }}
      />
      {label}
    </div>
  );
}

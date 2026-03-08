"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateManager } from "./useStateManager";
import { parseWktToLatLngRings } from "./geo";
import type { ExistingPolygon } from "./BoundaryMap";
import {
  Loader2,
  Pencil,
  Trash2,
  Plus,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Globe,
  ChevronRight,
  Layers,
} from "lucide-react";
import CustomLoader from "@/components/generic/CustomLoader";
import clsx from "clsx";

export default function State() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    countries,
    isLoadingCountries,
    selectedCountryId,
    selectedCountry,
    handleCountrySelect,
    states,
    isLoadingStates,
    error,
    mode,
    editingState,
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
  } = useStateManager();

  const [flyToLocation, setFlyToLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const countryId = searchParams.get("countryId");
    if (countryId && countryId !== selectedCountryId) {
      handleCountrySelect(countryId);
    }
  }, []);

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

  if (isLoadingCountries) return <CustomLoader />;

  const countryBoundaryRings = selectedCountry?.polygon
    ? parseWktToLatLngRings(selectedCountry.polygon)
    : [];

  if (mode === "create" || mode === "edit") {
    const siblingStates: ExistingPolygon[] = states
      .filter((s) => s.id !== editingState?.id && s.polygon)
      .map((s) => ({
        id: s.id,
        name: s.name,
        sublabel: s.stateCode,
        color: "#94a3b8",
        rings: parseWktToLatLngRings(s.polygon),
      }));

    const hasRedrawn = drawnCoordinates.length > 0;
    const hasSavedBoundary = existingBoundaryRings.length > 0;

    const statusBanner = hasRedrawn
      ? {
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />,
          text: `✓ New boundary drawn (${drawnCoordinates.length} pts) — save when ready.`,
        }
      : mode === "edit" && hasSavedBoundary
        ? {
            cls: "bg-amber-50 text-amber-700 border-amber-200",
            icon: <Pencil className="h-3.5 w-3.5 shrink-0" />,
            text: "Existing boundary shown on map. Draw a new polygon to replace it, or just update the fields.",
          }
        : {
            cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
            icon: <MapPin className="h-3.5 w-3.5 shrink-0" />,
            text: "Draw the state boundary within the country outline on the map →",
          };

    return (
      <div className="relative h-screen w-full overflow-hidden bg-slate-50">
        <ToastContainer />

        <div className="absolute inset-0">
          <BoundaryMapNoSSR
            boundaryRings={countryBoundaryRings}
            boundaryLabel={selectedCountry?.name}
            boundaryColor="#2563eb"
            currentShapeRings={mode === "edit" ? existingBoundaryRings : []}
            currentShapeLabel={editingState?.name}
            existingPolygons={siblingStates}
            onShapeCreated={handleShapeCreated}
            drawingColor="#4f46e5"
            flyToLocation={flyToLocation}
            key={mode + (editingState?.id ?? "") + selectedCountryId}
          />
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 flex items-center gap-2.5 whitespace-nowrap">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
            {mode === "edit" && hasSavedBoundary && !hasRedrawn
              ? `Editing ${editingState?.name} — draw to replace`
              : "Draw state boundary inside the country outline"}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] pointer-events-none flex flex-wrap gap-2 justify-center">
          {countryBoundaryRings.length > 0 && (
            <LegendPill
              color="#2563eb"
              label={`${selectedCountry?.name} boundary`}
              dashed
            />
          )}
          {mode === "edit" && hasSavedBoundary && (
            <LegendPill
              color="#4f46e5"
              label={`${editingState?.name} — current`}
              pulse
            />
          )}
          {hasRedrawn && (
            <LegendPill color="#4f46e5" label="New boundary (replaces saved)" />
          )}
          {siblingStates.length > 0 && (
            <LegendPill color="#94a3b8" label="Other states" />
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
              "bg-indigo-600 text-black hover:bg-indigo-700 shadow-indigo-200/50",
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
                    ? "New State"
                    : `Edit ${editingState?.name}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCountry?.name}
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

                {countryBoundaryRings.length > 0 && (
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <div className="h-3 w-8 rounded border-2 border-dashed border-blue-500 bg-blue-50/40" />
                    Country boundary (draw inside this)
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <FormField label="State Name *" hint="e.g. Lagos">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      placeholder="Lagos"
                      className={inputCls}
                      required
                    />
                  </FormField>

                  <FormField label="State Code *" hint="e.g. LA">
                    <input
                      value={form.stateCode}
                      onChange={(e) =>
                        handleFieldChange(
                          "stateCode",
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder="LA"
                      maxLength={5}
                      className={inputCls}
                      required
                    />
                  </FormField>

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
                        form.isActive ? "bg-indigo-600" : "bg-slate-200",
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
                      className="flex-1 py-3 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSaving
                        ? "Saving…"
                        : mode === "edit"
                          ? "Save Changes"
                          : "Create State"}
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
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <button
            onClick={() => router.push("/dashboard/outskirts/country")}
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <Globe className="h-3.5 w-3.5" /> Countries
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-indigo-500" />
            {selectedCountry ? selectedCountry.name : "States"}
          </span>
          {selectedCountry && (
            <>
              <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              <span className="opacity-40 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> Geofence Areas
              </span>
            </>
          )}
        </nav>

        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-indigo-600" />
              {selectedCountry ? `${selectedCountry.name} — States` : "States"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {selectedCountry
                ? `${states.length} state${states.length !== 1 ? "s" : ""} registered`
                : "Select a country to view its states"}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select
                value={selectedCountryId ?? ""}
                onChange={(e) => {
                  handleCountrySelect(e.target.value);
                  router.push(
                    `/dashboard/outskirts/state?countryId=${e.target.value}`,
                    { scroll: false },
                  );
                }}
                className="appearance-none pl-4 pr-8 py-2.5 text-sm border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 min-w-[180px]"
              >
                <option value="">— Switch country —</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            <button
              onClick={handleCreateMode}
              disabled={!selectedCountryId}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add State
            </button>
          </div>
        </div>

        {selectedCountry && (
          <div className="mb-4 px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-sm text-indigo-700 flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0" />
            Showing states for <strong>{selectedCountry.name}</strong>
            <span className="ml-auto text-xs text-indigo-400 font-mono">
              {selectedCountry.shortname}
            </span>
          </div>
        )}

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          {!selectedCountryId ? (
            <div className="py-20 text-center text-slate-400">
              <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a country to view its states.</p>
            </div>
          ) : isLoadingStates ? (
            <div className="py-16 flex items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading states…
            </div>
          ) : states.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                No states yet for {selectedCountry?.name}.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    State
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Code
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                    Country
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
                {states.map((state) => (
                  <tr
                    key={state.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/outskirts?stateId=${state.id}&countryId=${selectedCountryId}`,
                      )
                    }
                    className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {state.name}
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <div className="text-xs text-slate-400">
                        {state.country.name}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono font-bold rounded">
                        {state.stateCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-slate-500 text-xs">
                      {state.country.name}
                    </td>
                    <td className="px-4 py-3.5">
                      {state.active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleEditMode(state)}
                          className="p-1.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(state.id)}
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
          <Layers className="h-3.5 w-3.5" />
          Click a state row to manage its geofence areas
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "block w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-slate-300";

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
  dashed = false,
}: {
  color: string;
  label: string;
  pulse?: boolean;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 shadow px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-600">
      <span
        className={clsx("h-2.5 w-4 rounded shrink-0", pulse && "animate-pulse")}
        style={{
          background: dashed ? "transparent" : color,
          border: `2px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      {label}
    </div>
  );
}

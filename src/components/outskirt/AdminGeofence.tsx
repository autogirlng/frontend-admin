"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGeofenceManager } from "@/lib/hooks/outskirt/useGeofenceManager";
import { parseWktToLatLngRings } from "./geo";
import type { AreaType } from "./geo";
import type { ExistingPolygon } from "./BoundaryMap";
import {
  Loader2,
  Trash2,
  X,
  Layers,
  ChevronRight,
  ChevronDown,
  Globe,
  MapPin,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import CustomLoader from "@/components/generic/CustomLoader";
import AddressInput from "@/components/generic/ui/AddressInput";
import clsx from "clsx";

const AREA_CONFIG: Record<
  AreaType,
  { label: string; color: string; badgeCls: string; activeCls: string }
> = {
  OUTSKIRT: {
    label: "Outskirt",
    color: "#f97316",
    badgeCls: "bg-orange-50 text-orange-600 border-orange-100",
    activeCls:
      "bg-orange-50 border-orange-300 text-orange-700 ring-1 ring-orange-200",
  },
  EXTREME: {
    label: "Extreme",
    color: "#ef4444",
    badgeCls: "bg-red-50 text-red-600 border-red-100",
    activeCls: "bg-red-50 border-red-300 text-red-700 ring-1 ring-red-200",
  },
  NO_GO_AREA: {
    label: "No-Go Zone",
    color: "#7c3aed",
    badgeCls: "bg-purple-50 text-purple-600 border-purple-100",
    activeCls:
      "bg-purple-50 border-purple-300 text-purple-700 ring-1 ring-purple-200",
  },
};

export default function AdminGeofence() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    countries,
    states,
    areas,
    selectedCountryId,
    selectedStateId,
    selectedCountry,
    selectedState,
    handleCountrySelect,
    handleStateSelect,
    isLoadingCountries,
    isLoadingStates,
    isLoadingAreas,
    isLoading,
    newName,
    setNewName,
    newAreaType,
    setNewAreaType,
    newCoordinates,
    handleShapeCreated,
    handleSaveArea,
    isSaving,
    handleDeleteArea,
    isDeleting,
  } = useGeofenceManager();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchAddress, setSearchAddress] = useState("");
  const [flyToLocation, setFlyToLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const countryId = searchParams.get("countryId");
    const stateId = searchParams.get("stateId");
    if (countryId && countryId !== selectedCountryId)
      handleCountrySelect(countryId);
    if (stateId && stateId !== selectedStateId) handleStateSelect(stateId);
  }, []);

  useEffect(() => {
    if (selectedState?.polygon) {
      const rings = parseWktToLatLngRings(selectedState.polygon);
      if (rings[0]?.[0])
        setFlyToLocation({ lat: rings[0][0][0], lng: rings[0][0][1] });
    }
  }, [selectedState]);

  const BoundaryMapNoSSR = useMemo(
    () =>
      dynamic(() => import("./BoundaryMap"), {
        ssr: false,
        loading: () => (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 animate-pulse gap-2 flex-col">
            <Layers className="h-8 w-8 opacity-40" />
            <span className="text-sm">Loading map…</span>
          </div>
        ),
      }),
    [],
  );

  if (isLoading) return <CustomLoader />;

  const stateBoundaryRings = selectedState?.polygon
    ? parseWktToLatLngRings(selectedState.polygon)
    : [];

  const existingAreaPolygons: ExistingPolygon[] = areas
    .filter((a) => a.coordinates?.length > 0)
    .map((a) => ({
      id: a.id,
      name: a.name,
      sublabel: AREA_CONFIG[a.areaType]?.label ?? a.areaType,
      color: AREA_CONFIG[a.areaType]?.color ?? "#3b82f6",
      rings: [
        a.coordinates.map((c) => [c.latitude, c.longitude] as [number, number]),
      ],
    }));

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100">
      <ToastContainer />

      <div className="absolute inset-0 z-0">
        <BoundaryMapNoSSR
          boundaryRings={stateBoundaryRings}
          boundaryLabel={
            selectedState ? `${selectedState.name} boundary` : undefined
          }
          boundaryColor="#4f46e5"
          existingPolygons={existingAreaPolygons}
          onShapeCreated={(latlngs) => {
            handleShapeCreated(latlngs);
            if (!isSidebarOpen) setIsSidebarOpen(true);
          }}
          flyToLocation={flyToLocation}
          drawingColor="#16a34a"
          defaultCenter={[9.082, 8.6753]}
          defaultZoom={6}
          key={selectedStateId ?? "no-state"}
        />
      </div>

      <div
        className={clsx(
          "fixed inset-0 bg-black/30 z-20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={clsx(
          "fixed top-0 right-0 h-full z-40 bg-white shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "w-full md:w-[420px]",
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Geofence Manager
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedState
                ? `Drawing within ${selectedState.name}, ${selectedCountry?.name}`
                : "Select a country & state to begin"}
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-400 transition-colors md:hidden mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="px-5 py-2.5 bg-blue-600 flex items-center gap-1.5 text-white text-[11px] font-medium shrink-0 overflow-x-auto">
          <button
            onClick={() => router.push("/dashboard/outskirts/country")}
            className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            <Globe className="h-3 w-3 shrink-0" />
            Countries
          </button>
          <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />
          <button
            onClick={() =>
              selectedCountryId &&
              router.push(
                `/dashboard/outskirts/state?countryId=${selectedCountryId}`,
              )
            }
            className={clsx(
              "flex items-center gap-1 transition-opacity whitespace-nowrap",
              selectedCountry
                ? "opacity-80 hover:opacity-100 cursor-pointer"
                : "opacity-40 cursor-default",
            )}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            {selectedCountry?.name ?? "States"}
          </button>
          <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />
          <span
            className={clsx(
              "flex items-center gap-1 whitespace-nowrap",
              selectedState ? "opacity-100" : "opacity-40",
            )}
          >
            <Layers className="h-3 w-3 shrink-0" />
            {selectedState?.name ?? "Geofence Areas"}
          </span>
        </nav>

        {selectedState && stateBoundaryRings.length > 0 && (
          <div className="px-5 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2 text-[11px] text-indigo-600 shrink-0">
            <span className="inline-block h-2.5 w-5 rounded border-2 border-dashed border-indigo-400 bg-indigo-50 shrink-0" />
            Dashed outline ={" "}
            <strong className="ml-0.5">{selectedState.name}</strong> boundary
            guide
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section>
            <StepLabel
              step={1}
              label="Select Country"
              done={!!selectedCountryId}
            />
            <div className="relative mt-2">
              <select
                value={selectedCountryId ?? ""}
                onChange={(e) => {
                  handleCountrySelect(e.target.value);
                  router.push(
                    `/dashboard/outskirts?countryId=${e.target.value}`,
                    { scroll: false },
                  );
                }}
                disabled={isLoadingCountries}
                className={selectCls(!!selectedCountryId)}
              >
                <option value="">
                  {isLoadingCountries ? "Loading…" : "— Choose a country —"}
                </option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shortname})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </section>

          <section>
            <StepLabel
              step={2}
              label="Select State"
              done={!!selectedStateId}
              disabled={!selectedCountryId}
            />
            <div className="relative mt-2">
              <select
                value={selectedStateId ?? ""}
                onChange={(e) => {
                  handleStateSelect(e.target.value);
                  router.push(
                    `/dashboard/outskirts?countryId=${selectedCountryId}&stateId=${e.target.value}`,
                    { scroll: false },
                  );
                }}
                disabled={!selectedCountryId || isLoadingStates}
                className={clsx(
                  selectCls(!!selectedStateId),
                  !selectedCountryId && "opacity-40 cursor-not-allowed",
                )}
              >
                <option value="">
                  {!selectedCountryId
                    ? "Select country first"
                    : isLoadingStates
                      ? "Loading…"
                      : states.length === 0
                        ? "No states found"
                        : "— Choose a state —"}
                </option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.stateCode})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </section>

          <hr className="border-slate-100" />

          <section
            className={clsx(
              !selectedStateId && "opacity-40 pointer-events-none",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Navigate Map
              </span>
            </div>
            <AddressInput
              label=""
              id="geofence-search"
              placeholder="Search a location…"
              value={searchAddress}
              onChange={setSearchAddress}
              onLocationSelect={(coords) => {
                setFlyToLocation({
                  lat: coords.latitude,
                  lng: coords.longitude,
                });
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className="w-full"
            />
          </section>

          <hr className="border-slate-100" />

          <section>
            <StepLabel
              step={3}
              label="Create Geofence Area"
              done={false}
              disabled={!selectedStateId}
            />
            <form
              onSubmit={handleSaveArea}
              className={clsx(
                "mt-3 space-y-4",
                !selectedStateId && "opacity-40 pointer-events-none",
              )}
            >
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Area Name
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Victoria Island Zone A"
                  className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Area Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(AREA_CONFIG) as AreaType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAreaType(type)}
                      className={clsx(
                        "py-2 px-1.5 text-xs font-medium border transition-all text-center leading-tight",
                        newAreaType === type
                          ? AREA_CONFIG[type].activeCls
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                      )}
                    >
                      {AREA_CONFIG[type].label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={clsx(
                  "px-3 py-2.5 text-xs leading-relaxed border rounded",
                  newCoordinates.length > 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-100",
                )}
              >
                {newCoordinates.length > 0
                  ? `✓ ${newCoordinates.length} boundary points plotted. Ready to save.`
                  : "Use the ✏️ polygon tool (top-left of map) to draw the area shape."}
              </div>

              <button
                type="submit"
                disabled={isSaving || !selectedStateId}
                className="w-full bg-slate-900 text-white py-3 text-sm font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving…" : "Save Geofence Area"}
              </button>
            </form>
          </section>

          <hr className="border-slate-100" />

          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-0.5 bg-slate-300 rounded-full" />
              <h3 className="text-sm font-semibold text-slate-700">
                Saved Areas{selectedState ? ` · ${selectedState.name}` : ""}
              </h3>
              <span className="ml-auto text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {areas.length}
              </span>
            </div>

            {!selectedStateId ? (
              <p className="text-center py-8 text-slate-400 text-xs italic">
                Select a state to view its geofence areas.
              </p>
            ) : isLoadingAreas ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
              </div>
            ) : (
              <ul className="space-y-2 pb-10">
                {areas.length === 0 && (
                  <li className="text-center py-8 text-slate-400 text-xs italic">
                    No areas created for this state yet.
                  </li>
                )}
                {areas.map((area) => (
                  <li
                    key={area.id}
                    className="group flex items-center gap-3 p-3 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{
                        background:
                          AREA_CONFIG[area.areaType]?.color ?? "#94a3b8",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {area.name}
                      </p>
                      <span
                        className={clsx(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium border mt-0.5 inline-block",
                          AREA_CONFIG[area.areaType]?.badgeCls ??
                            "bg-slate-50 text-slate-500 border-slate-100",
                        )}
                      >
                        {AREA_CONFIG[area.areaType]?.label ?? area.areaType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (area.coordinates.length > 0) {
                            setFlyToLocation({
                              lat: area.coordinates[0].latitude,
                              lng: area.coordinates[0].longitude,
                            });
                            if (window.innerWidth < 768)
                              setIsSidebarOpen(false);
                          }
                        }}
                        className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Zoom to area"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete area"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={clsx(
          "absolute top-4 right-4 z-30 flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-300 shadow-md",
          isSidebarOpen
            ? "bg-white text-slate-600 hover:bg-slate-50 md:mr-[420px]"
            : "bg-blue-600 text-white hover:bg-blue-700",
        )}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isSidebarOpen ? "Close" : "Manage Areas"}
        </span>
      </button>
    </div>
  );
}

function StepLabel({
  step,
  label,
  done,
  disabled = false,
}: {
  step: number;
  label: string;
  done: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={clsx("flex items-center gap-2", disabled && "opacity-40")}>
      <span
        className={clsx(
          "h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors",
          done ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500",
        )}
      >
        {done ? "✓" : step}
      </span>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  );
}

function selectCls(active: boolean) {
  return clsx(
    "w-full appearance-none px-4 py-2.5 pr-10 text-sm border bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition",
    active ? "border-blue-300" : "border-slate-300",
  );
}

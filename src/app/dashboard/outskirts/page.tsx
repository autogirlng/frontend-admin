"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGeofenceManager } from "@/lib/hooks/outskirt/useGeofenceManager";
import {
  Loader2,
  Trash2,
  Menu,
  X,
  Map as MapIcon,
  Layers,
  ChevronRight,
} from "lucide-react";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import AddressInput from "@/components/generic/ui/AddressInput";
import clsx from "clsx";

export default function AdminGeofencePage() {
  const {
    areas,
    isLoading,
    error,
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

  const AdminMapWithNoSSR = useMemo(
    () =>
      dynamic(() => import("@/components/outskirt/Outskirt"), {
        ssr: false,
        loading: () => (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500 animate-pulse">
            <MapIcon className="h-10 w-10 mb-2 opacity-50" />
            <span className="text-sm font-medium">Loading Map...</span>
          </div>
        ),
      }),
    []
  );

  if (error) {
    toast.error(`Error: ${error.message}`);
    return <div className="p-4 text-red-500">Failed to load system.</div>;
  }

  if (isLoading) return <CustomLoader />;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100 flex flex-col">
      <ToastContainer />

      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/20 backdrop-blur-sm px-4 py-1 border border-gray-200">
          <CustomBack />
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={clsx(
          "absolute top-4 right-4 z-30 flex items-center gap-2 px-4 py-3 transition-all duration-300 transform hover:scale-105 active:scale-95",
          isSidebarOpen
            ? "bg-red-50 text-red-600 md:mr-[400px]"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Layers className="h-5 w-5" />
        )}
        <span className="hidden sm:inline font-medium">
          {isSidebarOpen ? "Close Controls" : "Manage Areas"}
        </span>
      </button>

      <div className="absolute inset-0 z-0 h-full w-full">
        <AdminMapWithNoSSR
          areas={areas}
          onShapeCreated={(coords) => {
            handleShapeCreated(coords);
            if (!isSidebarOpen) setIsSidebarOpen(true);
          }}
          key={newCoordinates.length}
          flyToLocation={flyToLocation}
        />
      </div>

      <div
        className={clsx(
          "fixed inset-0 bg-black/30 z-20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={clsx(
          "fixed top-0 right-0 h-full z-40 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          "w-full md:w-[400px]",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Geofence Manager
            </h2>
            <p className="text-xs text-gray-500">
              Create & manage Outskirt and Extreme Areas!
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="bg-blue-50/50 p-4 border border-blue-100">
            <label className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2 block">
              Navigate Map
            </label>
            <AddressInput
              label=""
              id="drawer-search"
              placeholder="Search location (e.g., Lekki Phase 1)"
              value={searchAddress}
              onChange={setSearchAddress}
              onLocationSelect={(coords) => {
                setFlyToLocation({
                  lat: coords.latitude,
                  lng: coords.longitude,
                });
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className="w-full bg-white border-transparent shadow-sm focus:ring-blue-500"
            />
          </div>

          <hr className="border-gray-100" />

          <form onSubmit={handleSaveArea} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1 bg-blue-600 rounded-full" />
              <h3 className="text-lg font-semibold text-gray-800">New Area</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`block w-full px-4 py-[15px] text-gray-900 bg-white border
                     focus:outline-none focus:ring-1
                     transition duration-150 ease-in-out sm:text-sm border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF] className`}
                  placeholder="e.g. Victoria Island Zone A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewAreaType("OUTSKIRT")}
                    className={clsx(
                      "py-2 px-3 text-sm font-medium border transition-all",
                      newAreaType === "OUTSKIRT"
                        ? "bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    Outskirt
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAreaType("EXTREME")}
                    className={clsx(
                      "py-2 px-3 text-sm font-medium border transition-all",
                      newAreaType === "EXTREME"
                        ? "bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    Extreme
                  </button>
                </div>
              </div>

              <div
                className={clsx(
                  "p-3 text-xs leading-relaxed border",
                  newCoordinates.length > 0
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-100"
                )}
              >
                {newCoordinates.length > 0
                  ? `✓ ${newCoordinates.length} points plotted. Ready to save.`
                  : "ℹ️ Use the drawing tool (top-left of map) to draw a polygon shape."}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gray-900 text-white py-3 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.98]"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Area"}
              </button>
            </div>
          </form>

          <hr className="border-gray-100" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-1 bg-gray-300 rounded-full" />
              <h3 className="text-lg font-semibold text-gray-800">
                Saved Areas
              </h3>
              <span className="ml-auto text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {areas.length}
              </span>
            </div>

            <ul className="space-y-2 pb-10">
              {areas.length === 0 && (
                <li className="text-center py-8 text-gray-400 text-sm italic">
                  No areas created yet.
                </li>
              )}
              {areas.map((area) => (
                <li
                  key={area.id}
                  className="group flex justify-between items-center p-3 bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {area.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={clsx(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide",
                          area.areaType === "EXTREME"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-orange-50 text-orange-600 border border-orange-100"
                        )}
                      >
                        {area.areaType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (area.coordinates.length > 0) {
                          setFlyToLocation({
                            lat: area.coordinates[0].latitude,
                            lng: area.coordinates[0].longitude,
                          });
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View on map"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArea(area.id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete area"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

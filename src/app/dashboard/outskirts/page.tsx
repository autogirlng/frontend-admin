"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGeofenceManager } from "@/lib/hooks/outskirt/useGeofenceManager";
import { Loader2, Trash2 } from "lucide-react";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

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

  // Dynamically import the map component
  const AdminMapWithNoSSR = useMemo(
    () =>
      dynamic(() => import("@/components/outskirt/Outskirt"), {
        // Adjust path if needed
        ssr: false,
        loading: () => (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            Loading Map...
          </div>
        ),
      }),
    []
  );

  if (error) {
    toast.error(`Failed to load areas: ${error.message}`);
    return <div className="p-4 text-red-500">Failed to load areas</div>;
  }

  // Show a full-page loader while fetching initial data
  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <>
      <CustomBack />
      <div className="flex flex-col h-screen pt-2 pb-4">
        <ToastContainer />

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Manage Geofenced Areas
        </h1>
        <div
          className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ minHeight: "80vh" }}
        >
          <div className="md:col-span-2 rounded-lg shadow-lg overflow-hidden">
            <AdminMapWithNoSSR
              areas={areas}
              onShapeCreated={handleShapeCreated}
              key={newCoordinates.length}
            />
          </div>

          <div className="flex flex-col gap-6" style={{ maxHeight: "80vh" }}>
            {/* Create New Area Form */}
            <form
              onSubmit={handleSaveArea}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Create New Area</h2>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Area Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 py-3 px-2 block w-full border-1 border-black focus:outline-none sm:text-sm"
                  placeholder="e.g., Lekki Phase 1 Outskirts"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="areaType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Area Type
                </label>
                <select
                  id="areaType"
                  value={newAreaType}
                  onChange={(e) =>
                    setNewAreaType(e.target.value as "OUTSKIRT" | "EXTREME")
                  }
                  className="mt-1 py-3 px-2 block w-full border-1 border-black focus:outline-none sm:text-sm"
                >
                  <option value="OUTSKIRT">OUTSKIRT</option>
                  <option value="EXTREME">EXTREME</option>
                </select>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {newCoordinates.length > 0
                  ? `${newCoordinates.length} points selected. Ready to save.`
                  : "Use the drawing tool on the map to define an area."}
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Geofenced Area"}
              </button>
            </form>

            {/* List of Existing Areas */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex-grow overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Existing Areas</h2>
              <ul className="space-y-3">
                {areas.map((area) => (
                  <li
                    key={area.id}
                    className="flex justify-between items-center p-2 border"
                  >
                    <div>
                      <p className="font-medium">{area.name}</p>
                      <p className="text-sm text-gray-500">{area.areaType}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteArea(area.id)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                      title="Delete area"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

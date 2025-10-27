// lib/hooks/admin/useGeofenceManager.ts
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"; // Using react-toastify as in our other hooks
import { apiClient } from "@/lib/apiClient";

// --- Type Definitions ---

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type GeofenceArea = {
  id: string;
  name: string;
  areaType: "OUTSKIRT" | "EXTREME";
  coordinates: Coordinate[];
};

type NewGeofencePayload = {
  name: string;
  areaType: "OUTSKIRT" | "EXTREME";
  coordinates: Coordinate[];
};

// --- The Hook ---

export function useGeofenceManager() {
  const queryClient = useQueryClient();

  // Form State
  const [newName, setNewName] = useState("");
  const [newAreaType, setNewAreaType] = useState<"OUTSKIRT" | "EXTREME">(
    "OUTSKIRT"
  );
  const [newCoordinates, setNewCoordinates] = useState<Coordinate[]>([]);

  // --- Data Fetching ---
  const {
    data: areas,
    isLoading,
    error,
  } = useQuery<GeofenceArea[]>({
    queryKey: ["geofenceAreas"],
    queryFn: () => apiClient.get<GeofenceArea[]>("/geofence-areas"),
  });

  // --- Mutations ---

  // Create Area
  const { mutate: createArea, isPending: isSaving } = useMutation({
    mutationFn: (payload: NewGeofencePayload) => {
      return apiClient.post<GeofenceArea>("/geofence-areas", payload);
    },
    onSuccess: () => {
      toast.success("Geofenced area created successfully!");
      queryClient.invalidateQueries({ queryKey: ["geofenceAreas"] });
      // Reset form
      setNewName("");
      setNewAreaType("OUTSKIRT");
      setNewCoordinates([]);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create area.");
    },
  });

  // Delete Area
  const { mutate: deleteArea, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete(`/geofence-areas/${id}`);
    },
    onSuccess: () => {
      toast.success("Area deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["geofenceAreas"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete area.");
    },
  });

  // --- Handlers ---

  const handleShapeCreated = (coords: [number, number][]) => {
    // Convert [lat, lng] to { latitude, longitude }
    const formattedCoords: Coordinate[] = coords.map((c) => ({
      latitude: c[0],
      longitude: c[1],
    }));
    setNewCoordinates(formattedCoords);
    toast.success("Shape drawn! Add a name and type, then save.");
  };

  const handleSaveArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newCoordinates.length < 3) {
      toast.error(
        "Please draw a shape (at least 3 points) and provide a name."
      );
      return;
    }

    const payload: NewGeofencePayload = {
      name: newName,
      areaType: newAreaType,
      coordinates: newCoordinates,
    };
    createArea(payload);
  };

  const handleDeleteArea = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;
    deleteArea(id);
  };

  return {
    areas: areas || [],
    isLoading,
    error,

    // Form state and handlers
    newName,
    setNewName,
    newAreaType,
    setNewAreaType,
    newCoordinates,

    // Map handler
    handleShapeCreated,

    // Action handlers
    handleSaveArea,
    isSaving,
    handleDeleteArea,
    isDeleting, // You can use this to disable delete buttons
  };
}

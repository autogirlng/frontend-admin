"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import type {
  Country,
  GeoState,
  GeofenceArea,
  GeofencePayload,
  Coordinate,
  AreaType,
} from "@/components/outskirt/geo";
import { latLngsToCoordinates } from "@/components/outskirt/geo";

export function useGeofenceManager() {
  const queryClient = useQueryClient();

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null,
  );
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newAreaType, setNewAreaType] = useState<AreaType>("OUTSKIRT");
  const [newCoordinates, setNewCoordinates] = useState<Coordinate[]>([]);

  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    Country[]
  >({
    queryKey: ["countries"],
    queryFn: () => apiClient.get<Country[]>("/countries"),
  });

  const { data: states, isLoading: isLoadingStates } = useQuery<GeoState[]>({
    queryKey: ["states", selectedCountryId],
    queryFn: () =>
      apiClient.get<GeoState[]>(`/states/country/${selectedCountryId}`),
    enabled: !!selectedCountryId,
  });

  const {
    data: areas,
    isLoading: isLoadingAreas,
    error,
  } = useQuery<GeofenceArea[]>({
    queryKey: ["geofenceAreas", selectedStateId],
    queryFn: () =>
      apiClient.get<GeofenceArea[]>(
        `/geofence-areas?stateId=${selectedStateId}`,
      ),
    enabled: !!selectedStateId,
  });

  const { mutate: createArea, isPending: isSaving } = useMutation({
    mutationFn: (payload: GeofencePayload) =>
      apiClient.post<GeofenceArea>("/geofence-areas", payload),
    onSuccess: () => {
      toast.success("Geofenced area created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["geofenceAreas", selectedStateId],
      });
      setNewName("");
      setNewAreaType("OUTSKIRT");
      setNewCoordinates([]);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create area."),
  });

  const { mutateAsync: updateAreaTypeAsync, isPending: isUpdatingType } =
    useMutation({
      mutationFn: ({ id, areaType }: { id: string; areaType: AreaType }) =>
        apiClient.put<GeofenceArea>(`/geofence-areas/${id}`, { areaType }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["geofenceAreas", selectedStateId],
        });
      },
    });

  const { mutateAsync: transferAreaAsync, isPending: isTransferring } =
    useMutation({
      mutationFn: ({ id, newStateId }: { id: string; newStateId: string }) =>
        apiClient.patch<GeofenceArea>(`/geofence-areas/${id}/transfer`, {
          newStateId,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["geofenceAreas", selectedStateId],
        });
      },
    });

  const { mutate: deleteArea, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/geofence-areas/${id}`),
    onSuccess: () => {
      toast.success("Area deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["geofenceAreas", selectedStateId],
      });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete area."),
  });

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountryId(countryId);
    setSelectedStateId(null);
    setNewCoordinates([]);
  };

  const handleStateSelect = (stateId: string) => {
    setSelectedStateId(stateId);
    setNewCoordinates([]);
  };

  const handleShapeCreated = (latlngs: [number, number][]) => {
    const coords = latLngsToCoordinates(latlngs);
    setNewCoordinates(coords);
    toast.success("Shape drawn! Add a name and type, then save.");
  };

  const handleSaveArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStateId) {
      toast.error("Please select a state first.");
      return;
    }
    if (!newName.trim() || newCoordinates.length < 3) {
      toast.error(
        "Please draw a shape (at least 3 points) and provide a name.",
      );
      return;
    }
    createArea({
      name: newName,
      areaType: newAreaType,
      stateId: selectedStateId,
      coordinates: newCoordinates,
    });
  };

  const handleDeleteArea = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;
    deleteArea(id);
  };

  const selectedCountry =
    countries?.find((c) => c.id === selectedCountryId) ?? null;
  const selectedState = states?.find((s) => s.id === selectedStateId) ?? null;

  return {
    countries: countries ?? [],
    states: states ?? [],
    areas: areas ?? [],

    selectedCountryId,
    selectedStateId,
    selectedCountry,
    selectedState,

    isLoadingCountries,
    isLoadingStates,
    isLoadingAreas,
    isLoading: isLoadingCountries,
    error,

    handleCountrySelect,
    handleStateSelect,

    newName,
    setNewName,
    newAreaType,
    setNewAreaType,
    newCoordinates,

    handleShapeCreated,
    handleSaveArea,
    isSaving,

    updateAreaTypeAsync,
    isUpdatingType,

    transferAreaAsync,
    isTransferring,

    handleDeleteArea,
    isDeleting,
  };
}

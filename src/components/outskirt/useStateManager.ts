"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import type { Country, GeoState, StatePayload, Coordinate } from "./geo";
import { latLngsToCoordinates, parseWktToLatLngRings } from "./geo";

const DEFAULT_FORM: StatePayload = {
  name: "",
  countryId: "",
  stateCode: "",
  isActive: true,
  coordinates: [],
};

export function useStateManager() {
  const queryClient = useQueryClient();

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null,
  );
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingState, setEditingState] = useState<GeoState | null>(null);
  const [form, setForm] = useState<StatePayload>({ ...DEFAULT_FORM });
  const [drawnCoordinates, setDrawnCoordinates] = useState<Coordinate[]>([]);

  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    Country[]
  >({
    queryKey: ["countries"],
    queryFn: () => apiClient.get<Country[]>("/countries"),
  });

  const {
    data: states,
    isLoading: isLoadingStates,
    error,
  } = useQuery<GeoState[]>({
    queryKey: ["states", selectedCountryId],
    queryFn: () =>
      apiClient.get<GeoState[]>(`/states/country/${selectedCountryId}`),
    enabled: !!selectedCountryId,
  });

  const { mutate: createState, isPending: isCreating } = useMutation({
    mutationFn: (payload: StatePayload) =>
      apiClient.post<GeoState>("/states", payload),
    onSuccess: () => {
      toast.success("State created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["states", selectedCountryId],
      });
      handleBackToList();
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to create state."),
  });

  const { mutate: updateState, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StatePayload }) =>
      apiClient.put<GeoState>(`/states/${id}`, payload),
    onSuccess: () => {
      toast.success("State updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["states", selectedCountryId],
      });
      handleBackToList();
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to update state."),
  });

  const { mutate: deleteState, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/states/${id}`),
    onSuccess: () => {
      toast.success("State deleted.");
      queryClient.invalidateQueries({
        queryKey: ["states", selectedCountryId],
      });
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to delete state."),
  });

  const handleFieldChange = (field: keyof StatePayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountryId(countryId);
    setMode("list");
    setEditingState(null);
    setForm({ ...DEFAULT_FORM, countryId });
    setDrawnCoordinates([]);
  };

  const handleShapeCreated = (latlngs: [number, number][]) => {
    const coords = latLngsToCoordinates(latlngs);
    setDrawnCoordinates(coords);
    setForm((prev) => ({ ...prev, coordinates: [coords] }));
    toast.success(
      `✓ ${latlngs.length} boundary points captured — save when ready.`,
    );
  };

  const handleCreateMode = () => {
    if (!selectedCountryId) {
      toast.error("Please select a country first.");
      return;
    }
    setForm({ ...DEFAULT_FORM, countryId: selectedCountryId });
    setDrawnCoordinates([]);
    setEditingState(null);
    setMode("create");
  };

  const handleEditMode = (geoState: GeoState) => {
    setEditingState(geoState);
    setForm({
      name: geoState.name,
      countryId: geoState.country.id,
      stateCode: geoState.stateCode,
      isActive: geoState.active,
      coordinates: [],
    });
    setDrawnCoordinates([]);
    setMode("edit");
  };

  const handleBackToList = () => {
    setMode("list");
    setEditingState(null);
    setForm({ ...DEFAULT_FORM, countryId: selectedCountryId ?? "" });
    setDrawnCoordinates([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, stateCode, countryId } = form;
    if (!name || !stateCode || !countryId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (mode === "edit" && editingState) {
      const finalCoords =
        form.coordinates.length > 0
          ? form.coordinates
          : existingBoundaryRings.length > 0
            ? existingBoundaryRings.map((ring) =>
                ring.map(([lat, lng]) => ({ latitude: lat, longitude: lng })),
              )
            : [];

      updateState({
        id: editingState.id,
        payload: { ...form, coordinates: finalCoords },
      });
    } else {
      if (form.coordinates.length === 0) {
        toast.error("Please draw the state boundary on the map.");
        return;
      }
      createState(form);
    }
  };

  const handleDelete = (id: string) => {
    if (
      !window.confirm(
        "Delete this state? This will also remove all its geofence areas.",
      )
    )
      return;
    deleteState(id);
  };

  const selectedCountry =
    countries?.find((c) => c.id === selectedCountryId) ?? null;

  const existingBoundaryRings: [number, number][][] = editingState?.polygon
    ? parseWktToLatLngRings(editingState.polygon)
    : [];

  return {
    countries: countries ?? [],
    isLoadingCountries,
    selectedCountryId,
    selectedCountry,
    handleCountrySelect,

    states: states ?? [],
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
    isSaving: isCreating || isUpdating,

    handleDelete,
    isDeleting,
  };
}

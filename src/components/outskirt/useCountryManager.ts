"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import type { Country, CountryPayload, Coordinate } from "./geo";
import { latLngsToCoordinates, parseWktToLatLngRings } from "./geo";

const DEFAULT_FORM: CountryPayload = {
  name: "",
  shortname: "",
  country_code: "",
  continent: "",
  currencyName: "",
  currencySymbol: "",
  isActive: true,
  coordinates: [],
};

export function useCountryManager() {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [form, setForm] = useState<CountryPayload>({ ...DEFAULT_FORM });
  const [drawnCoordinates, setDrawnCoordinates] = useState<Coordinate[]>([]);

  const {
    data: countries,
    isLoading,
    error,
  } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: () => apiClient.get<Country[]>("/countries"),
  });

  const { mutate: createCountry, isPending: isCreating } = useMutation({
    mutationFn: (payload: CountryPayload) =>
      apiClient.post<Country>("/countries", payload),
    onSuccess: () => {
      toast.success("Country created successfully!");
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      handleBackToList();
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to create country."),
  });

  const { mutate: updateCountry, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CountryPayload }) =>
      apiClient.put<Country>(`/countries/${id}`, payload),
    onSuccess: () => {
      toast.success("Country updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      handleBackToList();
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to update country."),
  });

  const { mutate: deleteCountry, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/countries/${id}`),
    onSuccess: () => {
      toast.success("Country deleted.");
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to delete country."),
  });

  const handleFieldChange = (field: keyof CountryPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    setForm({ ...DEFAULT_FORM });
    setDrawnCoordinates([]);
    setEditingCountry(null);
    setMode("create");
  };

  const handleEditMode = (country: Country) => {
    setEditingCountry(country);
    setForm({
      name: country.name,
      shortname: country.shortname,
      country_code: country.country_code,
      continent: country.continent,
      currencyName: country.currencyName,
      currencySymbol: country.currencySymbol,
      isActive: country.active,
      coordinates: [],
    });
    setDrawnCoordinates([]);
    setMode("edit");
  };

  const handleBackToList = () => {
    setMode("list");
    setEditingCountry(null);
    setForm({ ...DEFAULT_FORM });
    setDrawnCoordinates([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      shortname,
      country_code,
      continent,
      currencyName,
      currencySymbol,
    } = form;
    if (
      !name ||
      !shortname ||
      !country_code ||
      !continent ||
      !currencyName ||
      !currencySymbol
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (mode === "edit" && editingCountry) {
      const finalCoords =
        form.coordinates.length > 0
          ? form.coordinates
          : existingBoundaryRings.length > 0
            ? existingBoundaryRings.map((ring) =>
                ring.map(([lat, lng]) => ({ latitude: lat, longitude: lng })),
              )
            : [];

      updateCountry({
        id: editingCountry.id,
        payload: { ...form, coordinates: finalCoords },
      });
    } else {
      if (form.coordinates.length === 0) {
        toast.error("Please draw the country boundary on the map.");
        return;
      }
      createCountry(form);
    }
  };

  const handleDelete = (id: string) => {
    if (
      !window.confirm(
        "Delete this country? This will also remove all its states and geofence areas.",
      )
    )
      return;
    deleteCountry(id);
  };

  const existingBoundaryRings: [number, number][][] = editingCountry?.polygon
    ? parseWktToLatLngRings(editingCountry.polygon)
    : [];

  return {
    countries: countries ?? [],
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
    isSaving: isCreating || isUpdating,

    handleDelete,
    isDeleting,
  };
}

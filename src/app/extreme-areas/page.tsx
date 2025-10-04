"use client";
import React, { useState, useEffect, FormEvent } from "react";
import {
  useExtremeAreas,
  useAddExtremeArea,
  useUpdateExtremeArea,
  useDeleteExtremeArea,
  useExtremeAreaById,
  ExtremeArea,
} from "@/hooks/use_extreme_areas";
import { Edit, Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import { Spinner } from "@/components/shared/spinner";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
import { toast } from "react-toastify";

const states = [
  "ABUJA_FCT",
  "ABIA",
  "ADAMAWA",
  "AKWA_IBOM",
  "ANAMBRA",
  "BAUCHI",
  "BAYELSA",
  "BENUE",
  "BORNO",
  "CROSS_RIVER",
  "DELTA",
  "EBONYI",
  "EDO",
  "EKITI",
  "ENUGU",
  "GOMBE",
  "IMO",
  "JIGAWA",
  "KADUNA",
  "KANO",
  "KATSINA",
  "KEBBI",
  "KOGI",
  "KWARA",
  "LAGOS",
  "NASARAWA",
  "NIGER",
  "OGUN",
  "ONDO",
  "OSUN",
  "OYO",
  "PLATEAU",
  "RIVERS",
  "SOKOTO",
  "TARABA",
  "YOBE",
  "ZAMFARA",
];
const stateOptions = states.map((state) => ({
  value: state,
  option: state.replace(/_/g, " "),
}));

const AddAreaForm = ({
  onSubmit,
  onClose,
  isSubmitting,
}: {
  onSubmit: (payload: { state: string; areas: string[] }) => void;
  onClose: () => void;
  isSubmitting: boolean;
}) => {
  const [formStateValue, setFormStateValue] = useState("LAGOS");
  const [formAreas, setFormAreas] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  const handleAreaChange = (index: number, value: string) => {
    const newAreas = [...formAreas];
    newAreas[index] = value;
    setFormAreas(newAreas);
  };
  const addAreaInput = () => setFormAreas([...formAreas, ""]);
  const removeAreaInput = (index: number) =>
    setFormAreas(formAreas.filter((_, i) => i !== index));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanedAreas = formAreas.map((a) => a.trim()).filter(Boolean);
    if (cleanedAreas.length === 0) {
      setError("At least one area is required.");
      return;
    }
    setError(null);
    onSubmit({ state: formStateValue, areas: cleanedAreas });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 space-y-6">
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            State
          </label>
          <select
            id="state"
            value={formStateValue}
            onChange={(e) => setFormStateValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {stateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas
          </label>
          {formAreas.map((area, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder={`Area ${index + 1}`}
                value={area}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {formAreas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAreaInput(index)}
                  className="p-2 text-[#ff0000] hover:bg-danger-100 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAreaInput}
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 mt-2"
          >
            <Plus size={16} /> Add Another Area
          </button>
          {error && <p className="text-danger-500 text-xs mt-2">{error}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 p-5 bg-gray-50 border-t rounded-b-xl">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#f0f0f0] rounded-lg hover:bg-[#e0e0e0]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 flex items-center gap-2 bg-primary-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-primary-700"
        >
          {isSubmitting && <Spinner />} Submit
        </button>
      </div>
    </form>
  );
};

const EditAreaForm = ({
  areaData,
  onSubmit,
  onClose,
  isSubmitting,
}: {
  areaData: ExtremeArea;
  onSubmit: (payload: { areas: string[] }) => void;
  onClose: () => void;
  isSubmitting: boolean;
}) => {
  const [formAreas, setFormAreas] = useState<string[]>(
    areaData.areas.length > 0 ? areaData.areas : [""]
  );
  const [error, setError] = useState<string | null>(null);

  const handleAreaChange = (index: number, value: string) => {
    const newAreas = [...formAreas];
    newAreas[index] = value;
    setFormAreas(newAreas);
  };
  const addAreaInput = () => setFormAreas([...formAreas, ""]);
  const removeAreaInput = (index: number) =>
    setFormAreas(formAreas.filter((_, i) => i !== index));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanedAreas = formAreas.map((a) => a.trim()).filter(Boolean);
    if (cleanedAreas.length === 0) {
      setError("At least one area is required.");
      return;
    }
    setError(null);
    onSubmit({ areas: cleanedAreas });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">State</h4>
          <p className="px-3 py-2 w-full bg-gray-100 text-gray-800 rounded-md capitalize">
            {areaData.state.replace(/_/g, " ")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas
          </label>
          {formAreas.map((area, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder={`Area ${index + 1}`}
                value={area}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {formAreas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAreaInput(index)}
                  className="p-2 text-[#ff0000] hover:bg-danger-100 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAreaInput}
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 mt-2"
          >
            <Plus size={16} /> Add Another Area
          </button>
          {error && <p className="text-danger-500 text-xs mt-2">{error}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 p-5 bg-gray-50 border-t rounded-b-xl">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 flex items-center gap-2 bg-primary-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-primary-700"
        >
          {isSubmitting && <Spinner />} Save Changes
        </button>
      </div>
    </form>
  );
};

export default function ExtremeAreasPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useExtremeAreas(
    "",
    page,
    10
  );
  const addAreaMutation = useAddExtremeArea();
  const updateAreaMutation = useUpdateExtremeArea();
  const deleteAreaMutation = useDeleteExtremeArea();
  const { data: areaToEdit, isLoading: isAreaLoading } =
    useExtremeAreaById(editingId);

  const totalPages = data?.totalPages || 1;

  const openAddModal = () => setShowAddModal(true);
  const openEditModal = (area: ExtremeArea) => setEditingId(area.id);
  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
  };

  const handleAddSubmit = (payload: { state: string; areas: string[] }) => {
    addAreaMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Extreme area added successfully!");
        closeModal();
        refetch();
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to add area"),
    });
  };

  const handleUpdateSubmit = (payload: { areas: string[] }) => {
    if (!editingId || !areaToEdit) return;
    updateAreaMutation.mutate(
      { id: editingId, state: areaToEdit.state, ...payload },
      {
        onSuccess: () => {
          toast.success("Extreme area updated successfully!");
          closeModal();
          refetch();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to update area"),
      }
    );
  };

  const handleDelete = (area: ExtremeArea) => {
    if (
      window.confirm(
        `Are you sure you want to delete all areas for ${area.state.replace(
          /_/g,
          " "
        )}?`
      )
    ) {
      deleteAreaMutation.mutate(area.id, {
        onSuccess: () => {
          toast.success("Extreme area group deleted successfully!");
          refetch();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to delete area"),
      });
    }
  };

  const isModalOpen = showAddModal || editingId !== null;

  return (
    <DashboardLayout title="Extreme Areas" currentPage="Extreme Areas">
      <div className="space-y-8 py-8 px-0 mx-0">
        <div className="flex justify-between items-center">
          <DashboardSectionTitle title="Manage Extreme Areas" />
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl">
          {isLoading && (
            <div className="flex justify-center p-10">
              <Spinner />
            </div>
          )}
          {isError && (
            <EmptyState
              image={ImageAssets.icons.errorState}
              title="An Error Occurred"
              message={(error as any)?.message || "Failed to fetch data"}
            />
          )}
          {!isLoading && !isError && data?.data?.length === 0 && (
            <EmptyState
              title="No Extreme Areas Found"
              message="Get started by adding a new extreme area."
              image={ImageAssets.icons.emptySearchState}
            />
          )}
          {!isLoading && !isError && data?.data?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-gray-600"
                    >
                      State
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-gray-600"
                    >
                      Extreme Areas
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.data.map((area: ExtremeArea) => (
                    <tr
                      key={area.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap capitalize">
                        {area.state.replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {area.areas.map((a: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end items-center gap-4">
                          <button
                            onClick={() => openEditModal(area)}
                            className="text-primary-600 hover:text-primary-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(area)}
                            className="text-[#ff0000] hover:text-danger-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold">
                {editingId ? "Edit Extreme Area" : "Add New Extreme Area"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {showAddModal && (
              <AddAreaForm
                onSubmit={handleAddSubmit}
                onClose={closeModal}
                isSubmitting={addAreaMutation.isPending}
              />
            )}

            {editingId &&
              (isAreaLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Spinner />
                </div>
              ) : (
                areaToEdit && (
                  <EditAreaForm
                    areaData={areaToEdit}
                    onSubmit={handleUpdateSubmit}
                    onClose={closeModal}
                    isSubmitting={updateAreaMutation.isPending}
                  />
                )
              ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

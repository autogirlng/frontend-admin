"use client";
import { useState } from "react";
import {
  useExtremeAreas,
  useAddExtremeArea,
  useUpdateExtremeArea,
  useDeleteExtremeArea,
  ExtremeArea,
} from "@/hooks/use_extreme_areas";
import Select from "@/components/shared/select";
import InputField from "@/components/shared/inputField";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash } from "react-icons/fa";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import { Spinner } from "@/components/shared/spinner";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const states = [
  "ABUJA_FCT", "ABIA", "ADAMAWA", "AKWA_IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", 
  "BENUE", "BORNO", "CROSS_RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU",
  "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", 
  "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", 
  "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"
];

const stateOptions = states.map(state => ({
  value: state,
  option: state.replace(/_/g, " ")
}));

const AddExtremeAreaSchema = Yup.object().shape({
  state: Yup.string().required("State is required"),
  areas: Yup.string()
    .required("At least one area is required")
    .test(
      "is-valid-list",
      "Please enter a comma-separated list of areas",
      (value) => {
        if (!value) return false;
        const areas = value.split(",").map(a => a.trim()).filter(Boolean);
        return areas.length > 0;
      }
    ),
});

const UpdateExtremeAreaSchema = Yup.object().shape({
  state: Yup.string().required("State is required"),
  areas: Yup.string().required("At least one area is required"),
});

export default function ExtremeAreasPage() {
  const [selectedState, setSelectedState] = useState("LAGOS");
  const [editingArea, setEditingArea] = useState<ExtremeArea | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useExtremeAreas(selectedState, page, limit);
  const addAreaMutation = useAddExtremeArea();
  const updateAreaMutation = useUpdateExtremeArea();
  const deleteAreaMutation = useDeleteExtremeArea();

  const totalPages = data?.totalPages || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Remove a single area from the group
  const handleDeleteArea = (area: ExtremeArea, areaName: string) => {
    if (window.confirm(`Are you sure you want to delete area: ${areaName}?`)) {
      const updatedAreas = (area.areas || []).filter(a => a !== areaName);
      if (updatedAreas.length === 0) {
        // If no areas left, delete the whole group
        deleteAreaMutation.mutate(area.id, {
          onSuccess: () => toast.success("Extreme area deleted successfully!"),
          onError: (err: any) => {
            const message = err?.response?.data?.message || err?.message || "Failed to delete";
            toast.error(Array.isArray(message) ? message.join(", ") : message);
          },
        });
      } else {
        // Otherwise, update the group with the area removed
        updateAreaMutation.mutate(
          { id: area.id, state: area.state, areas: updatedAreas },
          {
            onSuccess: () => toast.success("Area removed successfully!"),
            onError: (err: any) => {
              const message = err?.response?.data?.message || err?.message || "Failed to remove area";
              toast.error(Array.isArray(message) ? message.join(", ") : message);
            },
          }
        );
      }
    }
  };

  return (
    <DashboardLayout title="Extreme Areas" currentPage="Extreme Areas">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <DashboardSectionTitle
            icon={null}
            title="Extreme Areas"
          />
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#0673FF] text-white rounded-lg"
            style={{ fontSize: 13 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add Extreme Area</span>
          </button>
        </div>
        <div className="container py-8">
          <h2 className="text-2xl font-bold mb-4">Existing Extreme Areas</h2>
          <div className="mb-8 flex items-center gap-4">
            <div className="max-w-sm flex-1">
              <Select
                id="filterState"
                label="Filter by State"
                placeholder="e.g., LAGOS"
                options={stateOptions}
                value={selectedState}
                onChange={(value) => { setSelectedState(value); setPage(1); }}
              />
            </div>
          </div>
          {isLoading && <Spinner />}
          {isError && (
            <EmptyState
              image={ImageAssets.icons.errorState}
              title="An Error Occurred"
              message={
                (Array.isArray((error as any)?.response?.data?.message)
                  ? (error as any).response.data.message.join(", ")
                  : (error as any)?.response?.data?.message) ||
                (error as any)?.message ||
                "Failed To Fetch Extreme Areas"
              }
            />
          )}
          {data?.data?.length === 0 && (
            <EmptyState title="No Extreme Areas" message="No extreme areas found for the current filter settings." image={ImageAssets.icons.emptySearchState} />
          )}
          {(() => {
            let items: ExtremeArea[] = [];
            if (Array.isArray(data?.data)) {
              items = data.data;
            } else if (data?.data) {
              items = [data.data];
            } else if (data && data.id && data.areas) {
              // handle when API returns a single object directly
              items = [data as ExtremeArea];
            }
            return items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-grey-200 rounded-lg">
                  <thead>
                    <tr className="bg-white p-2 border-grey-200 border-b">
                      <th className="py-4 px-6 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">State</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Areas</th>
                      <th className="py-4 px-6 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm capitalize text-grey-700 divide-grey-200">
                    {items.flatMap((area: ExtremeArea) =>
                      (area.areas || []).map((singleArea, idx) => (
                        <tr key={`${area.id}-${idx}`}>
                          <td className="py-4 px-6 whitespace-nowrap">{area.state}</td>
                          <td className="py-4 px-6 whitespace-nowrap">{singleArea}</td>
                          <td className="py-4 px-6 whitespace-nowrap text-right text-lg font-medium space-x-4">
                            <button
                              onClick={() => setEditingArea({ ...area, areas: [singleArea] })}
                              className="text-primary-600 hover:text-primary-900"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteArea(area, singleArea)}
                              className={`text-error-500 hover:text-error-900 ${deleteAreaMutation.isPending && "opacity-50 cursor-not-allowed"}`}
                              title="Delete"
                              disabled={deleteAreaMutation.isPending}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center">
                    <div className="flex items-center space-x-2 mt-4">
                      <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="flex items-center justify-center p-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
                        title="Previous Page"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {pageNumbers.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors \
                            ${pageNumber === page ? 'bg-[#0673FF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          title={`Page ${pageNumber}`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="flex items-center justify-center p-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
                        title="Next Page"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          {/* Add Area Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-grey-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
              <div className="relative p-8 bg-white w-96 max-w-md mx-auto rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Add New Extreme Area</h3>
                <Formik
                  initialValues={{ state: "LAGOS", areas: "" }}
                  validationSchema={AddExtremeAreaSchema}
                  onSubmit={(values, { resetForm, setSubmitting }) => {
                    const areasArray = values.areas.split(",").map(a => a.trim()).filter(Boolean);
                    addAreaMutation.mutate(
                      {
                        state: values.state,
                        areas: areasArray,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Extreme areas added successfully!");
                          resetForm();
                          setShowAddModal(false);
                          if (selectedState === values.state) {
                            setSelectedState(values.state);
                          }
                          setSubmitting(false);
                        },
                        onError: (err: any) => {
                          const message = err?.response?.data?.message || err?.message || "Failed to add extreme areas";
                          toast.error(Array.isArray(message) ? message.join(", ") : message);
                          setSubmitting(false);
                        },
                      }
                    );
                  }}
                >
                  {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div className="max-w-sm">
                        <Select
                          id="addState"
                          label="State"
                          placeholder="Select a state"
                          options={stateOptions}
                          value={values.state}
                          onChange={(value) => setFieldValue("state", value)}
                          error={errors.state && touched.state ? errors.state : undefined}
                        />
                      </div>
                      <Field name="areas">
                        {({ field, meta }: FieldProps) => (
                          <InputField
                            {...field}
                            id="addAreas"
                            label="Areas (comma-separated)"
                            placeholder="e.g., Lekki Phase 1, Epe, Victoria Island"
                            multiline
                            error={meta.touched && meta.error ? meta.error : undefined}
                          />
                        )}
                      </Field>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="px-4 py-2 bg-grey-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 flex bg-primary-600 text-white rounded-lg disabled:bg-grey-400"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && <Spinner />} Add Area
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
          {/* Edit Area Modal */}
          {editingArea && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
              <div className="relative p-8 bg-white w-96 max-w-md mx-auto rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Edit Extreme Area</h3>
                <Formik
                  initialValues={{
                    id: editingArea.id,
                    state: editingArea.state,
                    areas: editingArea.areas[0],
                  }}
                  enableReinitialize
                  validationSchema={UpdateExtremeAreaSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    // Only update the single area being edited
                    const updatedAreas = (data?.data && Array.isArray(data.data)
                      ? data.data.find((ea: ExtremeArea) => ea.id === editingArea.id)?.areas || []
                      : editingArea.areas
                    ).map((a: string) => a === editingArea.areas[0] ? values.areas : a);
                    updateAreaMutation.mutate(
                      { id: values.id, state: values.state, areas: updatedAreas },
                      {
                        onSuccess: () => {
                          toast.success("Extreme area updated successfully!");
                          setEditingArea(null);
                          setSubmitting(false);
                        },
                        onError: (err: any) => {
                          const message = err?.response?.data?.message || err?.message || "Failed to update extreme area";
                          toast.error(Array.isArray(message) ? message.join(", ") : message);
                          setSubmitting(false);
                        },
                      }
                    );
                  }}
                >
                  {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div className="max-w-sm">
                        <Select
                          id="editState"
                          label="State"
                          placeholder="Select a state"
                          options={stateOptions}
                          value={values.state}
                          onChange={(value) => setFieldValue("state", value)}
                          error={errors.state && touched.state ? errors.state : undefined}
                        />
                      </div>
                      <Field name="areas">
                        {({ field, meta }: FieldProps) => (
                          <InputField
                            {...field}
                            id="editAreas"
                            label="Area Name"
                            placeholder="e.g., Lekki Phase 1"
                            error={meta.touched && meta.error ? meta.error : undefined}
                          />
                        )}
                      </Field>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setEditingArea(null)}
                          className="px-4 py-2 bg-grey-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 flex bg-primary-600 text-white rounded-lg disabled:bg-grey-400"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && <Spinner />} Update
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

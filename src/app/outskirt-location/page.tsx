"use client";
import { useState } from "react";
import {
  useOutskirtLocations,
  useAddOutskirtLocation,
  useUpdateOutskirtLocation,
  useDeleteOutskirtLocation,
  useToggleActiveStatus,
  OutskirtLocation,
} from "@/hooks/use_outskirt_location";
import Select from "@/components/shared/select";
import AppSwitch from "@/components/shared/switch";
import InputField from "@/components/shared/inputField";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Button from "@/components/core/button/Button";
import Icons from "@/utils/Icon";
import { Spinner } from "@/components/shared/spinner";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { RiToggleLine, RiToggleFill } from "react-icons/ri"; // Importing better icons for toggling
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Status } from "@/utils/types";

// =============================================================================
// State Data and Constants
// =============================================================================
// Added "ALL_STATES" to the list
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

// Validation schema for adding locations
const AddLocationSchema = Yup.object().shape({
  state: Yup.string().required("State is required"),
  locations: Yup.string()
    .required("At least one location is required")
    .test(
      "is-valid-list",
      "Please enter a comma-separated list of locations",
      (value) => {
        if (!value) return false;
        const locations = value.split(",").map(loc => loc.trim()).filter(Boolean);
        return locations.length > 0;
      }
    ),
  isActive: Yup.boolean(),
});

// Validation schema for updating a location
const UpdateLocationSchema = Yup.object().shape({
  locationName: Yup.string().required("Location name is required"),
  state: Yup.string().required("State is required"),
  isActive: Yup.boolean(),
});

// =============================================================================
// Page Component
// =============================================================================
export default function OutskirtLocationsPage() {
  const [selectedState, setSelectedState] = useState("LAGOS");
  const [showActive, setShowActive] = useState(true);
  const [editingLocation, setEditingLocation] = useState<OutskirtLocation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // A default limit for pagination

  const { data, isLoading, isError, error } = useOutskirtLocations(selectedState, showActive, page, limit);
  const addLocationMutation = useAddOutskirtLocation();
  const updateLocationMutation = useUpdateOutskirtLocation();
  const deleteLocationMutation = useDeleteOutskirtLocation();
  const toggleActiveMutation = useToggleActiveStatus();

  // Handlers for the new actions
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      deleteLocationMutation.mutate(id, {
        onSuccess: () => toast.success("Location deleted successfully!"),
        onError: (err) => toast.error(`Failed to delete location: ${err.message}`),
      });
    }
  };

  const handleToggleActive = (id: string) => {
    toggleActiveMutation.mutate(id, {
      onSuccess: () => toast.success("Location status toggled successfully!"),
      onError: (err) => toast.error(`Failed to toggle status: ${err.message}`),
    });
  };
  
  // Calculate total pages based on fetched data count (this is a simplified assumption)
  const totalItems = data?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / limit);


  return (
    <DashboardLayout title="Outskirt Location" currentPage="Outskirt Location">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <DashboardSectionTitle
            icon={Icons.ic_location}
            title="Outskirt Location"
          />
          
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#0673FF] text-white rounded-lg"
            style={{ fontSize: 13 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add Outskirt Location</span>
          </button>
        </div>
        <div className="container py-8">
          
          {/* Location List and Filters */}
          <h2 className="text-2xl font-bold mb-4">Existing Outskirt Locations</h2>
          <div className="mb-8 flex items-center gap-4">
            <div className="max-w-sm flex-1">
              <Select
                id="filterState"
                label="Filter by State"
                placeholder="e.g., LAGOS"
                options={stateOptions}
                value={selectedState}
                onChange={(value) => {setSelectedState(value); setPage(1);}}
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <label htmlFor="filterIsActive" className="text-gray-700">Show Active</label>
              <AppSwitch
                id="filterIsActive"
                name="showActive"
                value={showActive}
                onChange={(checked) => {setShowActive(checked); setPage(1);}}
              />
            </div>
          </div>

          {/* Conditional Rendering based on data state */}
          {isLoading &&<Spinner/>}
          {isError && <EmptyState image={ImageAssets.icons.errorState} title="An Error Occurred" message='Failed To Fetch Outskirt Location'/>}
          {/* This condition will now show when a valid filter returns no data */}
          {data?.data?.length === 0 && (
             <EmptyState title='No Outskirt Location' message=' No outskirt locations found for the current filter settings.' image={ ImageAssets.icons.emptySearchState} />
          )}
          
          {data?.data && data?.data?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-grey-200 rounded-lg">
                <thead>
                  <tr className="bg-white p-2 border-grey-200 border-b">
                    <th className="py-4 px-6 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Location Name</th>
                    {/* <th className="py-4 px-6 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">State</th> */}
                    <th className="py-4 px-6 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y  text-sm capitalize text-grey-700 divide-grey-200">
                  {data.data.map((location) => (
                    <tr key={location.id}>
                      <td className="py-4 px-6 whitespace-nowrap">{location.locationName}</td>
                      {/* <td className="py-4 px-6 whitespace-nowrap">{location.state}</td> */}
                          <td className="py-4 px-6 whitespace-nowrap">
                              <StatusBadge status={location.isActive ? Status.Active : Status.Inactive} />
                      
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-lg font-medium space-x-4">
                        <button
                          onClick={() => setEditingLocation(location)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleActive(location.id)}
                          className={`
                            ${location.isActive ? "text-error-500 hover:text-error-900" : "text-success-500 hover:text-success-600"} 
                            ${toggleActiveMutation.isPending && "opacity-50 cursor-not-allowed"}
                          `}
                          title={location.isActive ? "Deactivate" : "Activate"}
                          disabled={toggleActiveMutation.isPending}
                        >
                          <FaCheckCircle className={location.isActive ? 'text-success-500' : 'hidden'}/>
                          <FaTimesCircle className={!location.isActive ? 'text-error-500' : 'hidden'}/>
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className={`text-error-500 hover:text-error-900 ${deleteLocationMutation.isPending && "opacity-50 cursor-not-allowed"}`}
                          title="Delete"
                          disabled={deleteLocationMutation.isPending}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Simple Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-end items-center space-x-2 mt-4">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Add Location Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-grey-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
              <div className="relative p-8 bg-white w-96 max-w-md mx-auto rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Add New Location</h3>
                <Formik
                  initialValues={{ state: "LAGOS", locations: "", isActive: true }}
                  validationSchema={AddLocationSchema}
                  onSubmit={(values, { resetForm, setSubmitting }) => { 
                    const locationsArray = values.locations.split(",").map(loc => loc.trim()).filter(Boolean);
                    addLocationMutation.mutate(
                      {
                        state: values.state,
                        locations: locationsArray,
                        isActive: values.isActive,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Locations added successfully!");
                          resetForm();
                          setShowAddModal(false);
                          if (selectedState === values.state) {
                            setSelectedState(values.state);
                          }
                          setSubmitting(false);
                        },
                        onError: (err) => {
                          toast.error(`Failed to add locations: ${err.message}`);
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
                      
                      <Field name="locations">
                        {({ field, meta }: FieldProps) => (
                          <InputField
                            {...field}
                            id="addLocations"
                            label="Locations (comma-separated)"
                            placeholder="e.g., Epe, Lekki, Ajah"
                            multiline
                            error={meta.touched && meta.error ? meta.error : undefined}
                          />
                        )}
                      </Field>
                      
                      <div className="flex items-center gap-2">
                        <AppSwitch
                          id="addIsActive"
                          name="isActive"
                          value={values.isActive}
                          onChange={(checked) => setFieldValue("isActive", checked)}
                        />
                        <label htmlFor="addIsActive" className="text-grey-700">Set as active</label>
                      </div>

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
                          {isSubmitting && <Spinner/>} Add Location
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}

          {/* Edit Location Modal/Form */}
          {editingLocation && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
              <div className="relative p-8 bg-white w-96 max-w-md mx-auto rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Edit Location</h3>
                <Formik
                  initialValues={{
                    id: editingLocation.id,
                    locationName: editingLocation.locationName,
                    state: editingLocation.state,
                    isActive: editingLocation.isActive,
                  }}
                  validationSchema={UpdateLocationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    updateLocationMutation.mutate(values, {
                      onSuccess: () => {
                        toast.success("Location updated successfully!");
                        setEditingLocation(null);
                        setSubmitting(false);
                      },
                      onError: (err) => {
                        toast.error(`Failed to update location: ${err.message}`);
                        setSubmitting(false);
                      },
                    });
                  }}
                >
                  {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                      <Field name="locationName">
                        {({ field, meta }: FieldProps) => (
                          <InputField
                            {...field}
                            id="editLocationName"
                            label="Location Name"
                            placeholder="Enter location name"
                            error={meta.touched && meta.error ? meta.error : undefined}
                          />
                        )}
                      </Field>
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
                      <div className="flex items-center gap-2">
                        <AppSwitch
                          id="editIsActive"
                          name="isActive"
                          value={values.isActive}
                          onChange={(checked) => setFieldValue("isActive", checked)}
                        />
                        <label htmlFor="editIsActive" className="text-gray-700">Set as active</label>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setEditingLocation(null)}
                          className="px-4 py-2 bg-grey-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 flex bg-primary-600 text-white rounded-lg disabled:bg-grey-400"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && <Spinner/>} Update
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
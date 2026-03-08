"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import CheckboxCard from "@/components/generic/ui/CheckboxCard";
import DurationInput from "@/components/generic/ui/DurationInput";
import { Info, Loader2, X, Trash2 } from "lucide-react";
import clsx from "clsx";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Stepper from "@/components/generic/Stepper";
import Button from "@/components/generic/ui/Button";
import { useVehicleStep5 } from "@/lib/hooks/onboarding/steps/useVehicleStep5";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

const durationUnits: Option[] = [{ id: "DAYS", name: "Days" }];
const yesNoOptions: Option[] = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" },
];
const currentStep = 5;

function VehicleConfigForm({ vehicleId }: { vehicleId: string }) {
  const {
    formData,
    isLoading,
    isLoadingSession,
    isUpdating,
    bookingTypes,
    bookingTypeOptions,
    countries,
    states,
    geofenceAreas,
    discountDurations,
    selectedCountryId,
    setSelectedCountryId,
    activeGeofenceStateId,
    setActiveGeofenceStateId,
    stateNameMap,
    geofenceNameMap,
    isFetchingStates,
    isFetchingGeofences,
    handleInputChange,
    handleSelectChange,
    handleDurationChange,
    handleCheckboxChange,
    handlePriceChange,
    handleDiscountChange,
    handleStateFeeChange,
    handleSubmit,
  } = useVehicleStep5(vehicleId);

  const selectedBookingTypes = React.useMemo(() => {
    return bookingTypes.filter((bt) =>
      formData.supportedBookingTypeIds.includes(bt.id),
    );
  }, [bookingTypes, formData.supportedBookingTypeIds]);

  const countryOptions: Option[] = countries.map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const stateOptions: Option[] = states.map((s) => ({
    id: s.id,
    name: s.name,
  }));
  const geofenceAreaOptions: Option[] = geofenceAreas.map((g) => ({
    id: g.id,
    name: g.name,
  }));

  if (isLoading || isLoadingSession) {
    return <CustomLoader />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      <div className="lg:col-span-2">
        <fieldset disabled={isUpdating} className="space-y-8">
          <FormSection title="Trip Policies">
            <DurationInput
              label="Maximum Trip Duration"
              id="maxTripDuration"
              unitOptions={durationUnits}
              value={formData.maxTripDuration.value}
              unit={formData.maxTripDuration.unit}
              onValueChange={(newValue) =>
                handleDurationChange(
                  "maxTripDuration",
                  newValue,
                  formData.maxTripDuration.unit,
                )
              }
              onUnitChange={(newOption) =>
                handleDurationChange(
                  "maxTripDuration",
                  formData.maxTripDuration.value,
                  newOption?.id || "DAYS",
                )
              }
            />
            <DurationInput
              label="Advance Notice"
              id="advanceNotice"
              unitOptions={durationUnits}
              value={formData.advanceNotice.value}
              unit={formData.advanceNotice.unit}
              onValueChange={(newValue) =>
                handleDurationChange(
                  "advanceNotice",
                  newValue,
                  formData.advanceNotice.unit,
                )
              }
              onUnitChange={(newOption) =>
                handleDurationChange(
                  "advanceNotice",
                  formData.advanceNotice.value,
                  newOption?.id || "DAYS",
                )
              }
            />
          </FormSection>

          <FormSection title="Services">
            <Select
              label="Will you provide a driver?"
              options={yesNoOptions}
              placeholder="Select an option"
              selected={
                yesNoOptions.find((o) => o.id === formData.willProvideDriver) ||
                null
              }
              onChange={(option) =>
                handleSelectChange("willProvideDriver", option)
              }
            />
            <Select
              label="Will you provide fuel?"
              options={yesNoOptions}
              placeholder="Select an option"
              selected={
                yesNoOptions.find((o) => o.id === formData.willProvideFuel) ||
                null
              }
              onChange={(option) =>
                handleSelectChange("willProvideFuel", option)
              }
            />
          </FormSection>

          <FormSection title="Supported States & Inter-State Fees" gridCols="1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="1. Select Country to view States"
                options={countryOptions}
                selected={
                  countryOptions.find((c) => c.id === selectedCountryId) || null
                }
                onChange={(opt) => setSelectedCountryId(opt.id)}
                placeholder="Choose a country"
              />
            </div>

            {selectedCountryId && isFetchingStates ? (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading
                states...
              </div>
            ) : selectedCountryId && states.length > 0 ? (
              <div className="mt-4">
                <CheckboxGroup
                  label="2. Select Supported States"
                  options={stateOptions}
                  selectedIds={formData.supportedStateIds}
                  onChange={(id, checked) =>
                    handleCheckboxChange("supportedStateIds", id, checked)
                  }
                />
              </div>
            ) : selectedCountryId ? (
              <p className="text-sm text-gray-500 mt-2">
                No states found for this country.
              </p>
            ) : null}

            {formData.supportedStateIds.length > 0 && (
              <div className="mt-6 p-5 bg-gray-50 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">
                  3. Set State Surcharge Fees
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.supportedStateIds.map((stateId) => (
                    <div key={stateId} className="flex items-end gap-2">
                      <div className="flex-1">
                        <TextInput
                          label={`${stateNameMap[stateId] || "State"} Fee (NGN)`}
                          id={`surcharge-${stateId}`}
                          type="number"
                          placeholder="e.g. 50000 (0 for home state)"
                          value={formData.stateSurchargeFees[stateId] || ""}
                          onChange={(e) =>
                            handleStateFeeChange(stateId, e.target.value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckboxChange(
                            "supportedStateIds",
                            stateId,
                            false,
                          )
                        }
                        className="mb-[2px] p-3.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded border border-transparent hover:border-red-200 transition-colors focus:outline-none"
                        title={`Remove ${stateNameMap[stateId] || "State"}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FormSection>

          <FormSection title="Booking Types" gridCols="1">
            <CheckboxGroup
              label="Supported Booking Types"
              options={bookingTypeOptions}
              selectedIds={formData.supportedBookingTypeIds}
              onChange={(id, checked) =>
                handleCheckboxChange("supportedBookingTypeIds", id, checked)
              }
            />
          </FormSection>

          <FormSection title="Out of Bounds Areas (Geofences)" gridCols="1">
            <p className="text-sm text-gray-500">
              Select a supported state to view and manage its restricted areas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Select
                label="Select State to view Geofences"
                options={formData.supportedStateIds.map((id) => ({
                  id,
                  name: stateNameMap[id] || id,
                }))}
                selected={
                  activeGeofenceStateId
                    ? {
                        id: activeGeofenceStateId,
                        name:
                          stateNameMap[activeGeofenceStateId] ||
                          activeGeofenceStateId,
                      }
                    : null
                }
                onChange={(opt) => setActiveGeofenceStateId(opt.id)}
                placeholder="Choose a state"
                disabled={formData.supportedStateIds.length === 0}
              />
            </div>

            {activeGeofenceStateId && isFetchingGeofences ? (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading
                geofence areas...
              </div>
            ) : activeGeofenceStateId && geofenceAreas.length > 0 ? (
              <div className="mt-4">
                <CheckboxGroup
                  label={`Restricted Areas in ${stateNameMap[activeGeofenceStateId] || "State"}`}
                  options={geofenceAreaOptions}
                  selectedIds={formData.outOfBoundsAreaIds}
                  onChange={(id, checked) =>
                    handleCheckboxChange("outOfBoundsAreaIds", id, checked)
                  }
                />
              </div>
            ) : activeGeofenceStateId ? (
              <p className="text-sm text-gray-500 mt-2">
                No geofence areas found for this state.
              </p>
            ) : null}

            {formData.outOfBoundsAreaIds.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Currently Restricted Areas:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.outOfBoundsAreaIds.map((areaId) => (
                    <span
                      key={areaId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                    >
                      {geofenceNameMap[areaId] || "Loading area..."}
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckboxChange(
                            "outOfBoundsAreaIds",
                            areaId,
                            false,
                          )
                        }
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-red-500 hover:bg-red-200 hover:text-red-700 focus:outline-none"
                      >
                        <span className="sr-only">Remove area</span>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </FormSection>

          <FormSection title="Pricing">
            <div className="md:col-span-2 space-y-5">
              <h4 className="text-md font-semibold text-gray-800">
                Booking Rates
              </h4>
              {selectedBookingTypes.length > 0 ? (
                selectedBookingTypes.map((bt) => (
                  <TextInput
                    key={bt.id}
                    label={`${bt.name} Price (in NGN)`}
                    id={`price-${bt.id}`}
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.pricing[bt.id] || ""}
                    onChange={(e) => handlePriceChange(bt.id, e.target.value)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Please select one or more "Supported Booking Types" above.
                </p>
              )}
            </div>

            <TextInput
              label="Extra Hourly Rate (NGN)"
              id="extraHourlyRate"
              type="number"
              placeholder="e.g., 5000"
              value={formData.extraHourlyRate}
              onChange={handleInputChange}
            />
            <TextInput
              label="Outskirt Fee (NGN)"
              id="outskirtFee"
              type="number"
              placeholder="e.g., 10000"
              value={formData.outskirtFee}
              onChange={handleInputChange}
            />
            <TextInput
              label="Extreme Fee (NGN)"
              id="extremeFee"
              type="number"
              placeholder="e.g., 20000"
              value={formData.extremeFee}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Discounts">
            <div className="md:col-span-2 space-y-5">
              {discountDurations.map((dd) => (
                <TextInput
                  key={dd.id}
                  label={`${dd.name} Days Discount (%)`}
                  id={`discount-${dd.id}`}
                  type="number"
                  placeholder="e.g., 10"
                  max="100"
                  min="0"
                  value={formData.discounts[dd.id] || ""}
                  onChange={(e) => handleDiscountChange(dd.id, e.target.value)}
                />
              ))}
            </div>
          </FormSection>

          <div className="md:col-span-2 flex justify-between gap-4 pt-4">
            <Link
              href={`/dashboard/onboarding/photos?id=${vehicleId}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-[#0096FF] text-sm font-medium shadow-sm text-white bg-[#0096FF] hover:bg-[#007ACC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Photos
            </Link>
            <Button
              type="submit"
              isLoading={isUpdating}
              disabled={isUpdating || isLoadingSession}
            >
              {isUpdating ? "Saving..." : "Summary"}
            </Button>
          </div>
        </fieldset>
      </div>
      <div className="lg:col-span-1">
        <TipsSidebar currentStep={currentStep} />
      </div>
    </form>
  );
}

function Step5Content() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  if (!vehicleId)
    return (
      <div className="text-red-500 text-center p-8">
        Error: No vehicle ID found in the URL.
      </div>
    );
  return <VehicleConfigForm vehicleId={vehicleId} />;
}

export default function Step5() {
  return (
    <div className="relative min-h-screen pb-24 bg-white">
      <Stepper currentStep={currentStep} />
      <main className="max-w-8xl mt-8">
        <Suspense fallback={<CustomLoader />}>
          <Step5Content />
        </Suspense>
      </main>
    </div>
  );
}

const FormSection: React.FC<{
  title: string;
  gridCols?: "1" | "2";
  children: React.ReactNode;
}> = ({ title, gridCols = "2", children }) => (
  <div className="space-y-5">
    <div className="flex items-center">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <Info className="w-5 h-5 ml-1.5 text-black" />
    </div>
    <div
      className={clsx(
        "grid grid-cols-1 gap-x-6 gap-y-5",
        gridCols === "2" && "md:grid-cols-2",
      )}
    >
      {children}
    </div>
  </div>
);

const CheckboxGroup: React.FC<{
  label: string;
  options: Option[];
  selectedIds?: string[];
  onChange?: (id: string, checked: boolean) => void;
  error?: string;
}> = ({ label, options, selectedIds = [], onChange = () => {}, error }) => (
  <div>
    <div className="flex items-center mb-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Info className="w-4 h-4 ml-1 text-black" />
    </div>
    {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {options.map((option) => (
        <CheckboxCard
          key={option.id}
          id={option.id}
          label={option.name}
          checked={selectedIds.includes(option.id)}
          onChange={(checked) => onChange(option.id, checked)}
        />
      ))}
    </div>
  </div>
);

"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import CheckboxCard from "@/components/generic/ui/CheckboxCard";
import DurationInput from "@/components/generic/ui/DurationInput";
import { Info } from "lucide-react";
import clsx from "clsx";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Stepper from "@/components/generic/Stepper";
import Button from "@/components/generic/ui/Button";
import { useVehicleStep5 } from "@/lib/hooks/onboarding/steps/useVehicleStep5";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

const durationUnits: Option[] = [
  { id: "DAYS", name: "Days" },
  // { id: "WEEKS", name: "Weeks" },
];
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
    geofenceAreaOptions,
    discountDurations,
    handleInputChange,
    handleSelectChange,
    handleDurationChange,
    handleCheckboxChange,
    handlePriceChange,
    handleDiscountChange,
    handleSubmit,
  } = useVehicleStep5(vehicleId);

  const selectedBookingTypes = React.useMemo(() => {
    return bookingTypes.filter((bt) =>
      formData.supportedBookingTypeIds.includes(bt.id)
    );
  }, [bookingTypes, formData.supportedBookingTypeIds]);

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
                  formData.maxTripDuration.unit
                )
              }
              onUnitChange={(newOption) =>
                handleDurationChange(
                  "maxTripDuration",
                  formData.maxTripDuration.value,
                  newOption?.id || "DAYS"
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
                  formData.advanceNotice.unit
                )
              }
              onUnitChange={(newOption) =>
                handleDurationChange(
                  "advanceNotice",
                  formData.advanceNotice.value,
                  newOption?.id || "DAYS"
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

          <FormSection title="Booking & Areas" gridCols="1">
            <CheckboxGroup
              label="Supported Booking Types"
              options={bookingTypeOptions}
              selectedIds={formData.supportedBookingTypeIds}
              onChange={(id, checked) =>
                handleCheckboxChange("supportedBookingTypeIds", id, checked)
              }
            />
            <CheckboxGroup
              label="Out of Bounds Areas"
              options={geofenceAreaOptions}
              selectedIds={formData.outOfBoundsAreaIds}
              onChange={(id, checked) =>
                handleCheckboxChange("outOfBoundsAreaIds", id, checked)
              }
            />
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
                  Please select one or more "Supported Booking Types" above to
                  set their prices.
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

  if (!vehicleId) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: No vehicle ID found in the URL.
      </div>
    );
  }

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
        gridCols === "2" && "md:grid-cols-2"
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
    <div className="flex items-center">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Info className="w-4 h-4 ml-1 text-black" />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
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

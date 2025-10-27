// app/components/steps/Step2.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";

// Import UI Components
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import CheckboxCard from "@/components/generic/ui/CheckboxCard";
import Stepper from "@/components/generic/Stepper";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Button from "@/components/generic/ui/Button";

// Import the new hook
import { useVehicleDetails } from "@/lib/hooks/onboarding/steps/useVehicleStep2";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

const states: Option[] = [
  { id: "abia", name: "Abia" },
  { id: "accra", name: "Accra" },
  { id: "adamawa", name: "Adamawa" },
  { id: "akwa ibom", name: "Akwa Ibom" },
  { id: "anambra", name: "Anambra" },
  { id: "bauchi", name: "Bauchi" },
  { id: "bayelsa", name: "Bayelsa" },
  { id: "benue", name: "Benue" },
  { id: "borno", name: "Borno" },
  { id: "cross river", name: "Cross River" },
  { id: "delta", name: "Delta" },
  { id: "ebonyi", name: "Ebonyi" },
  { id: "edo", name: "Edo" },
  { id: "ekiti", name: "Ekiti" },
  { id: "enugu", name: "Enugu" },
  { id: "gombe", name: "Gombe" },
  { id: "imo", name: "Imo" },
  { id: "jigawa", name: "Jigawa" },
  { id: "kaduna", name: "Kaduna" },
  { id: "kano", name: "Kano" },
  { id: "katsina", name: "Katsina" },
  { id: "kebbi", name: "Kebbi" },
  { id: "kogi", name: "Kogi" },
  { id: "kwara", name: "Kwara" },
  { id: "lagos", name: "Lagos" },
  { id: "nasarawa", name: "Nasarawa" },
  { id: "niger", name: "Niger" },
  { id: "ogun", name: "Ogun" },
  { id: "ondo", name: "Ondo" },
  { id: "osun", name: "Osun" },
  { id: "oyo", name: "Oyo" },
  { id: "plateau", name: "Plateau" },
  { id: "rivers", name: "Rivers" },
  { id: "sokoto", name: "Sokoto" },
  { id: "taraba", name: "Taraba" },
  { id: "yobe", name: "Yobe" },
  { id: "zamfara", name: "Zamfara" },
  { id: "abuja", name: "Abuja FCT" },
];

const currentStep = 2;

/**
 * This is the child component that contains the actual form.
 * It now receives vehicleId as a prop and can trust it exists.
 */
function VehicleDetailsForm({ vehicleId }: { vehicleId: string }) {
  const {
    formData,
    colors,
    features,
    isLoading,
    isLoadingSession,
    isUpdating,
    error,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit,
  } = useVehicleDetails(vehicleId); // No more "|| """

  // Show loader while fetching public data OR session
  if (isLoading || isLoadingSession) {
    return <CustomLoader />;
  }

  // Handle query error
  if (error) {
    // The toast will already be shown by the hook if it fails
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      <div className="lg:col-span-2">
        {/* Disable entire form while updating */}
        <fieldset
          disabled={isUpdating}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
        >
          <TextInput
            label="License Plate Number"
            id="licensePlateNumber"
            placeholder="e.g., ABC-123"
            value={formData.licensePlateNumber}
            onChange={handleInputChange}
          />
          <Select
            label="State of Registration"
            options={states}
            placeholder="Select state"
            selected={
              // ✅ FIX: Find by comparing lowercase IDs, as API might send "Edo" or "abuja"
              states.find(
                (s) =>
                  s.id.toLowerCase() ===
                  formData.stateOfRegistration?.toLowerCase()
              ) || null
            }
            onChange={(option) =>
              handleSelectChange("stateOfRegistration", option)
            }
          />
          <Select
            label="Vehicle Color"
            options={colors}
            placeholder="Select color"
            selected={
              // This logic is correct and should work
              colors.find((c) => c.id === formData.vehicleColorId) || null
            }
            onChange={(option) => handleSelectChange("vehicleColorId", option)}
          />
          <TextInput
            label="Number of Seats"
            id="numberOfSeats"
            type="number"
            min="1"
            placeholder="e.g., 5"
            value={formData.numberOfSeats}
            onChange={handleInputChange}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Description"
              id="description"
              placeholder="Tell renters about your vehicle, its condition, and any special features..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Features
              </label>
              <Info className="w-4 h-4 ml-1 text-black" />
            </div>

            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* This logic is correct: It maps ALL features and checks the ones in formData */}
              {features.map((feature) => (
                <CheckboxCard
                  key={feature.id}
                  id={feature.id}
                  label={feature.name}
                  checked={formData.featureIds.includes(feature.id)}
                  onChange={(isChecked) =>
                    handleCheckboxChange(feature.id, isChecked)
                  }
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-between gap-4 pt-4">
            <Link
              href={`/dashboard/onboarding?id=${vehicleId}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-[#0096FF] text-sm font-medium shadow-sm text-white bg-[#0096FF] hover:bg-[#007ACC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Basic Details
            </Link>
            <Button
              type="submit"
              isLoading={isUpdating}
              disabled={isUpdating || isLoadingSession}
            >
              {isUpdating ? "Saving..." : "Documents"}
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

/**
 * This is the wrapper component that reads the URL search params
 */
function Step2Content() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  if (!vehicleId) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: No vehicle ID found in the URL.
      </div>
    );
  }

  return <VehicleDetailsForm vehicleId={vehicleId} />;
}

/**
 * This is the main default export, which handles Suspense
 */
export default function Step2() {
  return (
    <div className="relative min-h-screen pb-24 bg-white">
      <Stepper currentStep={currentStep} />
      <main className="max-w-8xl mt-8">
        <Suspense fallback={<CustomLoader />}>
          <Step2Content />
        </Suspense>
      </main>
    </div>
  );
}

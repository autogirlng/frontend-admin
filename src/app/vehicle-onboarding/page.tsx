import React from "react";
import PageLayout from "../components/dashboard/PageLayout";
import StepIndicator from "../components/vehicle-onboarding/StepIndicator";
import TipsCard from "../components/core/TipsCard";
import { FaUser } from "react-icons/fa";
import VehicleForm from "./VehicleForm";
import AdditionalVehicleForm from "./AdditionalVehicleForm";
import PhotoForm from "./PhotoForm";
import AvailabilityAndPricingForm from "./AvailabilityAndPricing";
import VehicleSummary from "./Summary";

const steps = [
  "Basic Vehicle Information",
  "Additional Vehicle Information",
  "Photos",
  "Availability and Pricing",
  "Summary",
];

const VehicleOnboarding: React.FC = () => (
  <PageLayout
    buttons={
      <div className="flex space-x-2">
        <button className="bg-gray-200 px-4 py-2 rounded-md">Save Draft</button>
        <button className="bg-[#005EFF] text-white px-4 py-2 rounded-md">
          Next
        </button>
      </div>
    }
  >
    {/* Header Section */}
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
      {/* Host Information */}
    </div>

    {/* Step Indicator */}
    <StepIndicator currentStep={0} steps={steps} />

    <VehicleSummary />
  </PageLayout>
);

export default VehicleOnboarding;

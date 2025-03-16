import React from "react";
import { FaCheckCircle, FaChevronRight } from "react-icons/fa";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-0.5"> {steps[currentStep]}</h2>
      <div className="flex items-center justify-around w-full mx-auto mb-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center space-x-1">
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border ${
                index < currentStep
                  ? "bg-[#005EFF] text-white border-[#005EFF]" // Completed
                  : index === currentStep
                  ? "bg-gray-600 text-white border-gray-600" // Current
                  : "border-gray-400 text-gray-400" // Incomplete
              }`}
            >
              {index < currentStep ? <FaCheckCircle /> : index + 1}
            </div>

            {/* Step Text (Hidden on Mobile) */}
            <span className="hidden sm:block text-sm whitespace-nowrap">
              {step}
            </span>

            {/* Step Separator */}
            {index < steps.length - 1 && (
              <span className="mx-2 text-gray-400 text-lg">
                <FaChevronRight />
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default StepIndicator;

"use client";
import clsx from "clsx";
import React from "react"; // Import React for the Fragment

const steps = [
  "Basic Details",
  "Additional Details",
  "Documents",
  "Photos",
  "Availability and Pricing",
];

type StepperProps = {
  currentStep: number;
};

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <nav className="flex items-center py-6 mt-5" aria-label="Progress">
      <ol role="list" className="flex w-full items-center">
        {steps.map((name, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            // Use a Fragment (or <>) to render the step and its connector
            <React.Fragment key={name}>
              <li>
                {/* This div now stacks the number and text vertically */}
                <div className="flex flex-col items-center text-sm font-medium">
                  <span
                    className={clsx(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                      isActive && "bg-[#0096FF] text-white",
                      isCompleted && "bg-gray-300 text-gray-800",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                    )}
                  >
                    {stepNumber}
                  </span>
                  <span
                    className={clsx(
                      "mt-2 text-sm font-medium", // Changed from "ml-3" to "mt-2"
                      isActive && "text-[#0096FF]",
                      isCompleted && "text-gray-700",
                      !isActive && !isCompleted && "text-gray-500"
                    )}
                  >
                    {name}
                  </span>
                </div>
              </li>

              {/* Connector line (unchanged) */}
              {stepNumber < steps.length && (
                <li
                  className="flex-1 px-4" // This 'li' is the connector and will grow
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-300" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

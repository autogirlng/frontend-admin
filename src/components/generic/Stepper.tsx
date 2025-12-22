"use client";

import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const steps = [
  { name: "Basic Details", route: "" },
  { name: "Additional Details", route: "details" },
  { name: "Documents", route: "documents" },
  { name: "Photos", route: "photos" },
  { name: "Availability and Pricing", route: "pricing" },
];

type StepperProps = {
  currentStep: number;
};

export default function Stepper({ currentStep }: StepperProps) {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");
  const activeStepInfo = steps[currentStep - 1] || steps[0];

  return (
    <div className="w-full py-4 mt-5">
      <div className="block md:hidden mb-6 px-1">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Step {currentStep} of {steps.length}
            </p>
            <h2 className="text-lg font-bold text-gray-900 mt-1">
              {activeStepInfo.name}
            </h2>
          </div>
          <span className="text-xs font-medium text-[#0096FF]">
            {Math.round(((currentStep - 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="flex gap-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;
            const href = vehicleId
              ? `/dashboard/onboarding/${step.route}?id=${vehicleId}`
              : "#";

            return (
              <Link
                key={step.name}
                href={href}
                className={clsx(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  !vehicleId && "pointer-events-none",
                  isActive ? "bg-[#0096FF]" : "",
                  isCompleted ? "bg-[#0096FF]/60" : "",
                  !isActive && !isCompleted ? "bg-gray-200" : ""
                )}
                aria-label={`Go to step ${step.name}`}
              />
            );
          })}
        </div>
      </div>
      <nav className="hidden md:flex items-center" aria-label="Progress">
        <ol role="list" className="flex w-full items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            const href = vehicleId
              ? `/dashboard/onboarding/${step.route}?id=${vehicleId}`
              : "#";

            return (
              <React.Fragment key={step.name}>
                <li className="relative">
                  <Link
                    href={href}
                    className={clsx(
                      "flex flex-col items-center text-sm font-medium transition-colors group",
                      !vehicleId && "pointer-events-none opacity-50"
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors border-2",
                        isActive &&
                          "bg-[#0096FF] border-[#0096FF] text-white shadow-md",
                        isCompleted &&
                          "bg-white border-[#0096FF] text-[#0096FF] hover:bg-[#0096FF] hover:text-white",
                        !isActive &&
                          !isCompleted &&
                          "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </span>
                    <span
                      className={clsx(
                        "mt-2 text-sm font-medium absolute top-full w-32 text-center -left--1/2",
                        isActive && "text-[#0096FF]",
                        isCompleted && "text-gray-700",
                        !isActive && !isCompleted && "text-gray-500"
                      )}
                    >
                      {step.name}
                    </span>
                  </Link>
                </li>
                {stepNumber < steps.length && (
                  <li className="flex-1 px-4 mb-8" aria-hidden="true">
                    <div
                      className={clsx(
                        "h-0.5 w-full transition-colors",
                        isCompleted ? "bg-[#0096FF]" : "bg-gray-200"
                      )}
                    />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

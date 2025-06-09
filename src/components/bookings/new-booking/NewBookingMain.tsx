"use client";

import React, { useState } from "react";
import cn from "classnames";
import BackLink from "@/components/BackLink";
import { Stepper } from "@/components/shared/stepper";
import { FullPageSpinner } from "@/components/shared/spinner";
import { LocalRoute } from "@/utils/LocalRoutes";
import { useAppSelector } from "@/lib/hooks";
import HostInformationCard from "@/components/cards/HostCard";
import DailyRental from "./DailyRental";
import SelectCustomerComponent from "./NewBookingComponent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const steps = [
  "Booking Details",
  "Vehicle Selection", // You can add more steps here as needed
  "Payment Details",
];

export default function NewBookingMain() {
  const { host } = useAppSelector((state) => state.host);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showStepper, setShowStepper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCurrentStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleCustomerSelected = (customer: any) => {
    setSelectedCustomer(customer);
    setShowStepper(true); // Show stepper after customer is selected
  };

  const handleBackToCustomerSelection = () => {
    setShowStepper(false);
    setSelectedCustomer(null);
    setCurrentStep(0);
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <main className="">
      <div>
        {!showStepper ? (
          // Show customer selection without stepper
          <SelectCustomerComponent
            onCustomerSelect={handleCustomerSelected}
            selectedCustomer={selectedCustomer}
          />
        ) : (
          // Show stepper starting with DailyRental
          <DashboardLayout title="New Booking" currentPage="Bookings">
            <div style={{ margin: "50px 0" }} />
            <Stepper steps={steps} currentStep={currentStep}>
              {currentStep === 0 && (
                <DailyRental
                  steps={steps}
                  currentStep={currentStep}
                  setCurrentStep={handleCurrentStep}
                  selectedCustomer={selectedCustomer}
                  onBack={handleBackToCustomerSelection}
                />
              )}
              {currentStep === 1 && (
                <div className="p-8 text-center">
                  <h2 className="text-xl font-semibold">Vehicle Selection</h2>
                  <p className="text-gray-600 mt-2">
                    Vehicle selection component goes here
                  </p>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="p-8 text-center">
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                  <p className="text-gray-600 mt-2">
                    Payment details component goes here
                  </p>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => console.log("Submit booking")}
                      className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                    >
                      Complete Booking
                    </button>
                  </div>
                </div>
              )}
            </Stepper>
          </DashboardLayout>
        )}
      </div>
    </main>
  );
}

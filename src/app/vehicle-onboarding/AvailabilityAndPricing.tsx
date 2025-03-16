"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaCheck } from "react-icons/fa"; // ✅ Import checkmark icon
import InputField from "../components/core/form-field/InputField";
import SelectInputField from "../components/core/form-field/SelectField";
import CheckboxGroup from "../components/core/form-field/CheckboxGroup";

// Initial Form Values
const initialValues = {
  advanceNotice: "",
  minimumTripDuration: "",
  maximumTripDuration: "",
  driverAvailable: "",
  fuelProvided: "",
  dailyRate: "",
  hourlyRate: "",
  airportRate: "",
  discount3: "",
  discount7: "",
  discount30: "",
  extraCharge: "",
  regularFee: "",
  guestFee: "",
  outskirtLocations: [],
};

// Validation Schema
const validationSchema = Yup.object({
  advanceNotice: Yup.string().required("Required"),
  minimumTripDuration: Yup.string().required("Required"),
  maximumTripDuration: Yup.string().required("Required"),
  driverAvailable: Yup.string().required("Required"),
  fuelProvided: Yup.string().required("Required"),
  dailyRate: Yup.string().required("Required"),
  hourlyRate: Yup.string().required("Required"),
  airportRate: Yup.string().required("Required"),
  discount3: Yup.string().required("Required"),
  discount7: Yup.string().required("Required"),
  discount30: Yup.string().required("Required"),
  extraCharge: Yup.string().required("Required"),
  regularFee: Yup.string().required("Required"),
  guestFee: Yup.string().required("Required"),
});

// Form Sections
const sections = [
  { key: "advanceNotice", label: "Advance Notice" },
  { key: "tripDuration", label: "Trip Duration" },
  { key: "additionalServices", label: "Additional Services" },
  { key: "pricing", label: "Pricing" },
  { key: "discounts", label: "Discounts" },
  { key: "outskirtLocations", label: "Outskirt Locations" },
];

const AvailabilityAndPricingForm = () => {
  const [activeSection, setActiveSection] = useState("advanceNotice");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values }) => {
        // Determine if a section is completed
        const isSectionComplete = (key: string) =>
          Array.isArray(values[key as keyof typeof values])
            ? (values[key as keyof typeof values] as any[]).length > 0
            : !!values[key as keyof typeof values];
        return (
          <Form className="w-full mx-auto p-6">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between mb-4 overflow-x-auto">
              {sections.map((section, index) => {
                const isActive = activeSection === section.key;
                const isComplete = isSectionComplete(section.key);

                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isComplete
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isComplete ? <FaCheck /> : index + 1}
                  </button>
                );
              })}
            </div>

            {/* Section-wise Display */}
            {activeSection === "advanceNotice" && (
              <div>
                <h2 className="text-lg font-semibold">
                  How much advance notice do you need before the trip starts?
                </h2>
                <SelectInputField
                  name="advanceNotice"
                  label="Advance Notice"
                  options={["1 day", "2 days", "3 days", "1 week"]}
                />
              </div>
            )}

            {activeSection === "tripDuration" && (
              <div>
                <h2 className="text-lg font-semibold">
                  What is the shortest and longest trip you will accept?
                </h2>
                <SelectInputField
                  name="minimumTripDuration"
                  label="Minimum Trip Duration"
                  options={["1 day", "2 days", "3 days"]}
                />
                <SelectInputField
                  name="maximumTripDuration"
                  label="Maximum Trip Duration"
                  options={["1 day", "1 week", "1 month"]}
                />
              </div>
            )}

            {activeSection === "additionalServices" && (
              <div>
                <h2 className="text-lg font-semibold">Vehicle Availability</h2>
                <SelectInputField
                  name="driverAvailable"
                  label="Will you provide a driver?"
                  options={["Yes", "No"]}
                />
                <SelectInputField
                  name="fuelProvided"
                  label="Will you provide at least 20 liters of fuel?"
                  options={["Yes", "No"]}
                />
              </div>
            )}

            {activeSection === "pricing" && (
              <div>
                <h2 className="text-lg font-semibold">Pricing</h2>
                <InputField name="dailyRate" label="What is the daily rate?" />
                <InputField
                  name="hourlyRate"
                  label="What is your extra hourly rate?"
                />
                <InputField
                  name="airportRate"
                  label="Airport pickups & drop-offs (optional)"
                />
              </div>
            )}

            {activeSection === "discounts" && (
              <div>
                <h2 className="text-lg font-semibold">Discounts</h2>
                <InputField name="discount3" label="3+ days trips discount" />
                <InputField name="discount7" label="7+ days trips discount" />
                <InputField name="discount30" label="30+ days trips discount" />
              </div>
            )}

            {activeSection === "outskirtLocations" && (
              <div>
                <h2 className="text-lg font-semibold">
                  Uncheck locations you do not want to visit with your vehicle
                </h2>
                <CheckboxGroup
                  label=""
                  name="outskirtLocations"
                  options={["Lagos", "Abuja", "Port Harcourt", "Kano"]}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="text-blue-600"
                disabled={activeSection === sections[0].key}
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.key === activeSection
                  );
                  setActiveSection(sections[currentIndex - 1].key);
                }}
              >
                Previous
              </button>

              <button type="button" className="text-gray-600">
                Save Draft
              </button>

              <button
                type="button"
                className="text-blue-600"
                disabled={activeSection === sections[sections.length - 1].key}
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.key === activeSection
                  );
                  setActiveSection(sections[currentIndex + 1].key);
                }}
              >
                Next
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AvailabilityAndPricingForm;

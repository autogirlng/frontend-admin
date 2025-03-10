"use client";

import React, { useState, useCallback } from "react";
import { Formik, Form } from "formik";
import InputField from "@/app/components/core/InputField";
import { hostOnboardingSchema } from "@/app/validators/HostOnboardingSchema";

const HostOnboarding: React.FC = () => {
  const [isBusinessActive, setIsBusinessActive] = useState(false);

  const handleToggleBusiness = useCallback(() => {
    setIsBusinessActive((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {/* Cancel Button */}
        <button
          type="button"
          className="text-blue-600 font-medium mb-4"
          aria-label="Cancel"
        >
          ← Cancel
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">Host Onboarding</h2>
        <p className="text-gray-600 text-sm mb-6">
          Seamlessly onboard new hosts and manage their details for a smooth
          listing experience.
        </p>

        {/* FORM */}
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            businessName: "",
            businessAddress: "",
            businessPhone: "",
            businessEmail: "",
            onboardBy: "",
            attachment: null,
          }}
          validationSchema={hostOnboardingSchema}
          onSubmit={(values) => {
            console.log("Form Submitted:", values);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">
              {/* Host Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Host Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <InputField name="firstName" label="First Name" />
                  <InputField name="lastName" label="Last Name" />
                  <InputField name="phone" label="Phone Number" type="tel" />
                  <InputField name="email" label="Email" type="email" />
                </div>

                {/* Toggle Switch */}
                <div className="mt-5 flex items-center">
                  <label
                    htmlFor="business-toggle"
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      id="business-toggle"
                      type="checkbox"
                      className="hidden"
                      checked={isBusinessActive}
                      onChange={handleToggleBusiness}
                      aria-label="Toggle business operation"
                    />
                    <div
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                        isBusinessActive ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                          isBusinessActive ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </label>
                  <span className="ml-3 text-gray-700">
                    Is Host Operating as a Business?
                  </span>
                </div>
              </div>

              {/* Business Information - Only Visible When Toggle is On */}
              {isBusinessActive && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <InputField name="businessName" label="Business Name" />
                    <InputField
                      name="businessAddress"
                      label="Business Address"
                    />
                    <InputField
                      name="businessPhone"
                      label="Business Phone Number"
                      type="tel"
                    />
                    <InputField
                      name="businessEmail"
                      label="Business Email"
                      type="email"
                    />
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {/* Dropdown for Onboard By */}
                  <div>
                    <label
                      htmlFor="onboardBy"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Onboard By
                    </label>
                    <select
                      id="onboardBy"
                      name="onboardBy"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Admin</option>
                      <option value="admin1">Admin 1</option>
                      <option value="admin2">Admin 2</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label
                      htmlFor="attachment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Attachment (Optional)
                    </label>
                    <input
                      id="attachment"
                      type="file"
                      name="attachment"
                      onChange={(event) => {
                        setFieldValue(
                          "attachment",
                          event.currentTarget.files?.[0] || null
                        );
                      }}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition"
              >
                Submit →
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default HostOnboarding;

"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import InputField from "@/components/core/form-field/InputField";
import { hostOnboardingSchema } from "@/validators/HostOnboardingSchema";
import PageLayout from "@/components/dashboard/PageLayout";
import CurvedFilledButton from "@/components/core/button/CurvedFilledButton";
import PhoneInputField from "@/components/core/form-field/PhoneInputField";
import FileInputField from "@/components/core/form-field/FileInputField";

const HostOnboarding: React.FC = () => {
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  return (
    <PageLayout
      >
      <div className="min-h-screen py-10 flex justify-start">
        <div className="w-full lg:w-[70%] lg:ml-10 rounded-xl transition-all duration-300">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Host Onboarding
          </h2>
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
              isBusinessActive: false,
              businessName: "",
              businessAddress: "",
              businessPhone: "",
              businessEmail: "",
              onboardBy: "",
              attachment: null,
            }}
            validationSchema={hostOnboardingSchema}
            onSubmit={() => {}}
            validate={(values) => {
              const isValid = hostOnboardingSchema.isValidSync(values);
              setIsFormValid(isValid);
              setIsFormDirty(
                Object.values(values).some((val) => val !== "" && val !== null)
              );
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Host Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Host Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <InputField
                      name="firstName"
                      placeholder="Enter First Name"
                      label="First Name"
                    />
                    <InputField
                      name="lastName"
                      placeholder="Enter Last Name"
                      label="Last Name"
                    />
                  </div>
                  <PhoneInputField name="phone" label="Phone" />
                  <InputField
                    name="email"
                    label="Email"
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>

                {/* Business Toggle */}
                <div className="mt-5 flex items-center">
                  <label
                    htmlFor="business-toggle"
                    className="flex items-center cursor-pointer"
                  >
                    <span className="mr-3 text-gray-700">
                      Is Host Operating as a Business?
                    </span>
                    <input
                      id="business-toggle"
                      type="checkbox"
                      className="hidden"
                      checked={values.isBusinessActive}
                      onChange={(e) =>
                        setFieldValue("isBusinessActive", e.target.checked)
                      }
                    />
                    <div
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                        values.isBusinessActive ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                          values.isBusinessActive ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>

                {/* Business Information (Only Visible When Toggle is On) */}
                {values.isBusinessActive && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Business Information
                    </h3>
                    <InputField name="businessName" label="Business Name" />
                    <InputField
                      name="businessAddress"
                      label="Business Address"
                    />
                    <PhoneInputField
                      name="businessPhone"
                      label="Business Phone Number"
                      placeholder="Enter business Phone Number"
                    />
                    <InputField
                      name="businessEmail"
                      label="Business Email"
                      type="email"
                    />

                    {/* Additional Details */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      Additional Details
                    </h3>

                    {/* Dropdown for Onboard By */}
                    <div className="mb-3">
                      <label
                        htmlFor="onboardBy"
                        className="block text-sm font-semibold text-[#101928]"
                      >
                        Onboarded By
                      </label>
                      <select
                        id="onboardBy"
                        name="onboardBy"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 appearance-none"
                        onChange={(e) =>
                          setFieldValue("onboardBy", e.target.value)
                        }
                      >
                        <option value="" disabled className="text-gray-400">
                          Select an Admin
                        </option>
                        {["Admin 1", "Admin 2", "Super Admin"].map(
                          (admin, index) => (
                            <option
                              key={index}
                              value={admin.toLowerCase().replace(/\s/g, "")}
                              className="capitalize"
                            >
                              {admin}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* File Upload */}
                    <FileInputField
                      setFieldValue={setFieldValue}
                      name="attachment"
                      label="Attachment (optional)"
                      placeholder="Upload signed MOU by host"
                    />
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </PageLayout>
  );
};

export default HostOnboarding;

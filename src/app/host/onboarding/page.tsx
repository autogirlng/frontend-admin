"use client";

import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { getCountryCallingCode } from "react-phone-number-input";
import { hostOnboardingValues } from "@/utils/initialValues";
import { replaceCharactersWithString } from "@/utils/functions";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/inputField";
import PhoneNumberAndCountryField from "@/components/shared/phoneNumberAndCountryField";
import FileInputField from "@/components/shared/fileInputField";
import { GroupCheckBox } from "@/components/shared/checkbox";
import { useHostOnboarding, useTeamMembers } from "@/hooks/use_host";
import { FaChevronLeft } from "react-icons/fa";
import { FullPageSpinner, Spinner } from "@/components/shared/spinner";
import SelectInput from "@/components/shared/select";
import { hostFormValidationSchema } from "@/validators/HostOnboardingSchema";
import AppSwitch from "@/components/shared/switch";

const outskirtsLocationOptions = ["Lagos", "Accra", "Abuja", "Benin", "Others"];

export default function HostOnboardingPage() {
  const { hostMutation } = useHostOnboarding();
  const { data: members, isLoading } = useTeamMembers();

  const onboardedByOptions = (members || []).map((member) => ({
    value: member.email,
    option: ` ${member.firstName} ${member.lastName}`,
  }));

  const router = useRouter();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col  w-full">
      <div className="w-full mx-auto space-y-5 py-4 px-4 sm:px-6 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => router.back()}
            className="text-[#005EFF] flex items-center hover:underline"
          >
            <FaChevronLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="w-full max-w-2xl ml-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Host Onboarding
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Sustainably oriented user hosts and message their details for a
            smooth listing experience.
          </p>

          <div className="space-y-10 flex-grow flex flex-col">
            <Formik
              initialValues={hostOnboardingValues}
              onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                const submissionValues = { ...values };
                hostMutation.mutate(submissionValues);
                setSubmitting(false);
              }}
              validationSchema={hostFormValidationSchema}
              enableReinitialize={true}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  isValid,
                  handleBlur,
                  handleChange,
                  setFieldValue,
                  setFieldTouched,
                  isSubmitting,
                } = props;

                const isLoadingOrSubmitting =
                  isSubmitting || hostMutation.isPending;

                return (
                  <Form
                    className="space-y-6 flex flex-col flex-grow"
                    autoComplete="off"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      Host Information
                    </h3>

                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <InputField
                          name="firstName"
                          id="firstName"
                          type="text"
                          label="First name"
                          placeholder="Enter first name"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.firstName && touched.firstName
                              ? errors.firstName
                              : ""
                          }
                        />
                        <InputField
                          name="lastName"
                          id="lastName"
                          type="text"
                          label="Last name"
                          placeholder="Enter last name"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.lastName && touched.lastName
                              ? errors.lastName
                              : ""
                          }
                        />
                      </div>

                      <PhoneNumberAndCountryField
                        inputName="phoneNumber"
                        selectName="country"
                        inputId="phoneNumber"
                        selectId="country"
                        label="Phone Number"
                        inputPlaceholder="Enter phone number"
                        selectPlaceholder="+234"
                        inputValue={values.phoneNumber}
                        selectValue={values.country}
                        inputOnChange={(event) => {
                          const number = replaceCharactersWithString(
                            event.target.value
                          );
                          setFieldTouched("phoneNumber", true);
                          setFieldValue("phoneNumber", number);
                        }}
                        selectOnChange={(value: string) => {
                          const countryCode = `+${getCountryCallingCode(
                            value as any
                          )}`;
                          setFieldValue("country", value);
                          setFieldValue("countryCode", countryCode);
                        }}
                        inputOnBlur={handleBlur}
                        selectOnBlur={(e) => setFieldTouched("country", true)}
                        selectClassname="!w-[130px]"
                        inputError={
                          errors.phoneNumber && touched.phoneNumber
                            ? errors.phoneNumber
                            : ""
                        }
                        selectError={
                          errors.country && touched.country
                            ? errors.country
                            : ""
                        }
                      />

                      <InputField
                        name="email"
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="Enter email address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.email && touched.email ? errors.email : ""
                        }
                      />

                      <div>
                        <label
                          htmlFor="operatingCities"
                          className="text-sm block font-medium text-black mb-2"
                        >
                          Operating Cities
                        </label>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {outskirtsLocationOptions.map((feature) => (
                            <GroupCheckBox
                              key={feature}
                              feature={feature}
                              checkedValues={values.outskirtsLocation}
                              onChange={(
                                feature: string,
                                isChecked: boolean
                              ) => {
                                if (isChecked) {
                                  const newValues = [
                                    ...values.outskirtsLocation,
                                    feature,
                                  ];
                                  setFieldValue("outskirtsLocation", newValues);
                                } else {
                                  const newValues =
                                    values.outskirtsLocation.filter(
                                      (value) => value !== feature
                                    );
                                  setFieldValue("outskirtsLocation", newValues);
                                }
                                setFieldTouched("outskirtsLocation", true);
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <label
                          htmlFor="isOperatingAsBusiness"
                          className="text-sm font-medium text-gray-900"
                        >
                          Is Host Operating as a Business?
                        </label>
                        <AppSwitch
                          value={values.isOperatingAsBusiness}
                          onChange={(checked: boolean) => {
                            setFieldValue("isOperatingAsBusiness", checked);
                            setFieldTouched("isOperatingAsBusiness", true);
                          }}
                          name="isOperatingAsBusiness"
                          id="isOperatingAsBusiness"
                        />
                      </div>

                      {values.isOperatingAsBusiness && (
                        <>
                          <h3 className="text-xl font-semibold text-gray-800 mt-4">
                            Business Information
                          </h3>
                          <InputField
                            name="businessName"
                            id="businessName"
                            type="text"
                            label="Business name"
                            placeholder="Enter business name"
                            value={values.businessName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              errors.businessName && touched.businessName
                                ? errors.businessName
                                : ""
                            }
                          />
                          <InputField
                            name="businessAddress"
                            id="businessAddress"
                            type="text"
                            label="Business Address"
                            placeholder="Enter business address"
                            value={values.businessAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              errors.businessAddress && touched.businessAddress
                                ? errors.businessAddress
                                : ""
                            }
                          />

                          <PhoneNumberAndCountryField
                            inputName="businessNumber"
                            selectName="businessCountry"
                            inputId="businessNumber"
                            selectId="businessCountry"
                            label="Business Number"
                            inputPlaceholder="Enter business phone number"
                            selectPlaceholder="+234"
                            inputValue={values.businessNumber}
                            selectValue={values.businessCountry}
                            inputOnChange={(event) => {
                              const number = replaceCharactersWithString(
                                event.target.value
                              );
                              setFieldTouched("businessNumber", true);
                              setFieldValue("businessNumber", number);
                            }}
                            selectOnChange={(value: string) => {
                              const countryCode = `+${getCountryCallingCode(
                                value as any
                              )}`;
                              setFieldValue("businessCountry", value);
                              setFieldValue("businessCountryCode", countryCode);
                            }}
                            inputOnBlur={handleBlur}
                            selectOnBlur={(e) =>
                              setFieldTouched("businessCountry", true)
                            }
                            selectClassname="!w-[130px]"
                            inputError={
                              errors.businessNumber && touched.businessNumber
                                ? errors.businessNumber
                                : ""
                            }
                            selectError={
                              errors.businessCountry && touched.businessCountry
                                ? errors.businessCountry
                                : ""
                            }
                          />
                          <InputField
                            name="businessEmail"
                            id="businessEmail"
                            type="email"
                            label="Business Email"
                            placeholder="Enter business email address"
                            value={values.businessEmail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              errors.businessEmail && touched.businessEmail
                                ? errors.businessEmail
                                : ""
                            }
                          />
                        </>
                      )}

                      <h3 className="text-xl font-semibold text-gray-800">
                        Additional Details
                      </h3>
                      <SelectInput
                        id="onboardedBy"
                        label="Onboarded By"
                        placeholder="Select team member"
                        options={onboardedByOptions}
                        value={values.onboardedBy}
                        onChange={(value) => {
                          setFieldTouched("onboardedBy", true);
                          setFieldValue("onboardedBy", value);
                        }}
                        error={
                          touched.onboardedBy && errors.onboardedBy
                            ? (errors.onboardedBy as string)
                            : ""
                        }
                      />
                      <FileInputField
                        id="mou"
                        name="mou"
                        label="Attachment (optional)"
                        placeholder="Upload Signed MOU by host"
                        filePicker={true}
                        onFileSelect={(file: File) => {
                          setFieldValue("mou", file);
                          setFieldTouched("mou", true);
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.mou}
                        error={
                          errors.mou && touched.mou
                            ? (errors.mou as string)
                            : ""
                        }
                      />
                    </div>

                    <div className="mt-8 pb-8">
                      <Button
                        type="submit"
                        // loading={isLoadingOrSubmitting}
                        disabled={isLoadingOrSubmitting || !isValid}
                        className={
                          isValid && !isLoadingOrSubmitting
                            ? "bg-[#005EFF] rounded-full px-8 py-6 text-white hover:bg-[#0049CC] w-full"
                            : "bg-grey-600 rounded-full px-8 py-6 text-grey-200 cursor-not-allowed hover:bg-[#0049CC] w-full"
                        }
                      >
                        {isLoadingOrSubmitting && <Spinner />}
                        Submit
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

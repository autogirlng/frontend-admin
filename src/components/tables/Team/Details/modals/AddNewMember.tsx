// src/components/tables/Team/Details/modals/AddNewMember.tsx
"use client";
import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog";
import Button from "@/components/shared/button";
import InputField from "@/components/shared/inputField";
import PhoneNumberAndCountryField from "@/components/shared/phoneNumberAndCountryField";
import SelectInput from "@/components/shared/select";

import { UserRole } from "@/utils/types"; // Assuming UserRole is defined here or in enums

import { useFormik } from "formik";
import * as Yup from "yup";
import { getCountryCallingCode } from "libphonenumber-js";

import useAddMember from "../../hooks/useAddMember";

interface AddTeamMemberFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string; // e.g., "+234"
  country: string; // e.g., "NG" - ISO country code
  email: string;
  userRole: UserRole; // Ensure this matches userRole in payload
}

type AddTeamMemberProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
  isLoading: boolean;
};

const AddTeamMember = ({
  trigger,
  openModal,
  handleModal,
  isLoading: parentLoading, // Rename to avoid conflict with mutation's isLoading
}: AddTeamMemberProps) => {
  const { addMember, isLoading, isSuccess, isError } = useAddMember();

  // Handle successful submission from the hook
  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false); // Close modal on success
      // You might want to reset the form here
    }
  }, [isSuccess, handleModal]);

  const handleSubmitFormik = (values: AddTeamMemberFormData) => {
    const payload: AddTeamMemberFormData = {
      ...values,
      userRole: values.userRole,
    };
    addMember(payload);
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-2xl"
      title="Add Team Member"
      content={
        <AddTeamMemberContent
          handleModal={handleModal}
          // Pass the mutation function as onSubmit
          onSubmit={handleSubmitFormik}
          isLoading={parentLoading || isLoading} // Combine parent loading with mutation loading
          isMutationSuccess={isSuccess} // Pass success state to content if needed
        />
      }
    />
  );
};

export default AddTeamMember;

type AddTeamMemberContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: AddTeamMemberFormData) => void; // This is now the hook's mutation trigger
  isLoading: boolean;
  isMutationSuccess?: boolean; // Optional: to reset form when mutation succeeds
};

// Define role options for the SelectInput
const roleOptions = [
  { value: UserRole.Admin, option: "Admin" },
  { value: UserRole.CustomerSupport, option: "Customer Support" },
  { value: UserRole.FinanceManager, option: "Finance Manager" },
  { value: UserRole.OperationManager, option: "Operation Manager" },
  { value: UserRole.SuperAdmin, option: "Super Admin" },
];

// Utility function to replace characters (if still needed, adjust logic)
const replaceCharactersWithString = (value: string): string => {
  return value.replace(/[^0-9+]/g, "");
};

const AddTeamMemberContent = ({
  handleModal,
  onSubmit,
  isLoading,
  isMutationSuccess,
}: AddTeamMemberContentProps) => {
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    countryCode: Yup.string().required("Country code is required"),
    role: Yup.string().required("Role is required"), // Corresponds to userRole in payload
  });

  const formik = useFormik<AddTeamMemberFormData>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "NG", // Default country (e.g., Nigeria ISO code)
      countryCode: "+234", // Default country code
      phoneNumber: "",
      userRole: UserRole.CustomerSupport, // Default role, or leave empty if preferred
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Reset form when mutation is successful
  React.useEffect(() => {
    if (isMutationSuccess) {
      formik.resetForm();
    }
  }, [isMutationSuccess, formik]);

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={formik.handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InputField
            name="firstName"
            id="firstName"
            label="First name"
            placeholder="Enter first name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.firstName && formik.errors.firstName
                ? formik.errors.firstName
                : ""
            }
            required
          />
          <InputField
            name="lastName"
            id="lastName"
            label="Last name"
            placeholder="Enter last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.lastName && formik.errors.lastName
                ? formik.errors.lastName
                : ""
            }
            required
          />
        </div>
        <InputField
          name="email"
          id="email"
          label="Email"
          placeholder="Enter admin email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="email"
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""
          }
          required
        />
        <PhoneNumberAndCountryField
          inputName="phoneNumber"
          selectName="country"
          inputId="phoneNumber"
          selectId="country"
          label="Phone Number"
          inputPlaceholder="Enter phone number"
          selectPlaceholder="+234"
          inputValue={formik.values.phoneNumber}
          selectValue={formik.values.country}
          inputOnChange={(event) => {
            const number = replaceCharactersWithString(event.target.value);
            formik.setFieldTouched("phoneNumber", true);
            formik.setFieldValue("phoneNumber", number);
          }}
          selectOnChange={(value: string) => {
            formik.setFieldTouched("country", true);
            formik.setFieldValue("country", value);
            try {
              const callingCode = `+${getCountryCallingCode(value as any)}`;
              formik.setFieldValue("countryCode", callingCode);
            } catch (e) {
              console.error("Error getting country calling code:", e);
              formik.setFieldValue("countryCode", "");
            }
          }}
          inputOnBlur={formik.handleBlur}
          selectOnBlur={formik.handleBlur}
          selectClassname="!w-[130px]"
          inputError={
            formik.touched.phoneNumber && formik.errors.phoneNumber
              ? formik.errors.phoneNumber
              : ""
          }
          selectError={
            formik.touched.country && formik.errors.country
              ? formik.errors.country
              : ""
          }
        />

        <SelectInput
          id="userRole"
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={formik.values.userRole}
          onChange={(value) => {
            formik.setFieldTouched("userRole", true);
            formik.setFieldValue("userRole", value);
          }}
          error={
            formik.touched.userRole && formik.errors.userRole
              ? formik.errors.userRole
              : ""
          }
        />

        {/* You can conditionally render business fields here */}
        {/*
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isBusiness"
            name="isBusiness"
            checked={formik.values.isBusiness}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="isBusiness">Is this a business account?</label>
        </div>

        {formik.values.isBusiness && (
          <>
            <InputField
              name="businessName"
              id="businessName"
              label="Business Name"
              placeholder="Enter business name"
              value={formik.values.businessName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.businessName && formik.errors.businessName ? formik.errors.businessName : ""}
              required={formik.values.isBusiness}
            />
            <InputField
              name="businessAddress"
              id="businessAddress"
              label="Business Address"
              placeholder="Enter business address"
              value={formik.values.businessAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.businessAddress && formik.errors.businessAddress ? formik.errors.businessAddress : ""}
              required={formik.values.isBusiness}
            />
            <InputField
              name="businessPhoneNumber"
              id="businessPhoneNumber"
              label="Business Phone Number"
              placeholder="Enter business phone number"
              value={formik.values.businessPhoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.businessPhoneNumber && formik.errors.businessPhoneNumber ? formik.errors.businessPhoneNumber : ""}
              required={formik.values.isBusiness}
            />
            <InputField
              name="businessEmail"
              id="businessEmail"
              label="Business Email"
              placeholder="Enter business email"
              value={formik.values.businessEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              error={formik.touched.businessEmail && formik.errors.businessEmail ? formik.errors.businessEmail : ""}
              required={formik.values.isBusiness}
            />
          </>
        )}
        */}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            fullWidth
            className="!bg-grey-100 !text-grey-700 hover:!bg-grey-200"
            onClick={() => handleModal(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="filled"
            color="primary"
            type="submit"
            loading={isLoading} // This now comes from the useAddMember hook
            disabled={isLoading}
          >
            Add Team Member
          </Button>
        </div>
      </form>
    </div>
  );
};

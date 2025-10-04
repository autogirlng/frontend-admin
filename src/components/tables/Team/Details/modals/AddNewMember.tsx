"use client";
import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog";
import Button from "@/components/shared/button";
import InputField from "@/components/shared/inputField";
import PhoneNumberAndCountryField from "@/components/shared/phoneNumberAndCountryField";
import SelectInput from "@/components/shared/select";

import { UserRole } from "@/utils/types";

import { useFormik } from "formik";
import * as Yup from "yup";
import { getCountryCallingCode } from "libphonenumber-js";

import useAddMember from "../../hooks/useAddMember";

interface AddTeamMemberFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  email: string;
  userRole: UserRole;
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
  isLoading: parentLoading,
}: AddTeamMemberProps) => {
  const { addMember, isLoading, isSuccess } = useAddMember();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false);
    }
  }, [isSuccess, handleModal]);

  // WRAP IN useCALLBACK: Prevents `onSubmit` from causing re-renders
  const handleSubmitFormik = React.useCallback(
    (values: AddTeamMemberFormData) => {
      const payload: AddTeamMemberFormData = {
        ...values,
        userRole: values.userRole,
      };
      addMember(payload);
    },
    [addMember]
  );

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-2xl"
      title="Add Team Member"
      content={
        // PASSING THE COMPONENT DIRECTLY: This is now safe with React.memo
        <AddTeamMemberContent
          handleModal={handleModal}
          onSubmit={handleSubmitFormik}
          isLoading={parentLoading || isLoading}
          isMutationSuccess={isSuccess}
        />
      }
    />
  );
};

export default AddTeamMember;

type AddTeamMemberContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: AddTeamMemberFormData) => void;
  isLoading: boolean;
  isMutationSuccess?: boolean;
};

const roleOptions = [
  { value: UserRole.Admin, option: "Admin" },
  { value: UserRole.CustomerSupport, option: "Customer Support" },
  { value: UserRole.FinanceManager, option: "Finance Manager" },
  { value: UserRole.OperationManager, option: "Operation Manager" },
];

const replaceCharactersWithString = (value: string): string => {
  return value.replace(/[^0-9+]/g, "");
};

// WRAP IN REACT.MEMO: Prevents unnecessary re-renders of the form
const AddTeamMemberContent = React.memo(
  ({
    handleModal,
    onSubmit,
    isLoading,
    isMutationSuccess,
  }: AddTeamMemberContentProps) => {
    const validationSchema = Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      country: Yup.string().required("Country is required"),
      countryCode: Yup.string().required("Country code is required"),
      userRole: Yup.string().required("Role is required"),
    });

    const formik = useFormik<AddTeamMemberFormData>({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        country: "NG",
        countryCode: "+234",
        phoneNumber: "",
        userRole: UserRole.CustomerSupport,
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        onSubmit(values);
      },
    });

    // FIX: Use formik.resetForm directly, not formik in dependency array
    React.useEffect(() => {
      if (isMutationSuccess) {
        formik.resetForm();
      }
    }, [isMutationSuccess]); // Removed formik from dependency array

    // Memoize the phone number change handler to prevent re-renders
    const handlePhoneNumberChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = replaceCharactersWithString(event.target.value);
        formik.setFieldTouched("phoneNumber", true);
        formik.setFieldValue("phoneNumber", number);
      },
      [formik.setFieldTouched, formik.setFieldValue]
    );

    // Memoize the country change handler to prevent re-renders
    const handleCountryChange = React.useCallback(
      (value: string) => {
        formik.setFieldTouched("country", true);
        formik.setFieldValue("country", value);
        try {
          const callingCode = `+${getCountryCallingCode(value as any)}`;
          formik.setFieldValue("countryCode", callingCode);
        } catch (e) {
          console.error("Error getting country calling code:", e);
          formik.setFieldValue("countryCode", "");
        }
      },
      [formik.setFieldTouched, formik.setFieldValue]
    );

    // Memoize the role change handler to prevent re-renders
    const handleRoleChange = React.useCallback(
      (value: string) => {
        formik.setFieldTouched("userRole", true);
        formik.setFieldValue("userRole", value);
      },
      [formik.setFieldTouched, formik.setFieldValue]
    );

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
            inputOnChange={handlePhoneNumberChange}
            selectOnChange={handleCountryChange}
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
            onChange={handleRoleChange}
            error={
              formik.touched.userRole && formik.errors.userRole
                ? formik.errors.userRole
                : ""
            }
          />

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
              loading={isLoading}
              disabled={isLoading}
            >
              Add Team Member
            </Button>
          </div>
        </form>
      </div>
    );
  }
);
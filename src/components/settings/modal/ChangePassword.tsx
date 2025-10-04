"use client";
import React, { ReactNode, useState } from "react"; // Import useState
import { BlurredDialog } from "@/components/shared/dialog"; // Assuming this is your dialog component

import Button from "@/components/shared/button";
import InputField from "@/components/shared/inputField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Icons from "@/utils/Icon"; // Assuming you have an Icons component for checkmarks
import { CheckCircle, Cross } from "lucide-react"; // Using lucide-react as in your code
import useChangePassword from "../hook/change_password";

// Define the payload type for the form
interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

// Props for the content component
type ChangePasswordContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: ChangePasswordPayload) => void; // This is now the hook's mutation trigger
  isLoading: boolean;
  isMutationSuccess?: boolean; // Optional: to reset form when mutation succeeds
};

export const ChangePasswordContent = ({
  handleModal,
  onSubmit,
  isLoading,
  isMutationSuccess,
}: ChangePasswordContentProps) => {
  // State to track if the new password field has been interacted with (typed into)
  const [hasNewPasswordBeenTyped, setHasNewPasswordBeenTyped] = useState(false);

  // Regex for password validation rules
  const passwordRules = {
    length: (val: string) => val.length >= 8,
    uppercase: (val: string) => /[A-Z]/.test(val),
    lowercase: (val: string) => /[a-z]/.test(val),
    digit: (val: string) => /\d/.test(val),
    specialChar: (val: string) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
    noSpaces: (val: string) => !/\s/.test(val),
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Old password is required"),
    password: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least one special character"
      )
      .test("no-spaces", "Password must not include spaces", (value) =>
        passwordRules.noSpaces(value || "")
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik<ChangePasswordPayload>({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    // Add validateOnMount to immediately validate on load if needed, but not common for password fields
    // validateOnChange: true, // Formik validates on change by default if validationSchema is present
    // validateOnBlur: true,   // Formik validates on blur by default if validationSchema is present
  });

  // Reset form when mutation is successful
  React.useEffect(() => {
    if (isMutationSuccess) {
      formik.resetForm();
      setHasNewPasswordBeenTyped(false); // Reset the state as well
    }
  }, [isMutationSuccess, formik]);

  const passwordValue = formik.values.password;

  // Modify getValidationStatus to consider typing
  const getValidationStatus = (rule: (val: string) => boolean) => {
    // Show validation status only if user has started typing in the new password field
    if (!hasNewPasswordBeenTyped) return null;
    return rule(passwordValue);
  };

  // Handle change for the new password field to activate validation display
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasNewPasswordBeenTyped) {
      setHasNewPasswordBeenTyped(true); // Set to true on first type
    }
    formik.handleChange(e); // Pass the event to Formik's handler
  };

  const renderValidationItem = (text: string, isValid: boolean | null) => (
    <div
      className={`flex items-center gap-2 ${
        isValid === true
          ? "text-success-600"
          : isValid === false
          ? "text-error-500"
          : "text-grey-500"
      }`}
    >
      {isValid === true ? (
        <CheckCircle className="w-5 h-5 text-success-500" />
      ) : (
        <Cross className="w-5 h-5 text-error-500" />
      )}
      <span
        className={
          isValid === true
            ? "font-medium"
            : isValid === false
            ? "font-medium"
            : ""
        }
      >
        {text}
      </span>
    </div>
  );

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <InputField
          name="currentPassword"
          id="currentPassword"
          label="Old Password"
          placeholder="Enter your old password"
          type="password"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.currentPassword && formik.errors.currentPassword
              ? formik.errors.currentPassword
              : ""
          }
          required
        />
        <InputField
          name="password"
          id="password"
          label="New Password"
          placeholder="Enter your new password"
          type="password"
          value={formik.values.password}
          onChange={handleNewPasswordChange} // Use custom handler here
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""
          }
          required
        />
        {/* Password strength rules display - conditionally rendered */}
        {hasNewPasswordBeenTyped && ( // Show the box only if typing has started
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Password must include at least:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {renderValidationItem(
                "8 characters long",
                getValidationStatus(passwordRules.length)
              )}
              {renderValidationItem(
                "One digit",
                getValidationStatus(passwordRules.digit)
              )}
              {renderValidationItem(
                "One uppercase character",
                getValidationStatus(passwordRules.uppercase)
              )}
              {renderValidationItem(
                "One special character",
                getValidationStatus(passwordRules.specialChar)
              )}
              {renderValidationItem(
                "One lowercase character",
                getValidationStatus(passwordRules.lowercase)
              )}
              {renderValidationItem(
                "Must not include spaces",
                getValidationStatus(passwordRules.noSpaces)
              )}
            </div>
          </div>
        )}
        <InputField
          name="confirmPassword"
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your new password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : ""
          }
          required
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
            // Disable if form is invalid, or if no password has been typed yet
            disabled={isLoading || !formik.isValid || !hasNewPasswordBeenTyped}
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

// ... (ChangePasswordModal remains the same)
interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

type ChangePasswordModalProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode; // Element that triggers the modal (e.g., a button)
};

const ChangePasswordModal = ({
  trigger,
  openModal,
  handleModal,
}: ChangePasswordModalProps) => {
  const { mutate: changePassword, isPending, isSuccess } = useChangePassword();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false); // Close modal on successful password change
    }
  }, [isSuccess, handleModal]);

  const handleSubmitFormik = (values: ChangePasswordPayload) => {
    changePassword(values);
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-2xl"
      title="Change Password"
      content={
        <ChangePasswordContent
          handleModal={handleModal}
          onSubmit={handleSubmitFormik}
          isLoading={isPending}
          isMutationSuccess={isSuccess}
        />
      }
    />
  );
};

export default ChangePasswordModal;

// components/auth/NewPasswordForm.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/components/core/form-field/InputField";
import SubmitButton from "@/components/core/SubmitButton";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "@/hooks/use_auth";

// Password validation criteria (can be moved to a constants file or utility)
const passwordCriteria = [
  { label: "At least 8 characters long", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One digit", regex: /\d/ },
  { label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  { label: "No spaces", regex: /^\S*$/ },
];

// Yup validation schema
const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/\d/, "Must include at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must include at least one special character"
    )
    .matches(/^\S*$/, "Cannot contain spaces")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function NewPasswordForm() {
  const [isTyping, setIsTyping] = useState(false);

  const { resetPassword, isResetPasswordLoading } = useAuth();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  return (
    <Formik
      initialValues={{
        newPassword: "",
        confirmPassword: "",
        email: email,
        token: token,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await resetPassword(values); // Ensure resetPassword is awaited if it's async
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, errors, touched, isSubmitting }) => (
        <Form className="space-y-5">
          {/* Password Input */}
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={values.newPassword}
            onChange={(e) => {
              handleChange(e);
              setIsTyping(true);
            }}
            error={touched.newPassword && errors.newPassword}
          />

          {/* Password Validation Criteria */}
          {isTyping && (
            <div className="mt-3 p-3">
              {passwordCriteria.map(({ label, regex }, index) => {
                const isValid = regex.test(values.newPassword);
                return (
                  <div key={index} className="flex items-center text-sm">
                    {isValid ? (
                      <FaCheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <FaTimesCircle className="text-gray-400 mr-2" />
                    )}
                    <span
                      className={isValid ? "text-green-600" : "text-gray-500"}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirm Password Input */}
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={touched.confirmPassword && errors.confirmPassword}
          />

          {/* Submit Button */}
          <SubmitButton
            isLoading={isResetPasswordLoading || isSubmitting}
            text="Set Password"
          />
        </Form>
      )}
    </Formik>
  );
}

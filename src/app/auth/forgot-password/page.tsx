"use client";

import AuthLayout from "@/app/components/auth/AuthLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/app/components/core/form-field/InputField";
import SubmitButton from "@/app/components/core/SubmitButton";
import { useAuth } from "@/app/hooks/use_auth";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth() || {}; // ✅ Prevent undefined values

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-left">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm text-left mb-6">
          Enter your email, and we will send you instructions to regain access.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={(values, { setSubmitting }) => {
            forgotPassword(values).finally(() => setSubmitting(false)); // ✅ Ensure Formik stops loading
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form className="space-y-5">
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={values.email} // ✅ Ensure Formik handles the value
                onChange={handleChange} // ✅ Ensure Formik updates correctly
                error={touched.email && errors.email} // ✅ Show error messages
              />
              <SubmitButton
                isLoading={isForgotPasswordLoading || isSubmitting}
                text="Reset Password"
              />
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}

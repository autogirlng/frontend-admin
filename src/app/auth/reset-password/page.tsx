"use client";

import { useRouter } from "next/navigation"; // Import useRouter
import AuthLayout from "@/app/components/auth/AuthLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/app/components/core/form-field/InputField";
import SubmitButton from "@/app/components/core/SubmitButton";
import { useState } from "react";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ResetPasswordPage() {
  const router = useRouter(); // Initialize router
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-left">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm text-left mb-6">
          Enter your email, and we will send you instructions to regain access
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              router.push("/auth/email-sent"); // Navigate to the email-sent page
            }, 2000);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
              />
              <SubmitButton
                isLoading={loading || isSubmitting}
                text="Reset Password"
              />
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}

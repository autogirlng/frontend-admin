"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import AuthLayout from "@/app/components/auth/AuthLayout";
import SubmitButton from "@/app/components/core/SubmitButton";
import InputField from "@/app/components/core/InputField";
import { loginSchema } from "@/app/validators/AuthSchema";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-left">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-md text-left mb-6">
          Log in to pick up where you left off.
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values, { setSubmitting }) => {
            setLoading(true);
            setTimeout(() => {
              console.log("Login Data:", values);
              setLoading(false);
              setSubmitting(false);
              router.push("/"); // Navigate to home page after successful login
            }, 2000);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email Input */}
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
              />

              {/* Password Input */}
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
              />

              {/* Forgot Password Link */}
              <div className="text-left">
                <Link
                  href="/auth/reset-password"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <SubmitButton
                isLoading={loading || isSubmitting}
                text="Sign in"
              />
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}

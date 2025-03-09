"use client";

import AuthLayout from "@/app/components/auth/AuthLayout";
import SubmitButton from "@/app/components/core/SubmitButton";
import InputField from "@/app/components/core/InputField";
import { Form, Formik } from "formik";
import { loginSchema } from "@/app/validators/AuthSchema";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

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
          onSubmit={(values) => {
            setLoading(true);
            setTimeout(() => {
              console.log("Login Data:", values);
              setLoading(false);
            }, 2000);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
              />

              <div className="text-left">
                <Link
                  href="/auth/reset-password"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

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

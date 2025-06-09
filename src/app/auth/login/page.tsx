"use client";
import Link from "next/link";
import { Formik, Form } from "formik";
import AuthLayout from "@/components/auth/AuthLayout";
import SubmitButton from "@/components/core/SubmitButton";
import InputField from "@/components/shared/inputField";
import { loginSchema } from "@/validators/AuthSchema";
import { useAuth } from "@/hooks/use_auth";
import { LocalRoute } from "@/utils/LocalRoutes";
import { useState } from "react";

export default function LoginPage() {
  const { login, isLoading } = useAuth() || {};
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form className="space-y-5">
              <InputField
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={values.email}
                onChange={handleChange}
              />

              <InputField
                id="password"
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={values.password}
                toggleShowPassword={togglePasswordVisibility}
                showPassword={showPassword}
                onChange={handleChange}
              />

              <div className="text-left">
                <Link
                  href={LocalRoute.forgotPasswordPage}
                  className="text-blue-500 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <SubmitButton
                isLoading={isLoading || isSubmitting}
                text="Login"
              />
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}

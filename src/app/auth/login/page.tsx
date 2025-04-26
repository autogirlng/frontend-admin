"use client";
import Link from "next/link";
import { Formik, Form } from "formik";
import AuthLayout from "@/app/components/auth/AuthLayout";
import SubmitButton from "@/app/components/core/SubmitButton";
import InputField from "@/app/components/core/form-field/InputField";
import { loginSchema } from "@/app/validators/AuthSchema";
import { useAuth } from "@/app/hooks/use_auth";
import { LocalRoute } from "@/app/utils/LocalRoutes";

export default function LoginPage() {
  const { login, isLoading } = useAuth() || {};

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
              await login(values); // Ensure login completes before disabling submit state
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form className="space-y-5">
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={values.email} // ✅ Ensure Formik handles the value
                onChange={handleChange} // ✅ Ensure Formik updates correctly
                error={touched.email && errors.email} // ✅ Show error messages
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={values.password} // ✅ Ensure Formik handles the value
                onChange={handleChange} // ✅ Ensure Formik updates correctly
                error={touched.password && errors.password} // ✅ Show error messages
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

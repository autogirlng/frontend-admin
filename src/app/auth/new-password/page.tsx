"use client";

import AuthLayout from "@/app/components/auth/AuthLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/app/components/core/InputField";
import SubmitButton from "@/app/components/core/SubmitButton";
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const passwordCriteria = [
  { label: "8 characters long", regex: /.{8,}/ },
  { label: "One uppercase character", regex: /[A-Z]/ },
  { label: "One lowercase character", regex: /[a-z]/ },
  { label: "One digit", regex: /\d/ },
  { label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  { label: "Must not include spaces", regex: /^\S*$/ },
];

export default function SetNewPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-left">
          Set New Password
        </h2>
        <p className="text-gray-600 text-sm text-left mb-6">
          Enter your new password below.
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={Yup.object().shape({
            password: Yup.string().min(8, "Too short!").required("Required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={(values) => {
            setLoading(true);
            setTimeout(() => {
              console.log("New Password:", values);
              setLoading(false);
            }, 2000);
          }}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-5">
              <div className="relative">
                <InputField
                  label="New Password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  onChanged={(value) => {
                    setPassword(value);
                    setIsTyping(true);
                  }}
                  //   onBlur={() => setIsTyping(false)}
                />
              </div>

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
              {/* Show validation only when user is typing */}
              {isTyping && (
                <div className="mt-3 p-3 ">
                  {passwordCriteria.map(({ label, regex }, index) => {
                    const isValid = regex.test(password);
                    return (
                      <div key={index} className="flex items-center text-sm">
                        {isValid ? (
                          <FaCheckCircle className="text-green-500 mr-2" />
                        ) : (
                          <FaTimesCircle className="text-gray-400 mr-2" />
                        )}
                        <span
                          className={
                            isValid ? "text-green-600" : "text-gray-500"
                          }
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <SubmitButton isLoading={loading} text="Set Password" />
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}

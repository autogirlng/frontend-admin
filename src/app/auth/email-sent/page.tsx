"use client";

import AuthLayout from "@/app/components/auth/AuthLayout";
import { useState } from "react";
import OtpInput from "react-otp-input";
import Image from "next/image";
export default function EmailSentPage() {
  const [otp, setOtp] = useState("");

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6 text-left">
        <Image
          src="/images/mailbox.png"
          alt="mailbox"
          className="mb-4"
          width={200}
          height={135}
        />
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
          We’ve sent a mail your way
        </h2>
        <p className="text-gray-600 text-sm mt-4">
          We sent you an OTP to verify your email. If you can’t find it please
          check your spam first before resending the code.
        </p>

        {/* OTP Input */}
        <div className="mt-6 flex justify-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={5}
            shouldAutoFocus
            inputStyle={{
              width: "2.5rem",
              height: "2.5rem",
              margin: "0 0.5rem",
              fontSize: "1.5rem",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        {/* Timer for OTP Resend */}
        <OtpTimer />
      </div>
    </AuthLayout>
  );
}

// OTP Timer Component
function OtpTimer() {
  const [timeLeft, setTimeLeft] = useState(60);

  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <p className="text-gray-500 text-sm mt-4">
      {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Didn't receive a code? "}
      {timeLeft === 0 && (
        <button className="text-blue-500 font-medium">Resend</button>
      )}
    </p>
  );
}

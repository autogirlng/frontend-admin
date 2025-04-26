"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/app/components/auth/AuthLayout";
import OtpInput from "react-otp-input";
import Image from "next/image";
import { ImageAssets } from "@/app/utils/ImageAssets";
import { LocalRoute } from "@/app/utils/LocalRoutes";

export default function OtpSentPage() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (otp.length === 5) {
      setIsSubmitting(true);
      setTimeout(() => {
        router.push(
          `${LocalRoute.newPasswordPage}?token=${otp}&email=${email}`
        );
      }, 200);
    }
  }, [otp, router, email]);

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6 text-left">
        <Image
          src={ImageAssets.mailbox}
          alt="mailbox"
          className="mb-4"
          width={200}
          height={135}
        />
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
          We’ve sent a mail your way
        </h2>
        <p className="text-gray-600 text-sm mt-4">
          We sent you an OTP to verify your email. If you can’t find it, please
          check your spam first before resending the code.
        </p>

        {/* OTP Input or Loading Indicator */}
        <div className="mt-6 flex justify-center">
          {isSubmitting ? (
            <div className="w-full h-1 bg-gray-300 rounded-full relative overflow-hidden">
              <div className="h-full bg-blue-500 absolute left-0 animate-loading"></div>
            </div>
          ) : (
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
                backgroundColor: isSubmitting ? "#f3f3f3" : "white",
                transition: "background-color 0.3s ease",
              }}
              renderInput={(props) => <input {...props} />}
            />
          )}
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-gray-500 text-sm mt-4">
      {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Didn't receive a code? "}
      {timeLeft === 0 && (
        <button className="text-blue-500 font-medium">Resend</button>
      )}
    </p>
  );
}

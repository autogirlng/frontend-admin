"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/utils/types";
import { Spinner } from "@/components/shared/spinner";
import OtpField from "@/components/shared/otpField";

type Props = {
  verifyOtp: () => void;
  isVerifyOtpLoading: boolean;
  resendOtp: () => void;
  isResendOtpLoading: boolean;
  setOtp: Dispatch<SetStateAction<string>>;
  otp: string;
  error: AxiosError<ErrorResponse> | null;
  children?: ReactNode;
  numInputs?: number;
};

const OtpVerification = ({
  numInputs = 5,
  verifyOtp,
  isVerifyOtpLoading,
  resendOtp,
  isResendOtpLoading,
  setOtp,
  otp,
  error,
  children,
}: Props) => {
  const handleChange = (otp: string) => setOtp(otp);

  // const [minutes, setMinutes] = useState<number>(4);
  const [seconds, setSeconds] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);

      if (seconds === 0) {
        // if (minutes === 0) {
        clearInterval(interval);
        // } else {
        //   setSeconds(59);
        //   setMinutes(minutes - 1);
        // }
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  useEffect(() => {
    if (otp.length === numInputs) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="space-y-8">
      {children}

      <OtpField
        numInputs={numInputs}
        name="otp"
        id="otp"
        type="otp"
        label="Enter OTP"
        placeholder=""
        value={otp}
        onChange={handleChange}
        error={
          error?.response?.data?.ERR_CODE === "INCORRECT_OTP" ||
          error?.response?.data?.ERR_CODE === "OTP_NOT_FOUND"
            ? "Incorrect pin, please check and try again"
            : ""
        }
        disabled={isVerifyOtpLoading || isResendOtpLoading}
      />
      {isVerifyOtpLoading || isResendOtpLoading ? (
        <Spinner />
      ) : // ) : minutes > 0 || seconds > 0 ? (
      //   <p className="text-grey-500 text-sm 3xl:text-base">
      //     Resend Code in{" "}
      //     {minutes > 1
      //       ? `${minutes}mins ${seconds}s`
      //       : minutes > 0
      //         ? `${minutes}min ${seconds}s`
      //         : `${seconds}s`}
      //   </p>
      seconds > 0 ? (
        <p className="text-grey-500 text-sm 3xl:text-base">
          Resend Code in {`${seconds}s`}
        </p>
      ) : (
        <button
          className="text-sm 3xl:text-base text-primary-500"
          onClick={() => {
            resendOtp();
            // setMinutes(4);
            setSeconds(30);
          }}
        >
          Resend Code
        </button>
      )}
    </div>
  );
};

export default OtpVerification;

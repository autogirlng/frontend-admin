import cn from "classnames";
import { OtpInput } from "reactjs-otp-input";

type OtpFieldProps = {
  name: string;
  id: string;
  label?: string;
  placeholder: string;
  variant?: "outlined" | "filled";
  value: string | any;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (otp: string) => void;
  numInputs: number;
  [key: string]: any;
};

const OtpField = ({
  id,
  label,
  placeholder,
  variant,
  error,
  onChange,
  value,
  disabled,
  numInputs,

  ...rest
}: OtpFieldProps) => {
  return (
    <div className="w-full space-y-3">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm block font-medium",
            variant === "filled" ? "text-white" : "text-grey-900"
          )}
        >
          {label}
        </label>
      )}
      <OtpInput
        {...rest}
        onChange={onChange}
        numInputs={numInputs}
        containerStyle="flex items-center gap-3"
        inputStyle={cn(
          "w-full rounded-[12px] text-sm h-[42px] !w-[42px] outline-none data-[placeholder]:text-grey-400",
          variant === "filled"
            ? "bg-grey-800 text-grey-400 border-none"
            : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]"
        )}
        errorStyle="!border !border-error-500 focus:!border-error-500 !shadow-none"
        hasErrored={!!error}
        isDisabled={disabled}
      />

      {error && <p className="text-error-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
export default OtpField;

import { ReactNode } from "react";
import cn from "classnames";
import Tooltip from "../ToolTip";

type InputFieldProps = {
  name: string;
  id: string;
  type?: string;
  label?: string;
  placeholder: string;
  variant?: "outlined" | "filled";
  icon?: ReactNode;
  value?: string | any;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  info?: boolean;
  tooltipTitle?: string;
  tooltipDescription?: string;
  inputClass?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  toggleShowPassword?: () => void;
  [key: string]: any;
};

const InputField2 = ({
  id,
  label,
  placeholder,
  variant,
  type,
  icon,
  error,
  info,
  tooltipTitle,
  tooltipDescription,
  inputClass,
  className,
  toggleShowPassword,
  onChange,
  ...rest
}: InputFieldProps) => (
  <div className={cn("w-full space-y-1", className)}>
    {label && (
      <label
        htmlFor={id}
        className={cn(
          "label text-sm block font-medium text-nowrap",
          variant === "filled" ? "text-white" : "text-grey-900",
          info && "flex items-center gap-3"
        )}
      >
        <span> {label}</span>
        {info && (
          <Tooltip
            title={tooltipTitle || ""}
            description={tooltipDescription || ""}
          />
        )}
      </label>
    )}
    <div className="relative">
      <input
        type={type || "text"}
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-[18px] p-4 text-sm h-[56px] gap-[5px] outline-none disabled:bg-grey-100 disabled:text-grey-400 disabled:border-grey-300",
          icon ? "pr-8" : "",
          inputClass,
          error
            ? "border border-error-500 focus:border-error-500"
            : variant === "filled"
            ? "bg-grey-800 text-grey-400 border-none"
            : "bg-white text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
        )}
        autoCorrect="off"
        spellCheck="false"
        autoComplete={`new-${type || "text"}`}
        {...rest}
      />
      {(id === "password" ||
        id === "confirmPassword" ||
        id === "currentPassword") && (
        <div
          className="absolute right-3 bottom-[19px] fill-grey-500 cursor-pointer"
          onClick={toggleShowPassword}
        >
          {icon}
        </div>
      )}
    </div>
    {error && <p className="text-error-500 text-sm mt-2">{error}</p>}
  </div>
);

export default InputField2;

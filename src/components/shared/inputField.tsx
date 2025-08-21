import React, { ReactNode, useState } from "react"; // Import useState
import cn from "classnames";
import Tooltip from "./tooltip"; // Assuming this path is correct
import Icons from "./icons"; // Assuming this path is correct
import { FaEye, FaEyeSlash } from "react-icons/fa6";

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
  // Remove toggleShowPassword and showPassword props as they will be managed internally
  [key: string]: any;
};

const InputField = ({
  id,
  label,
  placeholder,
  variant,
  type, // We'll use this prop to determine if it's a password field
  icon,
  error,
  info,
  tooltipTitle,
  tooltipDescription,
  inputClass,
  className,
  // Remove these from destructuring, they are no longer external props
  // toggleShowPassword,
  // showPassword,
  ...rest
}: InputFieldProps) => {
  // Manage the internal state for password visibility
  const [showInternalPassword, setShowInternalPassword] = useState(false);

  // Determine the actual input type based on the 'type' prop and internal state
  const actualInputType =
    type === "password" && showInternalPassword ? "text" : type || "text";

  // Check if it's a password field to show the toggle button
  const isPasswordField = type === "password";

  return (
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
          type={actualInputType} // Use the determined type here
          id={id}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-[18px] p-4 text-sm h-[56px] gap-[5px] outline-none data-[placeholder]:text-grey-400 disabled:bg-grey-100 disabled:text-grey-400 disabled:border-grey-300",
            // Adjust padding-right if both icon and password toggle are present, or decide on priority
            isPasswordField || icon ? "pr-12" : "", // Increased pr to accommodate toggle button
            inputClass,
            error
              ? "border border-error-500 focus:border-error-500"
              : variant === "filled"
              ? "bg-grey-800 text-grey-400 border-none"
              : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]"
          )}
          autoCorrect="off"
          spellCheck="false"
          autoComplete={
            type === "password" ? "new-password" : `new-${type || "text"}`
          } // Better autocomplete for password fields
          {...rest}
        />
        {/* Render toggle button only if it's a password field */}
        {isPasswordField && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 fill-grey-500 cursor-pointer" // Centered vertically
            onClick={() => setShowInternalPassword((prev) => !prev)}
          >
            {showInternalPassword ? (
              <FaEyeSlash className="h-5 w-5 text-grey-500" /> // Use text-grey-500 for consistency
            ) : (
              <FaEye className="h-5 w-5 text-grey-500" />
            )}
          </div>
        )}
        {icon && (
          // Adjust icon position if password toggle is present
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 fill-grey-500",
              {
                "mr-8": isPasswordField, // If password field, add margin to the right of the icon
              }
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-error-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default InputField;

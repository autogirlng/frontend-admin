import { ReactNode, useRef } from "react";
import cn from "classnames";
import Tooltip from "./tooltip";

type FileFieldProps = {
  name: string;
  id: string;
  type?: string;
  label?: string;
  placeholder: string;
  variant?: "outlined" | "filled";
  icon?: ReactNode;
  // Keep value as string | File for the component's internal state management
  // but ensure only string is passed to actual input 'value' prop.
  value?: string | File | null; // Allow null to represent no file
  required?: boolean;
  disabled?: boolean;
  error?: string;
  info?: boolean;
  tooltipTitle?: string;
  tooltipDescription?: string;
  inputClass?: string;
  className?: string;

  toggleShowPassword?: () => void;

  /** Enable file picking */
  filePicker?: boolean;

  // IMPORTANT: Add onChange and onBlur props for Formik compatibility
  // Formik will pass an event that relates to the HTMLInputElement's type.
  // For file inputs, onFileSelect is often preferred for passing the File object.
  // onChange here is primarily for standard text inputs or if Formik's handleChange is needed for file event.
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Called with the File object (if filePicker is true) */
  onFileSelect?: (file: File | null) => void; // Allow null for clearing file
};

const FileInputField = ({
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
  filePicker = false,
  onChange, // This onChange is primarily for the *visible* text input (if not readOnly) or for non-file inputs
  onBlur, // This onBlur is for the *visible* text input (if not readOnly) or for non-file inputs
  onFileSelect, // This is for the file input to pass the File object
  value, // This 'value' can be string (for text) or File (for file input in Formik)
  ...rest // Capture other props like `name`
}: FileFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Get the file or null if cleared/none selected
    onFileSelect?.(file); // Always call onFileSelect to update Formik with the File object (or null)

  };

  // Determine the value to display in the readOnly text input
  const displayValue =
    value instanceof File
      ? value.name
      : typeof value === "string"
      ? value
      : ""; // Fallback for string value or empty

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
        {filePicker ? (
          <>
            {/* The actual hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*" // Consider making this prop-configurable
              className="hidden"
              onChange={handleFileChange} // Our internal handler which calls onFileSelect
              onBlur={onBlur} // Pass onBlur directly to the hidden input for Formik's touched state
              id={id} // Associate with label
              // Do NOT set a 'value' prop on type="file" inputs in React as it makes them controlled
              // and can prevent file selection. undefined or "" is correct.
              value={undefined}
              {...rest} // Pass other standard input props like required, disabled
            />
            {/* The visible text input that triggers the file input */}
            <input
              type="text"
              readOnly // This input is read-only
              onClick={() => fileInputRef.current?.click()} // Clicks the hidden file input
              value={displayValue} // This `value` MUST be a string (filename or empty)
              placeholder={placeholder}
              className={cn(
                "cursor-pointer w-full rounded-[18px] p-4 text-sm h-[56px] outline-none",
                inputClass,
                error
                  ? "border border-error-500"
                  : variant === "filled"
                  ? "bg-grey-800 text-grey-400 border-none"
                  : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]"
              )}
              // No onChange/onBlur needed directly on this readOnly text input as it doesn't change value
            />
          </>
        ) : (
          // Regular text input (not a file picker)
          <input
            type={type || "text"}
            id={id}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-[18px] p-4 text-sm h-[56px] outline-none",
              inputClass,
              icon ? "pr-8" : "",
              error
                ? "border border-error-500"
                : variant === "filled"
                ? "bg-grey-800 text-grey-400 border-none"
                : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]"
            )}
            autoCorrect="off"
            spellCheck="false"
            autoComplete={`new-${type || "text"}`}
            // Pass onChange and onBlur directly to the standard input
            onChange={onChange}
            onBlur={onBlur}
            value={value as string} // Explicitly cast to string here for non-file inputs
            {...rest}
          />
        )}

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
};

export default FileInputField;
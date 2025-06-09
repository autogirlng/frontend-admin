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
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Called with the File object (if filePicker is true) */
  onFileSelect?: (file: File) => void;
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
  onChange,
  onBlur,
  onFileSelect,
  value, // This 'value' can be string (for text) or File (for file input in Formik)
  ...rest // Capture other props like `name`
}: FileFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file); // Custom callback for the File object
    }
    // Always call Formik's onChange here. Formik expects the DOM event for type="file"
    // to correctly update its internal state with the File object.
    onChange?.(e);
  };

  // Determine the display value for the *text input* when filePicker is true.
  // This value must always be a string.
  const displayValue =
    value instanceof File ? value.name : (value as string) || "";

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
            {/* The actual hidden file input:
                - `value` should not be controlled with a File object.
                - It should either be undefined or "" to allow file selection.
                - Formik manages the File object in its state, not via this input's value prop.
            */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*" // Consider making this prop-configurable
              className="hidden"
              onChange={handleFileChange} // Our internal handler that also calls Formik's onChange
              onBlur={onBlur} // Pass Formik's onBlur directly to the hidden input
              id={id} // Associate with label
              value={undefined} // Or `""` to clear it, but typically `undefined` is fine
              {...rest} // Pass other standard input props like required, disabled
            />
            {/* The visible text input that triggers the file input */}
            <input
              type="text"
              readOnly
              onClick={() => fileInputRef.current?.click()}
              value={displayValue} // This `value` MUST be a string (filename)
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
              // No onChange/onBlur needed here as it's readOnly and click-only
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
            value={value as string} // Explicitly cast to string here
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

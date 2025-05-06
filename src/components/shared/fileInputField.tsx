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
  value?: string;
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

  /** Called with the File object */
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
  onFileSelect,
  value,
  ...rest
}: FileFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="text"
              readOnly
              onClick={() => fileInputRef.current?.click()}
              value={value || ""}
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
            />
          </>
        ) : (
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

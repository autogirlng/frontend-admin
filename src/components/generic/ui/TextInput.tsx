import React from "react";
import { Info } from "lucide-react";
import clsx from "clsx";

type TextInputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  id: string;
  error?: string;
  hideLabel?: boolean;
};

const TextInput = ({
  label,
  id,
  error,
  hideLabel = false,
  ...props
}: TextInputProps) => {
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF]";

  return (
    <div>
      {!hideLabel && (
        <div className="flex items-center">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <Info className="w-4 h-4 ml-1 text-black" />
        </div>
      )}
      <div className={clsx(!hideLabel && "mt-1")}>
        <input
          id={id}
          {...props}
          className={`block w-full px-4 py-[15px] text-gray-900 bg-white border
                     focus:outline-none focus:ring-1
                     transition duration-150 ease-in-out sm:text-sm ${errorClasses} className`}
        />
        {/* Error message is now conditional */}
        {!hideLabel && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default TextInput;

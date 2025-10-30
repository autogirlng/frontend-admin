"use client"; // Required if using onChange handler

import React, { useMemo } from "react";
import { Info, Calendar } from "lucide-react";
import clsx from "clsx";

// Extends standard input props, excluding 'type' as it's always 'date'
type DateInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  label: string;
  id: string;
  error?: string;
  hideLabel?: boolean;
};

const DateInput = ({
  label,
  id,
  error,
  hideLabel = false,
  className,
  value, // Handles the value prop correctly for date input
  ...props
}: DateInputProps) => {
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF]";

  // Format the value for the input (needs YYYY-MM-DD)
  // If value is a Date object, format it. If it's already a string, use it.
  const formattedValue = useMemo(() => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().split("T")[0]; // Format Date object to YYYY-MM-DD
    }
    // Attempt to parse if it's a string, otherwise return as is
    try {
      const date = new Date(value as string);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch (e) {
      /* ignore parse error */
    }
    return value as string; // Assume it's already YYYY-MM-DD or handle error case
  }, [value]);

  return (
    <div>
      {/* Label */}
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

      {/* Input Wrapper */}
      <div className={clsx("relative", !hideLabel && "mt-1")}>
        <input
          id={id}
          type="date" // Use the native date input
          value={formattedValue}
          {...props}
          className={clsx(
            // Base styles matching TextInput
            `block w-full px-4 py-[15px] text-gray-900 bg-white border
             focus:outline-none focus:ring-1
             transition duration-150 ease-in-out sm:text-sm`,
            // Custom styles for date input
            "appearance-none relative", // Reset browser styles
            errorClasses,
            // Add padding for the icon if needed, adjust based on icon size/position
            // 'pr-10', // Example: Add padding for a trailing icon
            className
          )}
        />
        {/* Optional: Add an icon (e.g., Calendar) */}
        {/* Position this icon absolutely within the relative wrapper */}
        {/* Example:
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        */}

        {/* Error message */}
        {!hideLabel && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default DateInput;

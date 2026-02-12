"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "smd" | "lg";
  isLoading?: boolean;
};

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex w-[120px] items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

    const variantClasses = {
      primary:
        "bg-[#0096FF] text-white hover:bg-[#007ACC] focus:ring-[#007ACC]",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      smd: "px-5 py-3 text-sm",
      lg: "px-6 py-3 text-lg",
    };

    const stateClasses = isLoading
      ? "cursor-not-allowed opacity-75"
      : "disabled:cursor-not-allowed disabled:opacity-50";

    return (
      <button
        ref={ref}
        {...props}
        disabled={isLoading || props.disabled}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          stateClasses,
          className,
        )}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;

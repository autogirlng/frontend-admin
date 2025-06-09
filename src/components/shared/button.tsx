import cn from "classnames";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "filled" | "outlined" | "ghost";
  color?: "primary" | "white" | "danger";
  radius?: "full" | "rounded" | "lg" | "md";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
};

const Button = ({
  children,
  onClick,
  variant = "filled",
  color = "primary",
  radius = "full",
  fullWidth,
  loading,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  const btnWidth = fullWidth
    ? "w-full py-3 !font-semibold text-sm 2xl:text-base"
    : "w-fit py-3 2xl:py-3 !font-medium text-base md:text-xl 2xl:text-h6";

  const btnRadius = {
    full: "rounded-[98px]",
    rounded: "rounded-[32px]",
    lg: "rounded-[24px]",
    md: "rounded-[16px]",
  }[radius] || "rounded-[98px]";

  const btnStyles = {
    filled: {
      primary: "bg-primary-500 hover:bg-primary-600 text-white disabled:bg-grey-300 disabled:text-grey-500",
      white: "bg-white hover:bg-grey-100 text-grey-900 disabled:bg-grey-300 disabled:text-grey-500",
      danger: "bg-error-500 hover:bg-error-600 text-white disabled:bg-grey-300 disabled:text-grey-500",
    },
    outlined: {
      primary: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 disabled:border-grey-300 disabled:text-grey-500",
      white: "border-2 border-white text-white hover:bg-white/10 disabled:border-grey-300 disabled:text-grey-500",
      danger: "border-2 border-error-500 text-error-500 hover:bg-error-50 disabled:border-grey-300 disabled:text-grey-500",
    },
    ghost: {
      primary: "text-primary-500 hover:bg-primary-50 disabled:text-grey-500",
      white: "text-white hover:bg-white/10 disabled:text-grey-500",
      danger: "text-error-500 hover:bg-error-50 disabled:text-grey-500",
    },
  };

  const safeVariant = variant in btnStyles ? variant : "filled";
  const safeColor = color in btnStyles[safeVariant] ? color : "primary";

  return (
    <button
      {...rest}
      className={cn(
        "px-6 md:px-8 2xl:px-[40px] transition-all duration-300 ease-in-out",
        btnWidth,
        btnRadius,
        btnStyles[safeVariant][safeColor],
        "disabled:cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

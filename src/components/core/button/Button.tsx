import cn from "classnames";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "filled" | "outlined";
  color?: "primary" | "white" | "transparent";
  radius?: "full" | "rounded" | "lg" | "md";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  [key: string]: any;
};

const Button = ({
  children,
  onClick,
  variant,
  color,
  radius,
  fullWidth,
  loading,
  className,
  ...rest
}: ButtonProps) => {
  const btnWidth = fullWidth
    ? "w-full py-4 !font-semibold text-sm 2xl:text-base"
    : "w-fit py-2 2xl:py-3 !font-medium text-base md:text-xl 2xl:text-h6";

  const btnRadius =
    radius === "full"
      ? "rounded-[98px]"
      : radius === "lg"
      ? "rounded-[32px]"
      : "rounded-md";

  const btnBorder =
    variant === "outlined"
      ? "border-2 border-solid border-[#D0D5DD] hover:bg-[#D0D5DD]"
      : "border-none";

  const btnBgColor =
    color === "primary"
      ? "bg-[#0673FF]  hover:bg-primary-75 disabled:bg-grey-300"
      : color === "white"
      ? "bg- hover:bg-primary-75"
      : "bg-transparent";

  const btnTextColor =
    color === "primary"
      ? "text-white disabled:text-white hover:text-primary-500"
      : color === "white"
      ? "text-[#344054]"
      : "text-black hover:text-white";

  return (
    <button
      {...rest}
      className={cn(
        "px-5 transition-all duration-300 ease-in-out",
        btnWidth,
        btnRadius,
        btnBorder,
        btnBgColor,
        btnTextColor,
        className
      )}
      onClick={onClick}
    >
      {loading ? <p>Loading...</p> : children}
    </button>
  );
};

export default Button;

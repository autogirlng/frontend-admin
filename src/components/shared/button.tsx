import cn from "classnames";
import { ReactNode } from "react";
import { Spinner } from "./spinner";

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
    ? "w-full py-3 !font-semibold text-sm 2xl:text-base"
    : "w-fit py-3 2xl:py-3 !font-medium text-base md:text-xl 2xl:text-h6";

  const btnRadius =
    radius === "full"
      ? "rounded-[98px]"
      : radius === "lg"
      ? "rounded-[32px]"
      : "rounded-2xl";

  const btnBorder =
    variant === "outlined"
      ? "border-2 border-solid border-black hover:bg-black"
      : "border-none";

  const btnBgColor =
    color === "primary"
      ? "bg-primary-500  hover:bg-primary-75 disabled:bg-grey-300"
      : color === "white"
      ? "bg-white hover:bg-primary-75"
      : "bg-transparent";

  const btnTextColor =
    color === "primary"
      ? "text-white disabled:text-white hover:text-primary-500"
      : color === "white"
      ? "text-primary-500"
      : "text-black hover:text-white";

  return (
    <button
      {...rest}
      className={cn(
        "px-6 md:px-8 2xl:px-[40px] flex  justify-center items-center transition-all duration-300 ease-in-out",
        btnWidth,
        btnRadius,
        btnBorder,
        btnBgColor,
        btnTextColor,
        className
      )}
      onClick={onClick}
    >
      {loading ? <Spinner/>: children}
    </button>
  );
};

export default Button;

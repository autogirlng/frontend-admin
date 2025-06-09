import cn from "classnames";
import { ReactNode } from "react";

type ChipProps = {
  text: string;
  variant?: "filled" | "outlined";
  color?: "dark" | "light" | "lighter" | "primary";
  radius?: "full" | "md" | "sm";
  icon?: ReactNode;
  className?: string;
};

const Chip = ({ text, variant, color, radius, icon, className }: ChipProps) => {
  const borderRadius =
    radius === "full"
      ? "rounded-full"
      : radius === "md"
        ? "rounded-[14px]"
        : "rounded-lg";

  const border =
    variant === "outlined" ? "border border-grey-300" : "border-none";

  const textColor =
    color === "primary"
      ? "text-primary-600 bg-primary-50 py-3 h-10"
      : color === "lighter"
        ? "text-grey-600 bg-grey-75 py-2"
        : color === "dark"
          ? "text-grey-800 !font-medium py-2"
          : "text-grey-900 py-3 h-10";

  return (
    <p
      className={cn(
        "font-normal bg-grey-90 px-3 w-fit text-xs md:text-sm 3xl:text-base",
        icon ? "flex items-center gap-1" : "",
        borderRadius,
        border,
        textColor,
        className
      )}
    >
      {icon ? (
        <>
          {icon}
          <span>{text}</span>
        </>
      ) : (
        text
      )}
    </p>
  );
};
export default Chip;

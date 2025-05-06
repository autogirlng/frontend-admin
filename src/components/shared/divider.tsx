import cn from "classnames";
import React from "react";

type Props = { className?: string; variant?: "light" | "dark" };

export function HorizontalDivider({ variant, className }: Props) {
  return (
    <div
      className={cn(
        "h-px w-full",
        variant === "light" ? "bg-grey-200" : "bg-grey-400",
        className
      )}
    />
  );
}

export function VerticalDivider({ variant, className }: Props) {
  return <div className={cn("h-[150px] w-[1px] bg-grey-300", className)} />;
}

export function DotDivider({ variant, className }: Props) {
  return <div className={cn("h-2 w-2 rounded-full bg-grey-700", className)} />;
}

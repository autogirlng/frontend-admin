"use client";

import React from "react";
import { useRouter } from "next/navigation";
import cn from "classnames";
import { FaChevronLeft } from "react-icons/fa";

type Props = {
  textColor?: string;
  onClick?: () => void;
};

function BackButton({ textColor = "text-black", onClick }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back(); // default behavior
    }
  };

  return (
    <div
      className={cn(
        " flex items-center gap-2 font-semibold text-sm  py-2 rounded cursor-pointer ",
        textColor,
        "hover:underline"
      )}
      onClick={handleClick}
    >
      <FaChevronLeft />
      <span>Go Back</span>
    </div>
  );
}

export default BackButton;

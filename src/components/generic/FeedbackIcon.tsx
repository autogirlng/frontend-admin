import React from "react";
import { MessageSquare, Star } from "lucide-react";

interface ReviewIconProps {
  className?: string;
}

export const ReviewIcon = ({ className = "w-6 h-6" }: ReviewIconProps) => {
  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${className}
        transition-colors duration-200
      `}
    >
      <MessageSquare
        className="w-full h-full stroke-current"
        strokeWidth={2}
      />

      <Star
        className="absolute w-[45%] h-[45%] fill-current"
        stroke="none"
      />
    </div>
  );
};

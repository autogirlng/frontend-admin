import React from "react";

interface CurvedFilledButtonProps {
  title: string;
  disabled?: boolean;
  rounded?: string;
  onClick?: () => void; // Added onClick prop
}

const CurvedFilledButton: React.FC<CurvedFilledButtonProps> = ({
  title,
  disabled = false,
  rounded = "rounded-full px-6 py-2",
  onClick,
}) => {
  return (
    <button
      className={` ${rounded} ${
        disabled
          ? "bg-gray-200 opacity-50 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
      disabled={disabled}
      onClick={onClick} // Added onClick handler
    >
      {title}
    </button>
  );
};

export default CurvedFilledButton;

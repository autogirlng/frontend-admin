import React from "react";

interface CurvedOutlinedButtonProps {
  title: string;
  disabled?: boolean;
}

const CurvedOutlinedButton: React.FC<CurvedOutlinedButtonProps> = ({
  title,
  disabled = false,
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-full border ${
        disabled
          ? "border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
          : "border-gray-400 text-gray-800 hover:bg-gray-100"
      }`}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default CurvedOutlinedButton;

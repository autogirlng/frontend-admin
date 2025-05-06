import { ReactNode } from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  isActive?: boolean;
  activeClass?: string;
  inactiveClass?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  isActive = false,
  activeClass = "bg-red-500 text-white",
  inactiveClass = "bg-gray-200 text-gray-800",
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full cursor-pointer transition ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      {icon}
    </button>
  );
};

export default IconButton;

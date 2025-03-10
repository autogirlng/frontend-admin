import { FC, useState, useEffect, useRef } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface StatusCardProps {
  title: string;
  count: number;
  tooltip?: string;
}

const StatusCard: FC<StatusCardProps> = ({ title, count, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    }
    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative shadow rounded-2xl p-4 flex-1 text-left">
      <div className="flex items-center justify-between gap-1">
        <h3 className="text-sm text-gray-500">{title}</h3>
        {tooltip && (
          <div className="relative cursor-pointer" ref={tooltipRef}>
            <AiOutlineInfoCircle
              className="text-gray-400 hover:text-gray-600 transition duration-200"
              onClick={() => setShowTooltip(!showTooltip)}
            />
            {showTooltip && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 top-6 z-50 bg-white 
              text-[#667185] text-xs rounded-md py-4 pl-2 pr-8 shadow whitespace-nowrap"
              >
                <h2 className="text-black text-md font-bold capitalize">
                  {title}
                </h2>
                {tooltip}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
};

export default StatusCard;

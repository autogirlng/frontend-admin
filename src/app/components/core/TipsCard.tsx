"use client";

import React, { useState } from "react";
import { FaLightbulb } from "react-icons/fa";

interface TipsCardProps {
  tip: string;
}

const TipsCard: React.FC<TipsCardProps> = ({ tip }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-gray-200  p-4 rounded-md shadow-md cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center">
        <div className="bg-orange-50 p-2.5 rounded-full mr-2">
          <FaLightbulb className="text-orange-400 " />
        </div>
        <h4 className="font-semibold">Tips</h4>
      </div>
      <p
        className={`text-sm mt-2 transition-all ${
          expanded ? "block" : "hidden sm:block sm:truncate"
        }`}
      >
        {tip}
      </p>
      {!expanded && (
        <button className="text-blue-600 text-sm mt-2 sm:hidden underline">
          Show More
        </button>
      )}
    </div>
  );
};

export default TipsCard;

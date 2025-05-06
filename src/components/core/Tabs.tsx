"use client";

import { useState, ReactNode } from "react";

interface Tab {
  title: string;
  component: ReactNode;
  badgeCount?: number; // Optional badge count
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="container">
      {/* Tab Buttons */}
      <div className="flex w-11/12 md:w-1/3 justify-around md:justify-start border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`relative px-4 py-2 text-sm font-medium ${
              activeIndex === index
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.title}
            {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {tab.badgeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">{tabs[activeIndex]?.component}</div>
    </div>
  );
};

export default Tabs;

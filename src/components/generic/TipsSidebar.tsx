"use client";

import { allTips, TipContent } from "./tipsContent";
import { Lightbulb } from "lucide-react";

type TipsSidebarProps = {
  currentStep: number;
};

export default function TipsSidebar({ currentStep }: TipsSidebarProps) {
  const content: TipContent = allTips[currentStep] || allTips[1];
  const IconComponent = content.icon || Lightbulb;

  return (
    <aside className="w-full p-6 bg-gray-100 rounded-[20px] shadow-md">
      <div className="flex items-center mb-4">
        <span className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
          <IconComponent className="w-6 h-6 text-yellow-500" />
        </span>
        <h3 className="ml-3 text-lg font-semibold text-gray-800">
          {content.title}
        </h3>
      </div>

      <div className="space-y-4">
        {content.points.map((point) => (
          <div key={point.heading}>
            <h4 className="font-semibold text-gray-700">{point.heading}</h4>
            <p className="mt-1 text-sm text-gray-600">{point.details}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

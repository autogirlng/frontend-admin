// components/dashboard/StatsCard.tsx
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  /** e.g., 'bg-blue-100 text-blue-600' */
  iconColorClasses: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColorClasses,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Text Content */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconColorClasses}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {description && (
        <p className="text-sm text-gray-500 mt-4">{description}</p>
      )}
    </div>
  );
}

// components/dashboard/StatCard.tsx
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  /** e.g., 'bg-blue-100 text-blue-600' */
  iconColorClasses: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColorClasses,
}: StatCardProps) {
  return (
    <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-lg flex items-center gap-4">
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${iconColorClasses}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      {/* Text Content */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  );
}

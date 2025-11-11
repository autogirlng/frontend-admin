// components/dashboard/PrimaryStatCard.tsx
"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface PrimaryStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  /** Pass in the other two StatCard components here */
  children: React.ReactNode;
}

export function PrimaryStatCard({
  title,
  value,
  icon: Icon,
  children,
}: PrimaryStatCardProps) {
  return (
    <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-gray-600">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
          <Icon className="w-7 h-7" />
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      </div>
    </div>
  );
}

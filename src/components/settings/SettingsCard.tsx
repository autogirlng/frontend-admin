// components/generic/ui/SettingsCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface SettingsCardProps {
  /** The icon component from lucide-react */
  icon: LucideIcon;
  /** The title of the card */
  title: string;
  /** A brief description of what this setting does */
  description: string;
  /** The URL to navigate to */
  href: string;
  /** Optional: Icon background color */
  iconBgColor?: string;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  href,
  iconBgColor = "bg-blue-100", // Default to blue
}: SettingsCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-5 bg-white border border-gray-200 shadow-sm rounded-lg
                 transition-all duration-200
                 hover:shadow-md hover:border-[#0096FF] hover:bg-gray-50"
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${iconBgColor}
                    transition-all duration-200 group-hover:scale-105`}
      >
        <Icon className="w-6 h-6 text-[#0096FF]" />
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>

      {/* Arrow */}
      <div className="self-center">
        <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

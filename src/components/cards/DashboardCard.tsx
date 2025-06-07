"use client";

import cn from "classnames";
import FilterBy from "../shared/filter"; // Assuming this is used elsewhere or will be removed if not needed.
import { dashboardStatFilter } from "@/utils/data";
import Tooltip from "../shared/tooltip";
import { Spinner } from "../shared/spinner";
import { useState } from "react";
import SingleFilterBy from "../shared/SingleFilter";

interface MetricProps {
  title: string;
  value: string | number;
  sub?: string;
  tooltip?: string;
  progress?: number;
  border?: boolean;
}

const MetricCard = ({
  title,
  value,
  sub,
  progress,
  tooltip,
  border = false,
}: MetricProps) => {
  return (
    <div
      className={cn(
        "p-4 space-y-2 h-full",
        // The border styling will be applied dynamically by the parent grid
        // instead of relying on this `border` prop.
        // For individual borders within the grid, you'd typically use `divide-x` on the parent grid.
        // However, given your current setup with `border-r`, we'll keep it for now but note
        // that `divide-x` on the grid parent can be more flexible.
        border ? "border-r border-[#E4E7EC]" : ""
      )}
    >
      {/* Title */}
      <div className="text-xs text-[#667085] font-medium flex items-center label gap-2">
        <span>{title}</span>
        {tooltip && <Tooltip title={title} description={tooltip || ""} />}
      </div>

      {/* Main Value */}
      <p className="text-[24px] font-bold text-[#101828]">{value}</p>

      {/* Subtext */}
      {sub && <p className="text-xs text-[#667085]">{sub}</p>}

      {/* Progress */}
      {progress !== undefined && sub && (
        <div className={`w-full rounded-full overflow-hidden h-1 bg-[#FFA119]`}>
          <div
            className="h-full bg-[#0673FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  loading: boolean;
  error: boolean;
  onChange: (selectedFilters: Record<string, string>) => void;
  icon: React.ReactNode;
  metrics: {
    title: string;
    value: string | number;
    sub?: string;
    progress?: number;
    tooltip?: string;
  }[];
  showFilter?: boolean;
}

export default function DashboardCard({
  title,
  loading,
  error,
  icon,
  metrics,
  onChange,
  showFilter = false,
}: DashboardCardProps) {
  const numMetrics = metrics.length;

  // Determine grid columns based on the number of metrics and screen size
  const getGridColsClass = () => {
    switch (numMetrics) {
      case 1:
        return "grid-cols-1"; // Always one column for a single metric
      case 2:
        return "grid-cols-1 sm:grid-cols-2"; // 1 col on mobile, 2 on small screens and up
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // 1 on mobile, 2 on sm, 3 on large
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // 1 on mobile, 2 on sm, 4 on large
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"; // Added md for 3 cols, lg for 5
      case 6:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"; // Added md for 3 cols, lg for 6
      case 7:
        // For 7, you might want 3 or 4 on larger screens for better spacing, then 7 on very large
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7";
      case 8:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8";
      default:
        // Default for many metrics: 1 on mobile, then scale up
        // This handles cases with more than 8 or an unknown number
        return `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-${numMetrics}`;
    }
  };

  return (
    <div className="bg-white border border-grey-200 mt-1 w-full space-y-2 rounded-3xl px-3 py-2">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#1E93FF]">
          {icon}
          <span className="text-grey-900">{title}</span>
        </div>
        {showFilter && (
          <SingleFilterBy
            categories={dashboardStatFilter}
            onChange={onChange}
          />
        )}
      </div>

      {loading ? (
        <div className="animate-pulse flex justify-start items-start space-y-4">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading data</div>
      ) : (
        <div
          className={cn(
            "grid gap-4", // Maintain consistent gap between items
            getGridColsClass() // Apply dynamic grid columns
            // Optional: Add `divide-x` if you want vertical separators between columns
            // based on the number of metrics, but be cautious with uneven grids.
            // "divide-x divide-[#E4E7EC]" // This will add dividers between columns
          )}
        >
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              {...metric}
              border={index < metrics.length - 1 && numMetrics > 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

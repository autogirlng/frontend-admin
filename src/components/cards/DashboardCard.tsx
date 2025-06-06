"use client";

import cn from "classnames";
import FilterBy from "../shared/filter";
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
        "p-4 space-y-2 h-full ",
        border ? "border-r border-[#E4E7EC]" : ""
      )}
    >
      {/* Title */}
      <div className="text-xs text-[#667085] font-medium flex items-center label gap-2">
        <span>{title}</span>
        <Tooltip title={title} description={tooltip || ""} />
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
  return (
    <div className="  bg-white border border-grey-200 mt-1 w-full space-y-2 rounded-3xl px-3 py-2">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#1E93FF]">
          {icon}
          <span className="text-grey-900">{title}</span>
        </div>
        {showFilter && (
          <SingleFilterBy
            categories={dashboardStatFilter} // Assuming dashboardStatFilter is compatible with both
            onChange={onChange} // Type assertion for compatibility
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
          className={`grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-${metrics.length} xl:grid-cols-${metrics.length} gap-4`}
        >
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              {...metric}
              border={index < metrics.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

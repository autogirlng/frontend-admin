import React from "react";
import { FaTicket } from "react-icons/fa6";
import { SvgAsset } from "@/app/utils/SvgAssets";
import cn from "classnames";
import Link from "next/link";
interface BookingPerfomanceProps {
  path: string;
}

const PerfomanceCard: React.FC<BookingPerfomanceProps> = ({ path }) => {
  return (
    <Link href={path}>
      <div className="bg-white p-6 rounded-3xl shadow-lg shadow-[#E4E7EC] w-full space-y-6 ">
        {/* Section Title */}
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#101928]">
          <FaTicket className="text-[#0673FF]" />
          <span>Bookings</span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Bookings"
            value="9,273,527"
            sub="₦40,000,000 • 102,327,421 rides"
            progress={90}
          />
          <MetricCard
            title="Ongoing Bookings"
            value="99"
            sub="₦40,000,000 • 102,327,421 rides"
            progress={30}
          />
          <MetricCard
            title="Completed Bookings"
            value="410,399"
            sub="₦40,000,000 • 102,327,421 rides"
            progress={80}
          />
          <MetricCard
            title="Cancelled Bookings"
            value="172"
            //   sub="₦40,000,000 • 102,327,421 rides"
            progress={10}
            border={false}
          />
        </div>
      </div>
    </Link>
  );
};

export default PerfomanceCard;

// ========== MetricCard ==========
type MetricProps = {
  title: string;
  value: string;
  sub?: string;
  progress: number;
  border?: boolean;
};

const MetricCard = ({
  title,
  value,
  sub,
  progress,
  border = true,
}: MetricProps) => {
  return (
    <div
      className={cn(
        "  p-4 space-y-2 h-full",
        border ? "border-r border-[#E4E7EC]" : ""
      )}
    >
      {/* Title */}
      <div className="text-xs text-[#667085] font-medium flex items-center label gap-2">
        <span>{title}</span>
        <span className="w-4 h-4">{SvgAsset.toolTip}</span>
      </div>

      {/* Main Value */}
      <p className="text-[24px] font-bold text-[#101828]">{value}</p>

      {/* Subtext */}
      {sub && <p className="text-xs text-[#667085]">{sub}</p>}

      {/* Progress */}
      {sub && <Progress value={progress} className="h-1 bg-[#FFA119]" />}
    </div>
  );
};

const Progress = ({ value = 10, className = "" }) => {
  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#0673FF] transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

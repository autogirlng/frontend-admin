"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info, Plus, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MetricDetail {
  count: number;
  naira: number;
  rides: number;
}

interface BookingMetricsData {
  total: MetricDetail;
  ongoing: MetricDetail;
  completed: MetricDetail;
  cancelled: MetricDetail;
}

interface ApiResponse {
  bookingMetrics: BookingMetricsData;
}

const fetchBookingMetrics = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem("user_token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${API_BASE_URL}/admin/metrics/booking`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch booking metrics.");
  }

  return response.json();
};

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

interface BookingMetricProps {
  title: string;
  count: number;
  amount: string;
  rides: number;
  blueRatio: number;
  orangeRatio: number;
  tooltipText?: string;
}

const BookingMetricCard: React.FC<BookingMetricProps> = ({
  title,
  count,
  amount,
  rides,
  blueRatio,
  orangeRatio,
  tooltipText = `Information about ${title.toLowerCase()}`,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-[#344054] text-sm">{title}</span>
        <div
          className="relative"
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >
          <Info size={16} className="text-gray-400 cursor-pointer" />
          {isTooltipVisible && (
            <div className="absolute z-10 bg-white border border-gray-200 text-[#344054] text-xs rounded py-1 px-2 left-6 -top-2 w-40 shadow-lg">
              {tooltipText}
            </div>
          )}
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold">
        {count.toLocaleString()}
      </div>
      <div className="flex items-center text-[#344054] text-xs md:text-sm">
        <span className="truncate">{amount}</span>
        <span className="mx-1 flex-shrink-0">•</span>
        <span className="flex-shrink-0">{rides.toLocaleString()} rides</span>
      </div>
      <Progress value={blueRatio} secondaryValue={orangeRatio} />
    </div>
  );
};

interface ProgressProps {
  value?: number;
  secondaryValue?: number;
  className?: string;
}

const Progress = ({
  value = 0,
  secondaryValue = 0,
  className = "",
}: ProgressProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const progressRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: rect.height + 10,
      });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      ref={progressRef}
    >
      <div
        className={`w-full h-1.5 bg-gray-200 rounded-full overflow-hidden bg-[#FFA119] ${className}`}
      >
        <div className="flex h-full">
          <div
            className="h-full bg-[#0673FF] transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      {isHovered && (
        <div
          className="absolute z-10 bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[120px]"
          style={{
            left: `${Math.min(90, Math.max(10, position.x - 60))}px`,
            top: `${position.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#0673FF] mr-2"></div>
                <span className="text-gray-600">Primary:</span>
              </div>
              <span className="font-medium">{value.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#FFA119] mr-2"></div>
                <span className="text-gray-600">Secondary:</span>
              </div>
              <span className="font-medium">{secondaryValue.toFixed(1)}%</span>
            </div>
          </div>
          <div
            className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"
            style={{ zIndex: -1 }}
          ></div>
        </div>
      )}
    </div>
  );
};

const BookingMetrics: React.FC = () => {
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const newBookingDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["bookingMetrics"],
    queryFn: fetchBookingMetrics,
  });

  const metrics = apiData?.bookingMetrics;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        newBookingDropdownRef.current &&
        !newBookingDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNewBookingOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalCount = metrics?.total.count || 1;
  const completedRatio = ((metrics?.completed.count || 0) / totalCount) * 100;
  const ongoingRatio = ((metrics?.ongoing.count || 0) / totalCount) * 100;
  const cancelledRatio = ((metrics?.cancelled.count || 0) / totalCount) * 100;

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2 sm:mb-2">
        <h1 className="text-lg sm:text-xl font-medium text-[#344054]">
          Booking Metrics
        </h1>
        <div className="flex flex-wrap w-full sm:w-auto justify-end gap-2">
          <div
            className="relative w-full sm:w-auto"
            ref={newBookingDropdownRef}
          >
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#0673FF] text-white rounded-lg"
              style={{ fontSize: 13 }}
              onClick={() => setIsNewBookingOpen(!isNewBookingOpen)}
            >
              <Plus size={16} />
              <span>New Booking</span>
            </button>
            {isNewBookingOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-lg z-20 py-1 border border-[#0673FF]">
                <div className="px-6 py-4">
                  <h2
                    className="text-xl font-bold text-[#1D2739] mb-2"
                    style={{ fontSize: 17 }}
                  >
                    New Booking
                  </h2>
                  <div className="border-t border-[#D0D5DD] my-4"></div>
                  <div
                    className="mb-6 cursor-pointer"
                    onClick={() =>
                      router.push("/dashboard/booking/new-customer")
                    }
                  >
                    <h3
                      className="text-lg font-medium flex flex-row justify-between  text-[#1D2739] mb-1 "
                      style={{ fontSize: 15, fontWeight: "bold" }}
                    >
                      <span>Create Booking</span> <ChevronRight />
                    </h3>
                    <p className="text-[#1D2739] mb-2" style={{ fontSize: 12 }}>
                      Create booking all within the muvment platform.
                    </p>
                  </div>
                  <div className="border-t border-[#D0D5DD] my-4"></div>
                  <div>
                    <h3
                      className="text-lg font-medium text-[#1D2739] mb-1"
                      style={{ fontSize: 15, fontWeight: "bold" }}
                    >
                      Copy Form Link
                    </h3>
                    <p className="text-[#1D2739] mb-2" style={{ fontSize: 12 }}>
                      Share booking Form with offline users
                    </p>
                    <div className="flex justify-between items-center">
                      <div></div>
                      <button
                        className="bg-[#F0F2F5] text-[#344054] px-4 py-2 rounded-md text-sm"
                        style={{ borderRadius: 30 }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="bg-gray-50 p-6 sm:p-4 md:p-6 rounded-lg shadow-md"
        style={{ borderRadius: 20, paddingTop: 35, paddingBottom: 35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className="font-medium bg-[#EDF8FF] text-sm md:text-base"
            style={{
              padding: "8px 12px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src="/icons/coupon.svg" className="w-5 h-5 mr-2" />
            Bookings
          </span>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-3 bg-white rounded-lg animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 mt-1"></div>
                <div className="h-4 bg-gray-200 rounded w-full mt-1"></div>
                <div className="h-1.5 bg-gray-200 rounded-full mt-2"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-10 text-red-500">
            Error: {error.message}
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            <BookingMetricCard
              title="Total Bookings"
              count={metrics.total.count}
              amount={formatNaira(metrics.total.naira)}
              rides={metrics.total.rides}
              blueRatio={completedRatio}
              orangeRatio={ongoingRatio}
              tooltipText="All bookings, including ongoing, completed, and canceled."
            />
            <BookingMetricCard
              title="Ongoing Bookings"
              count={metrics.ongoing.count}
              amount={formatNaira(metrics.ongoing.naira)}
              rides={metrics.ongoing.rides}
              blueRatio={ongoingRatio}
              orangeRatio={0}
              tooltipText="Bookings that are currently active."
            />
            <BookingMetricCard
              title="Completed Bookings"
              count={metrics.completed.count}
              amount={formatNaira(metrics.completed.naira)}
              rides={metrics.completed.rides}
              blueRatio={completedRatio}
              orangeRatio={0}
              tooltipText="Bookings that have been successfully completed."
            />
            <BookingMetricCard
              title="Canceled Bookings"
              count={metrics.cancelled.count}
              amount={formatNaira(metrics.cancelled.naira)}
              rides={metrics.cancelled.rides}
              blueRatio={cancelledRatio}
              orangeRatio={0}
              tooltipText="Bookings that have been canceled."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingMetrics;

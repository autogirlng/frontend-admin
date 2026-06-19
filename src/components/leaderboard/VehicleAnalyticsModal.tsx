"use client";

import React, { useState } from "react";
import { subDays, format } from "date-fns";
import {
  X,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useGetVehicleAnalytics } from "./hooks/useLeaderboard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../dashboard/availability/DatePickerWithRange";
import CustomLoader from "@/components/generic/CustomLoader";

interface ModalProps {
  vehicleId: string;
  vehicleName: string;
  onClose: () => void;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#ffc658",
];

export function VehicleAnalyticsModal({
  vehicleId,
  vehicleName,
  onClose,
}: ModalProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd'T'00:00:00")
    : "";
  const endDate = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd'T'23:59:59")
    : "";

  const { data, isLoading, isError } = useGetVehicleAnalytics(
    vehicleId,
    startDate,
    endDate,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {vehicleName} Analytics
            </h3>
            <p className="text-sm text-gray-500 mt-1">Performance breakdown</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <div className="flex bg-white p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setChartType("line")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${chartType === "line" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <TrendingUp className="w-4 h-4" /> Line
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${chartType === "bar" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <BarChart2 className="w-4 h-4" /> Bar
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="py-20">
              <CustomLoader />
            </div>
          )}
          {isError && (
            <p className="text-red-500 text-center py-10">
              Failed to load analytics data.
            </p>
          )}

          {!isLoading && data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 border border-gray-100 shadow-sm">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Revenue & Bookings Over Time
                </h4>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer>
                    {chartType === "line" ? (
                      <LineChart
                        data={data.timeSeriesData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E5E7EB"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          stroke="#9CA3AF"
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 12 }}
                          stroke="#9CA3AF"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 12 }}
                          stroke="#9CA3AF"
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="totalRevenue"
                          name="Revenue (₦)"
                          stroke="#0096FF"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="bookingCount"
                          name="Bookings"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart
                        data={data.timeSeriesData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E5E7EB"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          stroke="#9CA3AF"
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 12 }}
                          stroke="#9CA3AF"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 12 }}
                          stroke="#9CA3AF"
                        />
                        <Tooltip
                          cursor={{ fill: "#F3F4F6" }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar
                          yAxisId="left"
                          dataKey="totalRevenue"
                          name="Revenue (₦)"
                          fill="#0096FF"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="bookingCount"
                          name="Bookings"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-4 h-4" /> Status Distribution
                </h4>
                <div className="h-[350px] w-full flex-1">
                  {data.statusData.length > 0 ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={data.statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="category"
                        >
                          {data.statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No status data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

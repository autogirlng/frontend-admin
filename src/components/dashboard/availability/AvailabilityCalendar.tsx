"use client";

import React, { useMemo, useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import type {
  AvailabilityCalendarProps,
  VehicleAvailability,
  AvailabilityStatus,
} from "./availability";
import {
  Wrench,
  Ban,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  Briefcase,
} from "lucide-react";

const useProcessedVehicles = (vehicles: VehicleAvailability[]) => {
  return useMemo(() => {
    return vehicles.map((vehicle) => {
      const availabilityMap = new Map<string, AvailabilityStatus>(
        vehicle.availability.map((a) => [a.date, a])
      );
      return { ...vehicle, availabilityMap };
    });
  }, [vehicles]);
};

const getStatusConfig = (statusData: AvailabilityStatus | undefined) => {
  if (!statusData) {
    return {
      color: "bg-gray-50 border-gray-100 text-gray-400",
      icon: <Clock className="w-3 h-3" />,
      label: "Unknown",
      subLabel: "No data",
    };
  }

  const { status, unavailabilityReasons, summary } = statusData;

  if (unavailabilityReasons.includes("MAINTENANCE")) {
    return {
      color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
      icon: <Wrench className="w-3 h-3" />,
      label: "Maintenance",
      subLabel: "Unavailable",
    };
  }

  if (unavailabilityReasons.includes("COMPANY_USE")) {
    return {
      color:
        "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
      icon: <Briefcase className="w-3 h-3" />,
      label: "Company Use",
      subLabel: summary || "Internal",
    };
  }

  if (
    unavailabilityReasons.includes("UNAVAILABLE") ||
    status === "UNAVAILABLE"
  ) {
    return {
      color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
      icon: <Ban className="w-3 h-3" />,
      label: "Unavailable",
      subLabel: summary || "Blocked",
    };
  }

  switch (status) {
    case "FULLY_AVAILABLE":
    case "AVAILABLE":
      return {
        color:
          "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Available",
        subLabel: summary,
      };
    case "PARTIALLY_BOOKED":
      return {
        color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
        icon: <Clock className="w-3 h-3" />,
        label: "Booked",
        subLabel: summary,
      };
    case "FULLY_BOOKED":
      return {
        color: "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200",
        icon: <Ban className="w-3 h-3" />,
        label: "Booked",
        subLabel: "Fully occupied",
      };
    default:
      return {
        color: "bg-gray-50 border-gray-100 text-gray-500",
        icon: <AlertCircle className="w-3 h-3" />,
        label: status.replace(/_/g, " "),
        subLabel: summary,
      };
  }
};

export default function AvailabilityCalendar({
  vehicles,
  startDate,
  endDate,
  onCellClick,
}: AvailabilityCalendarProps) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const processedVehicles = useProcessedVehicles(vehicles);
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(
    null
  );

  const toggleVehicle = (id: string) => {
    setExpandedVehicleId(expandedVehicleId === id ? null : id);
  };

  return (
    <div className="w-full space-y-4">
      {/* --- Mobile View (Card List) --- */}
      <div className="block md:hidden space-y-3">
        {processedVehicles.map((vehicle) => {
          const isExpanded = expandedVehicleId === vehicle.vehicleId;
          return (
            <div
              key={vehicle.vehicleId}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleVehicle(vehicle.vehicleId)}
                className="w-full flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-gray-900">
                    {vehicle.vehicleName}
                  </span>
                  <span className="text-xs text-gray-500 font-mono mt-0.5">
                    {vehicle.vehicleIdentifier}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const statusData = vehicle.availabilityMap.get(dateKey);
                      const config = getStatusConfig(statusData);

                      return (
                        <div
                          key={dateKey}
                          onClick={() => onCellClick(vehicle.vehicleId, day)}
                          className={`
                            relative flex flex-col p-3 border cursor-pointer 
                            transition-all active:scale-[0.98] ${config.color}
                          `}
                        >
                          <div className="flex items-center gap-1.5 mb-1 opacity-70">
                            <CalendarIcon className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              {format(day, "MMM d")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium text-sm">
                            {config.icon}
                            <span>{config.label}</span>
                          </div>
                          <div className="text-[10px] mt-1 opacity-80 truncate">
                            {config.subLabel}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- Desktop View (Table) --- */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-left">
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm sticky left-0 bg-gray-50 z-10 w-64 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  Vehicle
                </th>
                {days.map((day) => (
                  <th
                    key={day.toISOString()}
                    className="py-3 px-4 text-center min-w-[120px]"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        {format(day, "EEE")}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {format(day, "MMM d")}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedVehicles.map((vehicle) => (
                <tr
                  key={vehicle.vehicleId}
                  className="group hover:bg-gray-50/30 transition-colors"
                >
                  <td className="py-4 px-6 sticky left-0 bg-white group-hover:bg-gray-50/90 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {vehicle.vehicleName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono mt-0.5">
                        {vehicle.vehicleIdentifier}
                      </span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const statusData = vehicle.availabilityMap.get(dateKey);
                    const config = getStatusConfig(statusData);

                    return (
                      <td key={dateKey} className="p-2">
                        <button
                          onClick={() => onCellClick(vehicle.vehicleId, day)}
                          className={`
                            w-full h-full min-h-[70px] flex flex-col items-center justify-center 
                            border text-center p-2 transition-all 
                            hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                            ${config.color}
                          `}
                          title={`${config.label} - ${config.subLabel}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {config.icon}
                            <span className="text-xs font-bold">
                              {config.label}
                            </span>
                          </div>
                          <span className="text-[10px] opacity-80 line-clamp-2 leading-tight px-1">
                            {config.subLabel}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

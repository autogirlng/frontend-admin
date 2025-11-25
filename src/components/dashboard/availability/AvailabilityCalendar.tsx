"use client";

import React, { useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import type {
  AvailabilityCalendarProps,
  VehicleAvailability,
  AvailabilityStatus,
} from "./availability";
import {
  Wrench,
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";

const useProcessedVehicles = (vehicles: VehicleAvailability[]) => {
  return React.useMemo(() => {
    return vehicles.map((vehicle) => {
      const availabilityMap = new Map<string, AvailabilityStatus>(
        vehicle.availability.map((a) => [a.date, a])
      );
      return { ...vehicle, availabilityMap };
    });
  }, [vehicles]);
};

const getStatusConfig = (status: AvailabilityStatus | undefined) => {
  let cellContent: React.ReactNode = "Available";
  let cellColor = "bg-green-50 text-green-700 border-green-100";
  let icon = null;

  const isBooked = status && status.bookedTypes.length > 0;
  const isUnavailable = status && status.unavailabilityReasons.length > 0;

  if (isBooked) {
    cellColor = "bg-red-50 text-red-700 border-red-100";
    cellContent = status.bookedTypes.join(", ");
  } else if (isUnavailable) {
    const reason = status.unavailabilityReasons[0];
    if (reason === "MAINTENANCE") {
      cellColor = "bg-yellow-50 text-yellow-700 border-yellow-100";
      icon = <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />;
      cellContent = "Maintenance";
    } else {
      cellColor = "bg-gray-100 text-gray-600 border-gray-200";
      icon = <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      cellContent = reason.replace(/_/g, " ");
    }
  }

  return { cellContent, cellColor, icon };
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
    <div className="w-full">
      {/* =========================================================
          MOBILE VIEW: Accordion Cards (Visible on small screens)
          ========================================================= */}
      <div className="block md:hidden space-y-3">
        {processedVehicles.map((vehicle) => {
          const isExpanded = expandedVehicleId === vehicle.vehicleId;

          return (
            <div
              key={vehicle.vehicleId}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              {/* Header: Click to Expand */}
              <button
                onClick={() => toggleVehicle(vehicle.vehicleId)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-900">
                    {vehicle.vehicleName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {vehicle.vehicleIdentifier}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Body: Date Grid (Shown only when expanded) */}
              {isExpanded && (
                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const status = vehicle.availabilityMap.get(dateKey);
                      const config = getStatusConfig(status);

                      return (
                        <div
                          key={dateKey}
                          onClick={() => onCellClick(vehicle.vehicleId, day)}
                          className={`
                            relative p-3 border text-center cursor-pointer 
                            transition-all active:scale-95 flex flex-col items-center justify-center gap-1
                            ${config.cellColor}
                          `}
                        >
                          {/* Date Header inside the chip */}
                          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide opacity-70 mb-1">
                            <Calendar className="h-3 w-3" />
                            {format(day, "MMM d")}
                          </div>

                          {/* Content/Icon */}
                          <div className="text-xs font-medium flex items-center gap-1">
                            {config.icon}
                            <span className="truncate max-w-[100px]">
                              {config.cellContent}
                            </span>
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

      {/* =========================================================
          DESKTOP VIEW: Full Table (Hidden on mobile)
          ========================================================= */}
      <div className="hidden md:block overflow-x-auto relative border border-gray-200">
        <table className="w-full min-w-[1200px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="py-3 px-6 sticky left-0 bg-gray-50 z-20 border-b border-r border-gray-200"
              >
                Vehicle
              </th>
              {days.map((day) => (
                <th
                  key={day.toISOString()}
                  scope="col"
                  className="py-3 px-6 text-center border-b border-gray-200"
                >
                  {format(day, "MMM d")} <br />
                  <span className="font-normal text-gray-500">
                    {format(day, "eee")}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedVehicles.map((vehicle) => (
              <tr
                key={vehicle.vehicleId}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="py-4 px-6 font-medium text-gray-900 sticky left-0 bg-white z-0 border-r border-gray-100 shadow-sm">
                  {vehicle.vehicleName} <br />
                  <span className="font-normal text-gray-500">
                    {vehicle.vehicleIdentifier}
                  </span>
                </td>
                {days.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const status = vehicle.availabilityMap.get(dateKey);
                  const config = getStatusConfig(status);

                  return (
                    <td
                      key={dateKey}
                      onClick={() => onCellClick(vehicle.vehicleId, day)}
                      className={`py-4 px-6 text-center cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 hover:ring-inset ${config.cellColor}`}
                    >
                      <span className="flex items-center justify-center gap-1 font-medium">
                        {config.icon}
                        {config.cellContent}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

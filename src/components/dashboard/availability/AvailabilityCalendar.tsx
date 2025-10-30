// components/dashboard/availability/AvailabilityCalendar.tsx
"use client";

import React from "react";
import { format, eachDayOfInterval } from "date-fns";
// ✅ Import the updated prop type
import { AvailabilityCalendarProps, VehicleAvailability } from "./availability";

const useProcessedVehicles = (vehicles: VehicleAvailability[]) => {
  return React.useMemo(() => {
    return vehicles.map((vehicle) => {
      const availabilityMap = new Map(
        vehicle.availability.map((a) => [a.date, a.bookedTypes])
      );
      return { ...vehicle, availabilityMap };
    });
  }, [vehicles]);
};

export default function AvailabilityCalendar({
  vehicles,
  startDate,
  endDate,
  onCellClick, // ✅ Destructure the new prop
}: AvailabilityCalendarProps) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const processedVehicles = useProcessedVehicles(vehicles);

  return (
    <div className="overflow-x-auto relative border border-gray-200">
      <table className="w-full min-w-[1200px] text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="py-3 px-6 sticky left-0 bg-gray-50 z-10">
              Vehicle
            </th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                scope="col"
                className="py-3 px-6 text-center"
              >
                {format(day, "MMM d")}
                <br />
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
              <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-0">
                {vehicle.vehicleName}
                <br />
                <span className="font-normal text-gray-500">
                  {vehicle.vehicleIdentifier}
                </span>
              </td>
              {days.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const bookedTypes = vehicle.availabilityMap.get(dateKey);
                const isBooked = bookedTypes && bookedTypes.length > 0;

                return (
                  <td
                    key={dateKey}
                    // ✅ Add onClick and cursor-pointer
                    onClick={() => onCellClick(vehicle.vehicleId, day)}
                    className={`py-4 px-6 text-center cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 hover:ring-inset ${
                      isBooked
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    <span className="font-medium">
                      {isBooked ? bookedTypes.join(", ") : "Available"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

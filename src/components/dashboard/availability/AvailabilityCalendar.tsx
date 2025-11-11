// components/dashboard/availability/AvailabilityCalendar.tsx
"use client";

import React from "react";
import { format, eachDayOfInterval } from "date-fns";
import type {
  AvailabilityCalendarProps,
  VehicleAvailability,
  AvailabilityStatus, // ✅ Import new type
} from "./availability"; // Adjust path
import { Wrench, XCircle } from "lucide-react"; // ✅ Import icons

/**
 * Pre-processes vehicle data to create a fast lookup map for availability.
 * @param vehicles - The raw vehicle availability data.
 * @returns Vehicles with an added `availabilityMap` for O(1) date lookups.
 */
const useProcessedVehicles = (vehicles: VehicleAvailability[]) => {
  return React.useMemo(() => {
    return vehicles.map((vehicle) => {
      // Create a Map for fast O(1) lookups by date string
      // ✅ Store the *entire* AvailabilityStatus object
      const availabilityMap = new Map<string, AvailabilityStatus>(
        vehicle.availability.map((a) => [a.date, a])
      );
      return { ...vehicle, availabilityMap };
    });
  }, [vehicles]);
};

export default function AvailabilityCalendar({
  vehicles,
  startDate,
  endDate,
  onCellClick, // ✅ Added prop
}: AvailabilityCalendarProps) {
  // Generate an array of all Date objects for the header columns
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Use the memoized hook to process vehicle data
  const processedVehicles = useProcessedVehicles(vehicles);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200">
      <table className="w-full min-w-[1200px] text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
          <tr>
            {/* Sticky first column for vehicle name */}
            <th scope="col" className="py-3 px-6 sticky left-0 bg-gray-50 z-10">
              Vehicle
            </th>
            {/* Map over the days to create table headers */}
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
              {/* Sticky first column cell */}
              <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-0">
                {vehicle.vehicleName}
                <br />
                <span className="font-normal text-gray-500">
                  {vehicle.vehicleIdentifier}
                </span>
              </td>
              {/* Map over the days again for the cells */}
              {days.map((day) => {
                // Format the day to "YYYY-MM-DD" to match the API key
                const dateKey = format(day, "yyyy-MM-dd");
                // Look up the status in our pre-processed Map
                const status = vehicle.availabilityMap.get(dateKey);

                // ✅ --- NEW LOGIC ---
                let cellContent: React.ReactNode = "Available";
                let cellColor = "bg-green-50 text-green-700";

                const isBooked = status && status.bookedTypes.length > 0;
                const isUnavailable =
                  status && status.unavailabilityReasons.length > 0;

                if (isBooked) {
                  cellColor = "bg-red-50 text-red-700";
                  cellContent = status.bookedTypes.join(", ");
                } else if (isUnavailable) {
                  // Handle different unavailability reasons
                  const reason = status.unavailabilityReasons[0];
                  if (reason === "MAINTENANCE") {
                    cellColor = "bg-yellow-50 text-yellow-700";
                    cellContent = (
                      <span className="flex items-center justify-center gap-1">
                        <Wrench className="h-4 w-4" /> Maintenance
                      </span>
                    );
                  } else {
                    cellColor = "bg-gray-100 text-gray-600";
                    cellContent = (
                      <span className="flex items-center justify-center gap-1">
                        <XCircle className="h-4 w-4" />{" "}
                        {reason.replace(/_/g, " ")}
                      </span>
                    );
                  }
                }
                // ✅ --- END NEW LOGIC ---

                return (
                  <td
                    key={dateKey}
                    // ✅ Add onClick handler
                    onClick={() => onCellClick(vehicle.vehicleId, day)}
                    className={`py-4 px-6 text-center cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 hover:ring-inset ${cellColor}`}
                  >
                    <span className="font-medium">{cellContent}</span>
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

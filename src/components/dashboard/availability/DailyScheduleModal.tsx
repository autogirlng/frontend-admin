"use client";

import React from "react";
import { X, Clock } from "lucide-react";
import { format } from "date-fns";
import { useVehicleDailySchedule } from "@/lib/hooks/availability/useVehicleDailySchedule";
import CustomLoader from "@/components/generic/CustomLoader";
import { HourlySlot } from "./availability";

type DailyScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string | null;
  date: Date | null;
};

export default function DailyScheduleModal({
  isOpen,
  onClose,
  vehicleId,
  date,
}: DailyScheduleModalProps) {
  const {
    data: schedule,
    isLoading,
    isError,
    error,
  } = useVehicleDailySchedule({ vehicleId, date });

  if (!isOpen) {
    return null;
  }

  const formatHour = (startTime: string) => {
    const [hour] = startTime.split(":");
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const h = hourNum % 12 || 12;
    return `${h} ${ampm}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return <CustomLoader />;
    }
    if (isError) {
      return (
        <div className="text-red-600 p-4">
          Error: {error?.message || "Could not load schedule."}
        </div>
      );
    }
    if (!schedule) {
      return null;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
        {schedule.hourlySlots.map((slot: HourlySlot) => (
          <div
            key={slot.hour}
            className={`p-3 border ${
              slot.available
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">
                {formatHour(slot.startTime)}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  slot.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {slot.available ? "Available" : "Booked"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {slot.startTime} - {slot.endTime}
            </p>
            {!slot.available && (
              <p className="text-sm text-red-700 font-medium mt-1 truncate">
                {slot.bookingTypeName}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Hourly Schedule
              </h2>
              {schedule && (
                <p className="text-sm text-gray-600">
                  {schedule.vehicleName} ({schedule.vehicleIdentifier}){" on "}
                  <span className="font-medium">
                    {format(new Date(schedule.date), "PPP")}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}

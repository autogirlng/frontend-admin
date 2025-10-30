"use client";

import React, { useState, useEffect } from "react";

import { Driver, DriverSchedulePayload, Shift } from "./types";
import { getMonday } from "@/lib/utils/monday-time-utils";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import {
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetDriverSchedule,
  useUpdateDriverSchedule,
} from "@/lib/hooks/drivers-management/useDrivers";
import CustomLoader from "@/components/generic/CustomLoader";

interface DriverScheduleModalProps {
  driver: Driver;
  onClose: () => void;
}

const SHIFT_OPTIONS: Option[] = [
  { id: "NONE", name: "None" },
  { id: "DAY", name: "Day Shift" },
  { id: "NIGHT", name: "Night Shift" },
  { id: "ALL_DAY", name: "24hrs Shift" },
];

type ScheduleState = Omit<DriverSchedulePayload, "weekStartDate">;

const DAYS: (keyof ScheduleState)[] = [
  "mondayShift",
  "tuesdayShift",
  "wednesdayShift",
  "thursdayShift",
  "fridayShift",
  "saturdayShift",
  "sundayShift",
];

export function DriverScheduleModal({
  driver,
  onClose,
}: DriverScheduleModalProps) {
  const [weekStartDate, setWeekStartDate] = useState(getMonday(new Date()));

  // Form state for the 7 shifts
  const [schedule, setSchedule] = useState<ScheduleState | null>(null);

  const {
    data: fetchedSchedule,
    isLoading,
    isError,
    refetch,
  } = useGetDriverSchedule(driver.id, weekStartDate);

  const updateMutation = useUpdateDriverSchedule();

  // When fetched data arrives, update the form state
  useEffect(() => {
    if (fetchedSchedule) {
      setSchedule({
        mondayShift: fetchedSchedule.mondayShift,
        tuesdayShift: fetchedSchedule.tuesdayShift,
        wednesdayShift: fetchedSchedule.wednesdayShift,
        thursdayShift: fetchedSchedule.thursdayShift,
        fridayShift: fetchedSchedule.fridayShift,
        saturdayShift: fetchedSchedule.saturdayShift,
        sundayShift: fetchedSchedule.sundayShift,
      });
    } else {
      // Reset form if data is null (e.g., during fetch)
      setSchedule(null);
    }
  }, [fetchedSchedule]);

  const handleWeekChange = (daysToAdd: number) => {
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    setWeekStartDate(getMonday(currentDate));
  };

  const handleShiftChange = (day: keyof ScheduleState, option: Option) => {
    setSchedule((prev) =>
      prev ? { ...prev, [day]: option.id as Shift } : null
    );
  };

  const handleSubmit = () => {
    if (!schedule) return;

    const payload: DriverSchedulePayload = {
      ...schedule,
      weekStartDate,
    };

    updateMutation.mutate(
      { driverId: driver.id, payload },
      { onSuccess: () => refetch() }
    );
  };

  const isMutating = updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Driver Schedule: {driver.firstName} {driver.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isMutating}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- Modal Body --- */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Week Picker */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              className="w-auto px-3"
              onClick={() => handleWeekChange(-7)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <TextInput
              label="Week Of"
              id="week-start"
              hideLabel
              type="date"
              value={weekStartDate}
              onChange={(e) =>
                setWeekStartDate(getMonday(new Date(e.target.value)))
              }
              className="text-center font-semibold text-lg"
            />
            <Button
              variant="secondary"
              className="w-auto px-3"
              onClick={() => handleWeekChange(7)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Schedule Form */}
          {isLoading && <CustomLoader />}
          {isError && (
            <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p>Could not load schedule for this week.</p>
            </div>
          )}

          {schedule && !isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DAYS.map((day) => (
                <Select
                  key={day}
                  label={day
                    .replace("Shift", "")
                    .replace(/^[a-z]/, (char) => char.toUpperCase())}
                  options={SHIFT_OPTIONS}
                  selected={
                    SHIFT_OPTIONS.find((opt) => opt.id === schedule[day]) ||
                    null
                  }
                  onChange={(opt) => handleShiftChange(day, opt)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- Modal Footer --- */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isMutating}
            disabled={isLoading || isError || !schedule || isMutating}
            className="w-auto px-5"
          >
            Update Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}

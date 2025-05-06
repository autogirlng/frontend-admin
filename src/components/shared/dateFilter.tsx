import React, { useState } from "react";
import Icons from "./icons";
import Button from "./button";
import * as Popover from "@radix-ui/react-popover";
import cn from "classnames";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
} from "date-fns";

type DateFilterProps = {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
};

const DateFilter: React.FC<DateFilterProps> = ({
  onDateRangeChange,
  initialStartDate,
  initialEndDate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(
    initialStartDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const header = () => (
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-grey-700">
        {format(currentDate, "MMMM yyyy")}
      </p>
      <div className="flex gap-2 items-center ">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="outline-none text-primary-500"
        >
          {Icons.ic_chevron_left}
        </button>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="outline-none text-primary-500"
        >
          {Icons.ic_chevron_right}
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const firstDayOfMonth = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastDayOfMonth = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const numRows = Math.ceil(
      (lastDayOfMonth.getTime() - firstDayOfMonth.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    const totalDays = numRows * 7;

    const allDays = Array.from({ length: totalDays }, (_, i) =>
      addDays(firstDayOfMonth, i)
    );

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-grey-600">
        {days.map((day) => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
        {allDays.map((day) => {
          const isCurrentMonth = isWithinInterval(day, {
            start: monthStart,
            end: monthEnd,
          });
          const isSelectedStart = startDate && isSameDay(day, startDate);
          const isSelectedEnd = endDate && isSameDay(day, endDate);
          const isWithinSelection =
            startDate &&
            endDate &&
            isWithinInterval(day, { start: startDate, end: endDate });
          const isDisabled = !isCurrentMonth;

          const dayClassName = cn(
            "rounded-md cursor-pointer flex items-center justify-center h-8 w-8",
            isCurrentMonth ? "text-grey-900" : "text-grey-400",
            isSelectedStart &&
              "bg-primary-100 border  border-1.5  border-primary-500 text-primary-500",
            isSelectedEnd &&
              "bg-primary-100 border  border-1.5  border-primary-500 text-primary-500",
            isWithinSelection &&
              !isSelectedStart &&
              !isSelectedEnd &&
              "bg-primary-100 text-primary-500",
            isDisabled && "cursor-default"
          );

          const handleClick = () => {
            if (isDisabled) return;

            if (!startDate) {
              setStartDate(day);
            } else if (!endDate && day >= startDate) {
              setEndDate(day);
            } else {
              setStartDate(day);
              setEndDate(null);
            }
          };

          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={dayClassName}
              onClick={handleClick}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    );
  };

  const handleDone = () => {
    onDateRangeChange(startDate, endDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onDateRangeChange(null, null);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div className="flex items-center text-blue-800 bg-blue-50 rounded-md px-3 py-2 cursor-pointer justify-between">
          <p className="text-sm">Select Date Range</p>
          <span className="text-primary-500">{Icons.ic_calendar}</span>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="px-4 py-3 w-[300px] bg-white rounded-lg border border-grey-300 shadow-md z-50"
          sideOffset={5}
          side="bottom"
          align="end"
        >
          <div className="mb-2 flex justify-end">
            <button
              onClick={handleClear}
              className="text-xs text-primary-500 flex gap-2  items-center justify-between hover:underline outline-none"
            >
              <p>Clear All</p>
              <span className="text-primary-500 !h-5 !w-5">
                {Icons.ic_cancel_circle}
              </span>
            </button>
          </div>
          {header()}
          {renderDays()}
          <div className="mt-4 flex justify-around items-center gap-2">
            <button
              className="px-12 py-3 text-sm bg-grey-300 text-black font-semibold rounded-2xl  outline-none"
              onClick={() => setIsOpen(false)}
            >
              Back
            </button>
            <button
              className="px-12 py-3 text-sm text-white bg-primary-500  font-semibold rounded-2xl outline-none"
              onClick={handleDone}
              disabled={!startDate}
            >
              Done
            </button>
          </div>
          {startDate && endDate && (
            <div className="mt-3 py-2 px-3 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center justify-between">
              {format(startDate, "MMM do yyyy")} -{" "}
              {format(endDate, "MMM do yyyy")}
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  onDateRangeChange(null, null);
                }}
                className="outline-none text-blue-500 hover:underline"
              >
                {Icons.ic_cancel_circle}
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DateFilter;

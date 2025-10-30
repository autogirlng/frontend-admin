// components/generic/ui/DatePickerWithRange.tsx
"use client";

import React, { useState } from "react";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export function DatePickerWithRange({
  date,
  setDate,
  className = "",
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [displayMonth, setDisplayMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const handlePrevMonth = () => {
    setDisplayMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setDisplayMonth((prev) => addMonths(prev, 1));
  };

  const formatDate = (dateObj: Date, formatType = "short") => {
    if (!dateObj) return "";
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const shortMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month =
      formatType === "short"
        ? shortMonths[dateObj.getMonth()]
        : months[dateObj.getMonth()];
    return `${month} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  };

  const handleDateClick = (clickedDate: Date) => {
    if (!date?.from || (date?.from && date?.to)) {
      setDate({ from: clickedDate, to: undefined });
    } else if (clickedDate < date.from) {
      setDate({ from: clickedDate, to: date.from });
    } else {
      setDate({ from: date.from, to: clickedDate });
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
  };

  const isInRange = (checkDate: Date) => {
    if (!date?.from) return false;
    if (!date?.to && !hoveredDate) return false;
    const end = date.to || hoveredDate;
    if (!end) return false;
    return checkDate > date.from && checkDate < end;
  };

  const isRangeStart = (checkDate: Date) => {
    return date?.from && checkDate.toDateString() === date.from.toDateString();
  };

  const isRangeEnd = (checkDate: Date) => {
    return date?.to && checkDate.toDateString() === date.to.toDateString();
  };

  const formatDateRange = () => {
    if (!date?.from) return "Select date range";
    if (!date?.to) return formatDate(date.from);
    return `${formatDate(date.from)} - ${formatDate(date.to)}`;
  };

  const MonthCalendar = ({ month: displayDate }: { month: Date }) => {
    const today = new Date();
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="p-4">
        <div className="text-center font-semibold mb-4 text-gray-800">
          {months[month]} {year}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isStart = isRangeStart(day.date);
            const isEnd = isRangeEnd(day.date);
            const inRange = isInRange(day.date);
            const isToday = day.date.toDateString() === today.toDateString();

            return (
              <button
                key={idx}
                type="button"
                onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                onMouseEnter={() =>
                  day.isCurrentMonth && setHoveredDate(day.date)
                }
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!day.isCurrentMonth}
                className={`
                  relative h-9 w-9 text-sm rounded-lg transition-all
                  ${
                    !day.isCurrentMonth
                      ? "text-gray-300 cursor-default"
                      : "text-gray-700 hover:bg-blue-50"
                  }
                  ${
                    isStart || isEnd
                      ? "bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-sm"
                      : ""
                  }
                  ${inRange ? "bg-blue-100 text-blue-900" : ""}
                  ${
                    isToday && !isStart && !isEnd
                      ? "ring-2 ring-blue-400 ring-inset"
                      : ""
                  }
                  ${day.isCurrentMonth ? "cursor-pointer" : ""}
                `}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        // ✅ CHANGED:
        // 1. Removed `justify-between`
        // 2. Added `pr-10` to make space for the absolute "X" button
        className="w-full flex items-center justify-start px-4 py-3 pr-10 bg-white border-1 border-gray-300 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-[#0096FF]"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span
            className={
              date?.from ? "text-gray-800 font-medium" : "text-gray-400"
            }
          >
            {formatDateRange()}
          </span>
        </div>
        {/* ✅ "X" Button was removed from here */}
      </button>

      {/* ✅ "X" Button is now a SIBLING, positioned absolutely */}
      {date?.from && (
        <button
          type="button"
          onClick={clearDates}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="flex justify-between items-center px-4 pt-4 pb-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="flex divide-x divide-gray-200">
              <MonthCalendar month={displayMonth} />
              <MonthCalendar month={addMonths(displayMonth, 1)} />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={clearDates}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

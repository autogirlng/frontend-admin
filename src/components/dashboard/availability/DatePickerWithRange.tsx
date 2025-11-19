// components/generic/ui/DatePickerWithRange.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
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

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Recalculate position on resize/orientation change for mobile
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && triggerRef.current) {
        // Force re-render of style so position updates
        popoverRef.current?.style && (popoverRef.current.style.left = "0px");
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isOpen]);

  const handlePrevMonth = () => setDisplayMonth((prev) => addMonths(prev, -1));
  const handleNextMonth = () => setDisplayMonth((prev) => addMonths(prev, 1));

  const handleDateClick = (clickedDate: Date) => {
    if (!date?.from || date.to) {
      setDate({ from: clickedDate, to: undefined });
    } else if (clickedDate < date.from!) {
      setDate({ from: clickedDate, to: date.from });
    } else {
      setDate({ from: date.from, to: clickedDate });
      setTimeout(() => setIsOpen(false), 200);
    }
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
  };

  const isInRange = (day: Date) => {
    if (!date?.from) return false;
    const end = date.to || hoveredDate;
    if (!end) return false;
    return day > date.from && day < end;
  };

  const formatDisplay = () => {
    if (!date?.from) return "Select date range";
    if (!date?.to) return format(date.from, "MMM d, yyyy");
    return `${format(date.from, "MMM d, yyyy")} – ${format(
      date.to,
      "MMM d, yyyy"
    )}`;
  };

  const MonthCalendar = ({ month }: { month: Date }) => {
    const today = new Date();
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: Date[] = [];
    const prevMonthDays = new Date(year, monthNum, 0).getDate();

    // Previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, monthNum - 1, prevMonthDays - i));
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, monthNum, i));
    }
    // Next month
    while (days.length < 42) {
      days.push(new Date(year, monthNum + 1, days.length - daysInMonth + 1));
    }

    return (
      <div className="flex flex-col">
        <div className="text-center font-semibold text-gray-800 py-3 text-base">
          {format(month, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 text-xs font-medium text-gray-500">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="h-8 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px mt-1">
          {days.map((day, i) => {
            const isCurrentMonth = day.getMonth() === monthNum;
            const isToday = day.toDateString() === today.toDateString();
            const isStart =
              date?.from && day.toDateString() === date.from.toDateString();
            const isEnd =
              date?.to && day.toDateString() === date.to.toDateString();
            const inRange = isInRange(day);

            return (
              <button
                key={i}
                onClick={() => isCurrentMonth && handleDateClick(day)}
                onMouseEnter={() => isCurrentMonth && setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!isCurrentMonth}
                className={`
                  h-10 w-10 text-sm rounded-lg transition-all flex items-center justify-center
                  ${
                    !isCurrentMonth
                      ? "text-gray-300 cursor-default"
                      : "hover:bg-blue-50 cursor-pointer"
                  }
                  ${
                    isStart || isEnd
                      ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                      : ""
                  }
                  ${
                    inRange && !isStart && !isEnd
                      ? "bg-blue-100 text-blue-900"
                      : ""
                  }
                  ${
                    isToday && !isStart && !isEnd
                      ? "ring-2 ring-blue-500 ring-inset font-semibold"
                      : ""
                  }
                `}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-300
          text-left text-sm font-medium transition-all
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${date?.from ? "text-gray-900" : "text-gray-500"}
        `}
      >
        <Calendar className="h-5 w-5 shrink-0 text-gray-400" />
        <span className="flex-1 truncate">{formatDisplay()}</span>

        {/* Changed from <button> to <div role="button"> for validity + accessibility */}
        {date?.from && (
          <div
            role="button"
            tabIndex={0}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              clearDates(e);
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                clearDates(e as any);
              }
            }}
            className="shrink-0 p-1 -mr-2 hover:bg-gray-100 rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear date range"
          >
            <X className="h-4 w-4 text-gray-500" />
          </div>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown – fully responsive */}
          {/* Dropdown – fully responsive + scrollable on mobile */}
          <div
            ref={popoverRef}
            className={`
                fixed inset-x-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200
                overflow-hidden animate-in fade-in zoom-in-95 duration-200
                w-[95vw] max-w-lg left-1/2 -translate-x-1/2
                max-h-[85vh]
                flex flex-col
                sm:max-h-none sm:flex-none
                sm:w-auto sm:left-auto sm:-translate-x-0
          `}
            style={{
              top: triggerRef.current
                ? Math.min(
                    triggerRef.current.getBoundingClientRect().bottom +
                      window.scrollY +
                      8,
                    window.innerHeight * 0.1 + window.scrollY
                  )
                : 0,
              left:
                triggerRef.current && window.innerWidth >= 640
                  ? Math.min(
                      triggerRef.current.getBoundingClientRect().left,
                      window.innerWidth - 680
                    )
                  : "50%",
            }}
          >
            {/* NEW: Scrollable container */}
            <div className="flex-1 overflow-y-auto">
              {/* Navigation */}
              <div className="flex justify-between px-4 pt-4 pb-2 sm:px-6 sticky top-0 bg-white z-10">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Calendars */}
              <div className="flex flex-col sm:flex-row divide-x divide-gray-200">
                <div className="p-4 min-w-0">
                  <MonthCalendar month={displayMonth} />
                </div>
                <div className="p-4 min-w-0">
                  <MonthCalendar month={addMonths(displayMonth, 1)} />
                </div>
              </div>
            </div>

            {/* Footer – always sticks to bottom */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-4 sm:px-6 bg-gray-50 border-t">
              <button
                onClick={clearDates}
                className="order-2 sm:order-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition w-full sm:w-auto"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="order-1 sm:order-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
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

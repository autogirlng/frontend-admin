"use client";

import { Calendar } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModernDatePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxDate?: string;
  required?: boolean;
  disabled?: boolean;
}

export const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  label,
  value,
  onChange,
  maxDate,
  required,
  disabled = false,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Portal Positioning
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize View Date (default to value or today)
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) setViewDate(d);
    }
  }, [value]);

  // --- Positioning Logic ---
  const updatePosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const POPUP_HEIGHT = 320;

    let top = rect.bottom + window.scrollY + 8;
    // Flip to top if not enough space below
    if (viewportHeight - rect.bottom < POPUP_HEIGHT) {
      top = rect.top + window.scrollY - POPUP_HEIGHT;
    }

    setCoords({
      top,
      left: rect.left + window.scrollX,
    });
  };

  // --- Outside Click ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !calendarRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener(
        "scroll",
        () => {
          if (calendarRef.current) updatePosition(calendarRef.current);
        },
        true
      );
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => {}, true);
    };
  }, [showCalendar]);

  // --- Calendar Helpers ---
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    onChange(`${year}-${month}-${dayStr}`);
    setShowCalendar(false);
  };

  // --- Year/Month Selectors for Birthdays ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years
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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(viewDate);
    newDate.setFullYear(newYear);
    setViewDate(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(viewDate);
    newDate.setMonth(newMonth);
    setViewDate(newDate);
  };

  const isFutureDate = (day: number) => {
    if (!maxDate) return false;
    const check = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const max = new Date(maxDate);
    check.setHours(0, 0, 0, 0);
    max.setHours(0, 0, 0, 0);
    return check > max;
  };

  const CalendarPopup = (
    <div
      ref={popupRef}
      style={{ top: coords.top, left: coords.left, zIndex: 9999 }}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72 animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Header with Dropdowns for Fast Navigation */}
      <div className="flex gap-2 mb-4">
        <select
          value={viewDate.getMonth()}
          onChange={handleMonthChange}
          className="flex-1 p-1 text-sm border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={viewDate.getFullYear()}
          onChange={handleYearChange}
          className="flex-1 p-1 text-sm border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-xs font-semibold text-gray-400">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({
          length: getFirstDay(viewDate.getFullYear(), viewDate.getMonth()),
        }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({
          length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()),
        }).map((_, i) => {
          const day = i + 1;
          const isDisabled = isFutureDate(day);
          const isSelected =
            value ===
            `${viewDate.getFullYear()}-${String(
              viewDate.getMonth() + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          return (
            <button
              key={day}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(day)}
              className={`
                h-8 w-8 rounded-full text-sm flex items-center justify-center transition-colors
                ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
                ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        ref={calendarRef}
        onClick={(e) => {
          if (!disabled) {
            updatePosition(e.currentTarget);
            setShowCalendar(!showCalendar);
          }
        }}
        className={`
           relative w-full flex items-center gap-3 px-3 py-4 border cursor-pointer transition-colors bg-white
           ${
             disabled
               ? "bg-gray-100 cursor-not-allowed opacity-70"
               : "hover:bg-gray-50"
           }
           ${
             showCalendar
               ? "border-blue-500 ring-1 ring-blue-500"
               : "border-gray-300"
           }
        `}
      >
        <Calendar
          className={`h-4 w-4 ${
            showCalendar ? "text-blue-600" : "text-gray-500"
          }`}
        />
        <span
          className={`text-sm ${value ? "text-gray-900" : "text-gray-400"}`}
        >
          {value || "Select Date"}
        </span>
      </div>

      {mounted && showCalendar && createPortal(CalendarPopup, document.body)}
    </div>
  );
};

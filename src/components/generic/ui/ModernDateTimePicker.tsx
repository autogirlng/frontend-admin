"use client";

import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DateTimePickerProps {
  label: string;
  dateValue: string;
  timeValue: string;
  minDate?: string;
  onDateChange: (val: string) => void;
  onTimeChange: (val: string) => void;
  required?: boolean;
  disabledTimes?: string[];
}

export const ModernDateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  dateValue,
  timeValue,
  minDate,
  onDateChange,
  onTimeChange,
  required,
  disabledTimes = [],
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (dateValue) {
      const d = new Date(dateValue);
      if (!isNaN(d.getTime())) setCurrentMonth(d);
    }
  }, [dateValue]);

  const updatePosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const POPUP_WIDTH = 300;
    const POPUP_HEIGHT = 350;

    let left = rect.left + window.scrollX;

    if (rect.left + POPUP_WIDTH > viewportWidth) {
      const diff = rect.left + POPUP_WIDTH - viewportWidth;
      left = left - diff - 16;
    }

    if (left < 0) left = 16;

    let top = rect.bottom + window.scrollY + 8;
    let place: "top" | "bottom" = "bottom";

    const spaceBelow = viewportHeight - rect.bottom;

    if (spaceBelow < POPUP_HEIGHT && rect.top > POPUP_HEIGHT) {
      top = rect.top + window.scrollY - POPUP_HEIGHT + 40;
      place = "top";
    }

    setCoords({ top, left });
    setPlacement(place);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inCalendarTrigger = calendarRef.current?.contains(target);
      const inTimeTrigger = timeRef.current?.contains(target);
      const inPopup = popupRef.current?.contains(target);

      if (!inCalendarTrigger && !inPopup && showCalendar) {
        setShowCalendar(false);
      }
      if (!inTimeTrigger && !inPopup && showTimePicker) {
        setShowTimePicker(false);
      }
    }

    if (showCalendar || showTimePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener(
        "scroll",
        () => {
          if (showCalendar && calendarRef.current)
            updatePosition(calendarRef.current);
          if (showTimePicker && timeRef.current)
            updatePosition(timeRef.current);
        },
        true,
      );
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => {}, true);
    };
  }, [showCalendar, showTimePicker]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    onDateChange(`${year}-${month}-${dayStr}`);
    setShowCalendar(false);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(
      currentMonth.setMonth(currentMonth.getMonth() + offset),
    );
    setCurrentMonth(new Date(newDate));
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const minimum = new Date(minDate);
    checkDate.setHours(0, 0, 0, 0);
    minimum.setHours(0, 0, 0, 0);
    return checkDate < minimum;
  };

  const isSelectedDate = (day: number) => {
    if (!dateValue) return false;
    const selected = new Date(dateValue);
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 4 }, (_, i) =>
    String(i * 15).padStart(2, "0"),
  );

  const handleTimeClick = (type: "hour" | "minute", val: string) => {
    const [currentH, currentM] = (timeValue || "10:00").split(":");

    if (type === "hour") {
      let newMin = currentM || "00";

      if (disabledTimes.includes(`${val}:${newMin}`)) {
        const firstAvailableMin = minutes.find(
          (m) => !disabledTimes.includes(`${val}:${m}`),
        );
        if (firstAvailableMin) {
          newMin = firstAvailableMin;
        }
      }
      onTimeChange(`${val}:${newMin}`);
    } else {
      onTimeChange(`${currentH || "10"}:${val}`);
    }
  };

  const isHourFullyDisabled = (h: string) => {
    if (!disabledTimes || disabledTimes.length === 0) return false;
    return minutes.every((m) => disabledTimes.includes(`${h}:${m}`));
  };

  const isCurrentTimeDisabled =
    timeValue && disabledTimes.includes(timeValue) && dateValue;

  const CalendarPopup = (
    <div
      ref={popupRef}
      style={{ top: coords.top, left: coords.left, zIndex: 9999 }}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl p-4 w-72 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="font-semibold text-gray-800 text-sm">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-xs font-medium text-gray-400">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDateDisabled(day);
          const selected = isSelectedDate(day);
          const today = isToday(day);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => handleDateClick(day)}
              className={`
                h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all relative
                ${
                  selected
                    ? "bg-blue-600 text-white shadow-md font-medium"
                    : today
                      ? "text-blue-600 font-bold ring-1 ring-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-100"
                }
                ${
                  disabled
                    ? "opacity-30 cursor-not-allowed hover:bg-transparent"
                    : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  const TimePopup = (
    <div
      ref={popupRef}
      style={{ top: coords.top, left: coords.left, zIndex: 9999 }}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl flex overflow-hidden h-48 w-48 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex-1 overflow-y-auto border-r border-gray-100 no-scrollbar">
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
          Hrs
        </div>
        {hours.map((h) => {
          const disabled = isHourFullyDisabled(h);
          return (
            <div
              key={h}
              onClick={() => {
                if (disabled) return;
                handleTimeClick("hour", h);
              }}
              className={`px-4 py-2 text-sm text-center ${
                disabled
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : timeValue?.startsWith(h)
                    ? "bg-blue-100 text-blue-700 font-medium cursor-pointer"
                    : "text-gray-700 cursor-pointer hover:bg-blue-50"
              }`}
            >
              {h}
            </div>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
          Min
        </div>
        {minutes.map((m) => {
          const currentH = timeValue?.split(":")[0] || "10";
          const timeString = `${currentH}:${m}`;
          const disabled = disabledTimes.includes(timeString);

          return (
            <div
              key={m}
              onClick={() => {
                if (disabled) return;
                handleTimeClick("minute", m);
                setShowTimePicker(false);
              }}
              className={`px-4 py-2 text-sm text-center ${
                disabled
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : timeValue?.endsWith(m)
                    ? "bg-blue-100 text-blue-700 font-medium cursor-pointer"
                    : "text-gray-700 cursor-pointer hover:bg-blue-50"
              }`}
            >
              {m}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex flex-col sm:flex-row py-1 border bg-white divide-y sm:divide-y-0 sm:divide-x divide-gray-200 transition-colors ${
          isCurrentTimeDisabled ? "border-red-400" : "border-gray-300"
        }`}
      >
        <div
          ref={calendarRef}
          className="relative flex-grow p-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
          onClick={(e) => {
            updatePosition(e.currentTarget);
            setShowCalendar(!showCalendar);
            setShowTimePicker(false);
          }}
        >
          <div className="flex items-center gap-3">
            <Calendar
              className={`h-4 w-4 ${
                showCalendar
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-blue-500"
              }`}
            />
            <span
              className={`text-sm ${
                dateValue ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {dateValue || "Select Date"}
            </span>
          </div>
        </div>

        <div
          ref={timeRef}
          className="relative w-full sm:w-1/3 p-2.5 hover:bg-gray-50 cursor-pointer transition-colors group bg-gray-50 sm:bg-white"
          onClick={(e) => {
            updatePosition(e.currentTarget);
            setShowTimePicker(!showTimePicker);
            setShowCalendar(false);
          }}
        >
          <div className="flex items-center gap-3">
            <Clock
              className={`h-4 w-4 ${
                isCurrentTimeDisabled
                  ? "text-red-500"
                  : showTimePicker
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-blue-500"
              }`}
            />
            <span
              className={`text-sm flex flex-col leading-tight ${
                isCurrentTimeDisabled
                  ? "text-red-500 font-semibold"
                  : timeValue
                    ? "text-gray-900"
                    : "text-gray-400"
              }`}
            >
              {timeValue || "00:00"}
              {isCurrentTimeDisabled && (
                <span className="text-[9px] text-red-500 uppercase tracking-wide">
                  Unavailable
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {mounted && showCalendar && createPortal(CalendarPopup, document.body)}
      {mounted && showTimePicker && createPortal(TimePopup, document.body)}
    </div>
  );
};

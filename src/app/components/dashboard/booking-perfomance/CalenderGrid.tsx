import { cn } from "@/lib/utils";
import {
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";

interface DayTrip {
  date: Date;
  trips?: number;
  isCurrentMonth: boolean;
}

interface CalendarGridProps {
  month: Date;
  selectedDate: Date | null;
  onDaySelect: (date: Date) => void;
}

function getCalendarDays(month: Date): DayTrip[] {
  const firstDayOfMonth = startOfMonth(month);
  const lastDayOfMonth = endOfMonth(month);

  const firstDayGrid = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const lastDayGrid = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const days: DayTrip[] = [];
  let current = firstDayGrid;

  while (current <= lastDayGrid) {
    days.push({
      date: current,
      trips:
        isSameMonth(current, month) && current.getDate() % 2 === 0
          ? 50
          : undefined, // Mock: only even dates have trips
      isCurrentMonth: isSameMonth(current, month),
    });
    current = addDays(current, 1);
  }
  return days;
}

const CalendarGrid = ({
  month,
  selectedDate,
  onDaySelect,
}: CalendarGridProps) => {
  const days = getCalendarDays(month);
  const today = new Date();
  const firstDayOfGrid = days[0].date;
  const lastDayOfGrid = days[days.length - 1].date;

  return (
    <div className=" bg-white w-full p-0 overflow-hidden mb-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-white text-[#8E9196] text-xs h-10">
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((wd) => (
          <div
            key={wd}
            className="flex items-center justify-center h-10 font-medium"
          >
            {wd}
          </div>
        ))}
      </div>
      {/* Days grid */}
      <div className="grid grid-cols-7 auto-rows-[100px]">
        {days.map((d, i) => {
          const isSelected = selectedDate && isSameDay(d.date, selectedDate);
          const isToday = isSameDay(d.date, today);
          const grayed = !d.isCurrentMonth;
          const isFirstRow = i < 7;
          const isLastRow = i >= days.length - 7;
          const isFirstCol = i % 7 === 0;
          const isLastCol = i % 7 === 6;

          const roundedTopLeft = isFirstRow && isFirstCol;
          const roundedTopRight = isFirstRow && isLastCol;
          const roundedBottomLeft = isLastRow && isFirstCol;
          const roundedBottomRight = isLastRow && isLastCol;

          return (
            <button
              key={d.date.toISOString()}
              onClick={() => d.isCurrentMonth && onDaySelect(d.date)}
              className={cn(
                "border-1 border-[#D0D5DD] flex flex-col p-2 items-end justify-around gap-1 w-full h-full text-sm font-medium focus:outline-none",
                grayed && "bg-[#F3F3F3] text-[#C8C8C9] cursor-default",
                !grayed && "bg-white hover:bg-[#F6F6F7]",
                isSelected && "border-2 border-[#1EAEDB] z-10",
                isToday && !isSelected && "text-[#1EAEDB]",
                roundedTopLeft && "rounded-tl-[24px]",
                roundedTopRight && "rounded-tr-[24px]",
                roundedBottomLeft && "rounded-bl-[24px]",
                roundedBottomRight && "rounded-br-[24px]"
              )}
              style={{
                position: "relative",
              }}
              disabled={!d.isCurrentMonth}
            >
              <span
                className={cn(
                  "z-10 text-black text-right",
                  isSelected
                    ? "text-[#1EAEDB] font-bold"
                    : grayed
                    ? "font-normal "
                    : ""
                )}
              >
                {d.date.getDate()}
              </span>
              {/* Show trips or Add as in design */}
              {d.isCurrentMonth &&
                (d.trips ? (
                  <span
                    className={cn(
                      "rounded-full px-3 py-[2px] text-xs font-semibold",
                      isSelected
                        ? "bg-[#1EAEDB] text-white"
                        : "bg-[#403E43] text-white"
                    )}
                    style={{ fontSize: 12, marginTop: 6 }}
                  >
                    {d.trips} trips
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 mt-2 border border-[#1EAEDB] px-2 rounded-full text-[#1EAEDB] text-xs font-medium"
                    style={{ fontSize: 12 }}
                  >
                    + Add
                  </span>
                ))}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;

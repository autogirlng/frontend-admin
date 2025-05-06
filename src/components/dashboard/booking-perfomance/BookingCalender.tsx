import { useState } from "react";
import { format, setMonth, setYear } from "date-fns";
import CalendarGrid from "./CalenderGrid";
import MonthYearBar from "./MonthYearBar";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const BookingCalendar = ({
  selectedDate,
  onDateSelect,
}: BookingCalendarProps) => {
  const [month, setMonthState] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  // Change month
  const handleMonthChange = (date: Date) => {
    setMonthState(date);
  };

  // Change year
  const handleYearChange = (year: number) => {
    setMonthState((prev) => setYear(new Date(prev), year));
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <MonthYearBar
        month={month}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <CalendarGrid
        month={month}
        selectedDate={selectedDate ?? null}
        onDaySelect={(d) => onDateSelect(d)}
      />
    </div>
  );
};

export default BookingCalendar;

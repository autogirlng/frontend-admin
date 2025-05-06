import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthNavigatorProps {
  currentMonth: Date;
  onChange: (date: Date) => void;
}

const MonthNavigator = ({ currentMonth, onChange }: MonthNavigatorProps) => {
  const nextMonth = () => {
    onChange(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    onChange(subMonths(currentMonth, 1));
  };

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

  const currentYear = new Date().getFullYear();
  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  const handleMonthChange = (month: string) => {
    const monthIndex = months.findIndex((m) => m === month);
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    onChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    onChange(newDate);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
      <h2 className="text-xl font-semibold">
        {format(currentMonth, "MMMM yyyy")}
      </h2>

      <div className="flex items-center space-x-2">
        <Select
          value={format(currentMonth, "MMMM")}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={format(currentMonth, "yyyy")}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-9 w-9 ml-1"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthNavigator;

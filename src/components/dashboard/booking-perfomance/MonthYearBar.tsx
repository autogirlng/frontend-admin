import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MonthYearBarProps {
  month: Date;
  onMonthChange: (date: Date) => void;
  onYearChange: (year: number) => void;
}

const monthsShort = [
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

const MonthYearBar = ({
  month,
  onMonthChange,
  onYearChange,
}: MonthYearBarProps) => {
  const year = month.getFullYear();

  // Show 4 years: this, previous, next, next+1
  const years = [year - 1, year, year + 1, year + 2];

  return (
    <div className="flex items-center gap-2  w-full mb-4 flex-wrap">
      <div className="flex ">
        {monthsShort.map((m, idx) => (
          <button
            key={m}
            className={cn(
              "border-1 px-3 py-2 text-sm font-semibold min-w-21 text-center",
              idx === month.getMonth()
                ? "bg-[#1EAEDB] border-[#1EAEDB]  text-white"
                : "bg-transparent border-[#D0D5DD] text-[#8E9196] hover:bg-[#F6F6F7]",
              idx === 0 && "rounded-l-md",
              idx === monthsShort.length - 1 && "rounded-r-md"
            )}
            onClick={() => onMonthChange(new Date(year, idx, 1))}
            data-active={idx === month.getMonth()}
            style={{
              transition: "background .15s, color .15s",
            }}
            type="button"
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex  gap-2 items-center">
        <Select
          value={String(year)}
          onValueChange={(v) => onYearChange(Number(v))}
        >
          <SelectTrigger className="max-w-[80px] h-8  border-[#D0D5DD] text-[#8E9196]  bg-white px-3 py-1 text-sm font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem value={String(y)} key={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MonthYearBar;

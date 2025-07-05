"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter as FilterIcon, X, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterProps {
  onFilterChange?: (selectedPeriod: string, dateRange?: { startDate: Date | null, endDate: Date | null }) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all_time");
  const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: null, endDate: null });
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const filterRef = useRef<HTMLDivElement>(null);

  // Filter period options
  const periodOptions: FilterOption[] = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "this_week", label: "This Week" },
    { id: "this_month", label: "This Month" },
    { id: "last_30_days", label: "Last 30 Days" },
    { id: "last_90_days", label: "Last 90 Days" },
  ];

  // Handle period selection
  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriod(periodId);
    setRange({ from: undefined, to: undefined });
    setDateRange({ startDate: null, endDate: null });
    if (onFilterChange) {
      onFilterChange(periodId);
    }
  };

  // Handle custom date range selection
  const handleDateRangeChange = (ranges: any) => {
    const range = ranges.selection;
    setDateRange({ startDate: range.startDate, endDate: range.endDate });
    setSelectedPeriod('custom');
    if (onFilterChange) {
      onFilterChange('custom', { startDate: range.startDate, endDate: range.endDate });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  return (
    <div className="relative flex flex-row justify-start w-full" ref={filterRef}>
      {/* Force background color for debugging */}
      {/* Filter Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors z-50 shadow-lg relative w-auto"
        onClick={() => { setIsFilterOpen(!isFilterOpen); }}
        aria-expanded={isFilterOpen}
        aria-controls="filter-dropdown"
      >
        <FilterIcon size={16} />
        <span style={{ fontSize: 13 }}>Filter</span>
        <ChevronDown size={18} className={isFilterOpen ? "rotate-180" : ""} />
      </button>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div
          id="filter-dropdown"
          className="absolute z-50 mt-2 w-full max-w-xs sm:max-w-md md:max-w-md bg-white rounded-lg shadow-lg border border-primary-100 overflow-hidden left-0 sm:left-auto sm:right-0"
          style={{ top: "calc(100% + 5px)" }}
        >
          <div className="flex flex-col pt-4 px-4">
            <h3
              className="text-sm font-semibold text-[#344054]"
              style={{ fontSize: 15 }}
            >
              Filter By
            </h3>
            <div className="flex justify-between items-center mt-2">
              <h4 className=" text-sm text-gray-800">Period</h4>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <div className="space-y-2">
                {periodOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center rounded transition-colors px-1 py-1 ${selectedPeriod === option.id ? 'bg-primary-50 border border-primary-400' : ''}`}
                  >
                    <input
                      type="radio"
                      id={`period-${option.id}`}
                      name="period"
                      checked={selectedPeriod === option.id}
                      onChange={() => handlePeriodSelect(option.id)}
                      className="w-5 h-5 accent-primary-500 border-primary-400 rounded-full focus:ring-primary-500"
                    />
                    <label
                      htmlFor={`period-${option.id}`}
                      className={`ml-2 text-sm font-medium ${selectedPeriod === option.id ? 'text-primary-700' : 'text-gray-900'}`}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
                <p className="text-[13px] mt-2">Custom Date</p>
                <div className="flex flex-col mt-2">
                  <h4 className="text-sm text-gray-800 mb-1">Select Date Range</h4>
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={(selectedRange) => {
                      setRange(selectedRange as { from: Date | undefined; to: Date | undefined });
                      if (selectedRange?.from && selectedRange?.to) {
                        setSelectedPeriod('date_range');
                        setDateRange({ startDate: selectedRange.from, endDate: selectedRange.to });
                        if (onFilterChange) {
                          onFilterChange('date_range', { startDate: selectedRange.from, endDate: selectedRange.to });
                        }
                      } else if (!selectedRange?.from && !selectedRange?.to) {
                        setSelectedPeriod('all_time');
                        setDateRange({ startDate: null, endDate: null });
                        if (onFilterChange) {
                          onFilterChange('all_time', { startDate: null, endDate: null });
                        }
                      }
                    }}
                    numberOfMonths={window.innerWidth < 640 ? 1 : 2}
                    className="border border-primary-100 rounded-md w-full max-w-full"
                    classNames={{
                      day_selected: 'bg-primary-500 text-white shadow-lg border-2 border-primary-600 hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white',
                      day_range_start: 'day-range-start bg-primary-500 text-white shadow-lg border-2 border-primary-600',
                      day_range_end: 'day-range-end bg-primary-500 text-white shadow-lg border-2 border-primary-600',
                      day_range_middle: 'bg-primary-100 text-primary-900',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;

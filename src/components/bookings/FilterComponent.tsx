"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Filter as FilterIcon, X, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"; // Assuming this is a shadcn/ui calendar

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
    { id: "all_time", label: "All Time" }, // Added All Time for explicit selection
  ];

  // Determine number of months for calendar based on screen size
  const getNumberOfMonths = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 1 : 2; // 1 month on small screens, 2 on medium and larger
    }
    return 2; // Default for SSR or initial render
  }, []);

  const [numberOfMonths, setNumberOfMonths] = useState(getNumberOfMonths());

  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(getNumberOfMonths());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getNumberOfMonths]);

  // Handle period selection
  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriod(periodId);
    setRange({ from: undefined, to: undefined }); // Clear custom range
    setDateRange({ startDate: null, endDate: null }); // Clear custom date range
    if (onFilterChange) {
      onFilterChange(periodId, { startDate: null, endDate: null });
    }
    setIsFilterOpen(false); // Close filter after selection
  };

  // Handle custom date range selection
  const handleDateRangeSelect = (selectedRange: any) => {
    const range = selectedRange?.from && selectedRange?.to 
      ? { from: selectedRange.from, to: selectedRange.to }
      : { from: undefined, to: undefined };
    
    setRange(range);

    if (selectedRange?.from && selectedRange?.to) {
      setSelectedPeriod('custom_range'); // Use a distinct ID for custom range
      setDateRange({ startDate: selectedRange.from, endDate: selectedRange.to });
      if (onFilterChange) {
        onFilterChange('custom_range', { startDate: selectedRange.from, endDate: selectedRange.to });
      }
      setIsFilterOpen(false); // Close filter after custom range selection
    } else if (!selectedRange?.from && !selectedRange?.to && selectedPeriod !== 'all_time') {
      // If a range is cleared, revert to 'All Time' or initial state
      setSelectedPeriod('all_time');
      setDateRange({ startDate: null, endDate: null });
      if (onFilterChange) {
        onFilterChange('all_time', { startDate: null, endDate: null });
      }
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
  }, []);

  return (
    <div className="relative flex justify-end w-full sm:w-auto" ref={filterRef}>
      {/* Filter Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg z-10 w-auto"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        aria-expanded={isFilterOpen}
        aria-controls="filter-dropdown"
      >
        <FilterIcon size={16} />
        <span className="text-sm">Filter</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div
          id="filter-dropdown"
          className="absolute right-0 mt-2 w-full sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[800px] bg-white rounded-lg shadow-lg border border-primary-100 overflow-hidden z-20"
          style={{ top: "calc(100% + 5px)" }}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-primary-100">
            <h3 className="text-base font-semibold text-[#344054]">Filter By</h3>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filter"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row p-4 gap-4">
            {/* Period Options */}
            <div className="flex-1 min-w-[150px]">
              <h4 className="text-sm text-gray-800 mb-2 font-medium">Period</h4>
              <div className="space-y-2">
                {periodOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center rounded-md p-2 cursor-pointer transition-colors ${selectedPeriod === option.id ? 'bg-primary-50 border border-primary-400' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePeriodSelect(option.id)}
                  >
                    <input
                      type="radio"
                      id={`period-${option.id}`}
                      name="period"
                      checked={selectedPeriod === option.id}
                      onChange={() => handlePeriodSelect(option.id)}
                      className="w-4 h-4 accent-primary-500 border-gray-300 focus:ring-primary-500"
                      aria-labelledby={`period-label-${option.id}`}
                    />
                    <label
                      htmlFor={`period-${option.id}`}
                      id={`period-label-${option.id}`}
                      className={`ml-2 text-sm font-medium ${selectedPeriod === option.id ? 'text-primary-700' : 'text-gray-900'} cursor-pointer`}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="flex-1 mt-4 sm:mt-0">
              <h4 className="text-sm text-gray-800 mb-2 font-medium">Custom Date Range</h4>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={numberOfMonths}
                  className="border border-primary-100 rounded-md w-full"
                  classNames={{
                    day_selected: 'bg-primary-500 text-white shadow-lg border-2 border-primary-600 hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white',
                    day_range_start: 'day-range-start bg-primary-500 text-white shadow-lg border-2 border-primary-600',
                    day_range_end: 'day-range-end bg-primary-500 text-white shadow-lg border-2 border-primary-600',
                    day_range_middle: 'bg-primary-100 text-primary-900',
                    // Add more classNames for better styling and responsiveness of calendar itself if needed
                    // For example, to adjust padding or font sizes within the calendar.
                    // head_cell: 'text-sm',
                    // row: 'flex-row',
                    // cell: 'p-1'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
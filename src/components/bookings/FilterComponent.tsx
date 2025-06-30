"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter as FilterIcon, X, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import DateRangeCalendar from "@/components/shared/calendar";

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
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: null, endDate: null });
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
    setShowDateRange(false);
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
    <div className="relative" ref={filterRef}>
      {/* Filter Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
        onClick={() => { console.log('Filter button clicked'); setIsFilterOpen(!isFilterOpen); }}
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
          className="absolute z-50 mt-2 w-80 bg-white rounded-lg shadow-lg border-2 border-red-500 overflow-hidden"
          style={{ background: '#ffeaea', top: "calc(100% + 5px)", right: 0 }}
        >
          <div className="flex flex-col  pt-4 px-4">
            <h3
              className="text-sm font-semibold text-[#344054]"
              style={{ fontSize: 15 }}
            >
              Filter By
            </h3>
            <div className="flex justify-between items-center mt-2">
              <h4 className=" text-sm text-gray-800">Period</h4>
              {/* <ChevronUp size={18} className="text-gray-500" /> */}
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <div className="space-y-2">
                {periodOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`period-${option.id}`}
                      checked={selectedPeriod === option.id}
                      onChange={() => handlePeriodSelect(option.id)}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`period-${option.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
                <p className="text-[13px] mt-2">Custom Date</p>
                <div className="flex justify-between items-center mt-2">
                  <h4 className=" text-sm text-gray-800">Select Date Range</h4>
                  <CalendarDays size={20} className="text-gray-500 cursor-pointer" onClick={() => setShowDateRange(!showDateRange)} />
                </div>
                {showDateRange && (
                  <div className="mt-2">
                    <DateRangeCalendar
                      title="Select Date Range"
                      selectRange={true}
                      value={
                        dateRange.startDate || dateRange.endDate
                          ? [dateRange.startDate, dateRange.endDate]
                          : null
                      }
                      onChange={(value) => {
                        if (Array.isArray(value)) {
                          setDateRange({ startDate: value[0], endDate: value[1] });
                          setSelectedPeriod('custom');
                          if (onFilterChange) {
                            onFilterChange('custom', { startDate: value[0], endDate: value[1] });
                          }
                        } else if (value === null) {
                          setDateRange({ startDate: null, endDate: null });
                          setSelectedPeriod('all_time');
                          if (onFilterChange) {
                            onFilterChange('all_time', { startDate: null, endDate: null });
                          }
                        }
                      }}
                      setCalendarValues={(value) => {
                        if (Array.isArray(value)) {
                          setDateRange({ startDate: value[0], endDate: value[1] });
                        } else if (value === null) {
                          setDateRange({ startDate: null, endDate: null });
                        }
                      }}
                      isOpen={showDateRange}
                      handleIsOpen={setShowDateRange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;

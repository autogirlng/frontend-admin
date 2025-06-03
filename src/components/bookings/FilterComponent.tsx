"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter as FilterIcon, X, ChevronDown, ChevronUp } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterProps {
  onFilterChange?: (selectedPeriod: string) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all_time");
  const filterRef = useRef<HTMLDivElement>(null);

  // Filter period options
  const periodOptions: FilterOption[] = [
    { id: "all_time", label: "All Time" },
    { id: "this_month", label: "This Month" },
    { id: "this_week", label: "This Week" },
    { id: "last_30_days", label: "Last 30 Days" },
    { id: "last_90_days", label: "Last 90 Days" },
  ];

  // Get selected period label
  const getSelectedPeriodLabel = () => {
    const option = periodOptions.find((option) => option.id === selectedPeriod);
    return option ? option.label : "All Time";
  };

  // Handle period selection
  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriod(periodId);
    if (onFilterChange) {
      onFilterChange(periodId);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedPeriod("all_time");
    if (onFilterChange) {
      onFilterChange("all_time");
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
        onClick={() => setIsFilterOpen(!isFilterOpen)}
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
          className="absolute z-10 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          style={{ top: "calc(100% + 5px)", right: 0 }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3
              className="text-lg font-medium text-gray-800"
              style={{ fontSize: 16 }}
            >
              Filter By
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
            >
              Clear all
              <X size={16} className="ml-1" />
            </button>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-base font-medium text-gray-800">Period</h4>
                <ChevronUp size={18} className="text-gray-500" />
              </div>

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
              </div>
            </div>

            {/* You can add more filter sections here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;

import React, { useState, useEffect, useRef } from "react";
import Icons from "./icons";
import * as Popover from "@radix-ui/react-popover";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Checkbox from "@radix-ui/react-checkbox";
import cn from "classnames";
import { format } from "date-fns";
import DateFilter from "./dateFilter";

type FilterOption = {
  option: string;
  value: string;
};

type FilterCategory = {
  title: string;
  options: FilterOption[];
};

type FilterByProps = {
  categories: FilterCategory[];
  onChange: (
    selectedFilters: Record<string, string[]>,
    dateRange?: { startDate: Date | null; endDate: Date | null }
  ) => void;
  hideOnMobile?: boolean;
  dateEnabled?: boolean;
};

const FilterBy: React.FC<FilterByProps> = ({
  categories,
  onChange,
  hideOnMobile,
  dateEnabled = false,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    categories.reduce(
      (acc, category, index) => ({ ...acc, [category.title]: index === 0 }),
      {}
    )
  );

  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setDateRange({ startDate, endDate });
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleCheckboxChange = (categoryTitle: string, optionValue: string) => {
    setSelectedFilters((prevFilters) => {
      const filters = { ...prevFilters };
      if (filters[categoryTitle]?.includes(optionValue)) {
        filters[categoryTitle] = filters[categoryTitle].filter(
          (item) => item !== optionValue
        );
      } else {
        filters[categoryTitle] = [
          ...(filters[categoryTitle] || []),
          optionValue,
        ];
      }
      return filters;
    });
  };

  useEffect(() => {
    onChange(selectedFilters, dateRange); // Pass both filters and date range
  }, [selectedFilters, dateRange, onChange]);

  useEffect(() => {
    if (contentRef.current && isOpen) {
      setContentHeight(contentRef.current.scrollHeight);
      document.body.style.minHeight = `calc(100vh + ${contentHeight}px)`;
      document.body.style.overflow = "auto";
    } else {
      setContentHeight(0);
      document.body.style.minHeight = "";
      document.body.style.overflow = "";
    }
    return () => {
      setContentHeight(0);
      document.body.style.minHeight = "";
      document.body.style.overflow = "";
    };
  }, [categories, selectedFilters, openSections, isOpen]);

  const addSpaceBeforeUppercase = (str: string): string => {
    return str?.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setDateRange({ startDate: null, endDate: null });
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className="cursor-pointer outline-none text-grey-600 flex items-center
           gap-2 border border-grey-300 rounded-xl p-3 hover:border-primary-500"
          aria-label="Filter"
        >
          {Icons.ic_filter}
          <span
            className={cn(
              "text-grey-500 text-sm",
              hideOnMobile && "hidden sm:block"
            )}
          >
            Filter
          </span>
          <span className={cn(hideOnMobile && "hidden sm:block")}>
            {Icons.ic_chevron_down}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="px-6 py-[14px] w-[360px] bg-white rounded-3xl border border-grey-300 shadow-[-2px_4px_6px_-2px_#10192808,12px_16px_37.4px_-4px_#10192814] "
          sideOffset={5}
          side="bottom"
          avoidCollisions={false}
          align="end"
        >
          <div className="space-y-3" ref={contentRef}>
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-grey-700">Filter By</p>
              <button
                onClick={handleClearAll}
                className="text-xs flex gap-2 items-center text-primary-500 hover:underline outline-none"
              >
                Clear all{" "}
                <span className="!h-5 !w-5">{Icons.ic_cancel_circle}</span>
              </button>
            </div>
            <div className="space-y-6">
              {categories.map((category) => (
                <Collapsible.Root
                  key={category.title}
                  open={openSections[category.title]}
                  onOpenChange={() => toggleSection(category.title)}
                  className="space-y-2"
                >
                  <div key={category.title} className="space-y-3 text-grey-900">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection(category.title)}
                    >
                      <p className="text-sm capitalize">
                        {addSpaceBeforeUppercase(category.title)}
                      </p>
                      {openSections[category.title]
                        ? Icons.ic_chevron_up
                        : Icons.ic_chevron_down}
                    </div>
                    <Collapsible.Content className="space-y-3">
                      {category.options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox.Root
                            className={cn(
                              "w-6 h-6 rounded",
                              selectedFilters[category.title]?.includes(
                                option.value
                              )
                                ? "bg-primary-400"
                                : "bg-white border-[1.5px] border-grey-300"
                            )}
                            checked={selectedFilters[category.title]?.includes(
                              option.value
                            )}
                            onCheckedChange={() =>
                              handleCheckboxChange(category.title, option.value)
                            }
                          >
                            <Checkbox.Indicator className="flex items-center justify-center text-white">
                              {Icons.ic_check}
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          <label htmlFor={option.value} className="text-sm">
                            {option.option}
                          </label>
                        </div>
                      ))}
                    </Collapsible.Content>
                  </div>
                </Collapsible.Root>
              ))}

              {dateEnabled && (
                <div className="mt-4">
                  <DateFilter
                    onDateRangeChange={handleDateRangeChange}
                    initialStartDate={dateRange.startDate}
                    initialEndDate={dateRange.endDate}
                  />
                  {dateRange.startDate && dateRange.endDate && (
                    <div className="mt-2 text-xs text-grey-600 p-3 flex items-center justify-between rounded-lg bg-[#EDF8FF] ">
                      <p className="text-primary-500">
                        {format(dateRange.startDate, "MMM do yyyy")} -{" "}
                        {format(dateRange.endDate, "MMM do yyyy")}
                      </p>
                      <button
                        onClick={() =>
                          setDateRange({ startDate: null, endDate: null })
                        }
                        className="ml-2 text-primary-500  hover:underline outline-none"
                      >
                        <span className="*:!w-5 *:!h-5">
                          {Icons.ic_close_circle}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default FilterBy;

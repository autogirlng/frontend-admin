"use client";

import React, { useState, useEffect, useRef } from "react";
import Icons from "./icons";
import * as Popover from "@radix-ui/react-popover";
import * as Collapsible from "@radix-ui/react-collapsible";
import cn from "classnames";

// Define types for FilterOption and FilterCategory
type FilterOption = {
  option: string;
  value: string;
};

type FilterCategory = {
  title: string;
  options: FilterOption[];
};

// Props for the SingleFilterBy component
type SingleFilterByProps = {
  categories: FilterCategory[];
  onChange: (selectedFilters: Record<string, string>) => void; // Changed to single string for value
  hideOnMobile?: boolean;
};

const SingleFilterBy: React.FC<SingleFilterByProps> = ({
  categories,
  onChange,
  hideOnMobile,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // State to hold selected filters, where each category can only have one selected value
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  // State to manage the open/closed status of collapsible sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    categories.reduce(
      (acc, category, index) => ({ ...acc, [category.title]: index === 0 }), // Open the first category by default
      {}
    )
  );

  // Function to toggle the open/closed state of a category section
  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Handler for selecting a single option within a category
  const handleOptionSelect = (categoryTitle: string, optionValue: string) => {
    setSelectedFilters((prevFilters) => {
      // If the same option is selected again, deselect it (toggle off)
      if (prevFilters[categoryTitle] === optionValue) {
        const newFilters = { ...prevFilters };
        delete newFilters[categoryTitle]; // Remove the category entry
        return newFilters;
      } else {
        // Otherwise, set the new selected option for the category
        return {
          ...prevFilters,
          [categoryTitle]: optionValue,
        };
      }
    });
    // Close the popover after selection (optional, but common for single-select filters)
    setIsOpen(false);
  };

  // Effect to call the onChange prop whenever selectedFilters changes
  useEffect(() => {
    onChange(selectedFilters);
  }, [selectedFilters, onChange]);

  // Effect for managing content height and body overflow (similar to your FilterBy)
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
  }, [categories, selectedFilters, openSections, isOpen, contentHeight]); // Added contentHeight to dependencies for correct recalculation

  // Helper function to add space before uppercase letters for better readability
  const addSpaceBeforeUppercase = (str: string): string => {
    return str?.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  // Handler to clear all selected filters
  const handleClearAll = () => {
    setSelectedFilters({});
    setIsOpen(false); // Close popover after clearing
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
          className="px-6 py-[14px] w-[360px] bg-white rounded-3xl border border-grey-300 shadow-[-2px_4px_6px_-2px_#10192808,12px_16px_37.4px_-4px_#10192814]"
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
                          className="flex items-center space-x-3 cursor-pointer" // Added cursor-pointer to the whole div
                          onClick={() =>
                            handleOptionSelect(category.title, option.value)
                          }
                        >
                          {/* Use a radio-like indicator or a custom checkmark for single selection */}
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center",
                              selectedFilters[category.title] === option.value
                                ? "bg-primary-400 border-primary-400"
                                : "bg-white border-grey-300"
                            )}
                          >
                            {selectedFilters[category.title] ===
                              option.value && (
                              <span className="text-white">
                                {Icons.ic_check} {/* Or a smaller dot icon */}
                              </span>
                            )}
                          </div>
                          <label
                            htmlFor={option.value}
                            className="text-sm cursor-pointer"
                          >
                            {option.option}
                          </label>
                        </div>
                      ))}
                    </Collapsible.Content>
                  </div>
                </Collapsible.Root>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SingleFilterBy;

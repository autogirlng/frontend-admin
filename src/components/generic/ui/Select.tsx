"use client";
import { ChevronDown, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export type Option = { id: string; name: string };

type SelectProps = {
  label: string;
  options: Option[];
  selected?: Option | null;
  onChange?: (selection: Option) => void;
  placeholder?: string;
  error?: string;
  hideLabel?: boolean;
  className?: string;
  disabled?: boolean;
};

const Select = ({
  label,
  options,
  selected = null,
  onChange = () => {},
  placeholder = "Select an option",
  error,
  hideLabel = false,
  className,
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (!disabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF]";

  const disabledClasses =
    "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <div className="relative" ref={selectRef}>
      {!hideLabel && (
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <Info className="w-4 h-4 ml-1 text-black" />
        </div>
      )}

      <div className={clsx(!hideLabel && "mt-1")}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={clsx(
            `relative w-full bg-white border pl-4 pr-10 py-[15px] text-left cursor-default 
             focus:outline-none focus:ring-1 sm:text-sm
             transition duration-150 ease-in-out`,
            errorClasses,
            disabledClasses,
            className
          )}
        >
          <span className="block truncate">
            {selected ? (
              selected.name
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown
              className={clsx(
                "h-5 w-5 text-black transform transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </span>
        </button>
        {!hideLabel && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
      {isOpen && !disabled && (
        <div className="absolute mt-1 w-full bg-white shadow-lg z-10 border border-gray-200">
          <ul
            role="listbox"
            className="max-h-56 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
          >
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="text-gray-900 cursor-default select-none relative py-2 pl-4 pr-9 hover:bg-indigo-50"
                role="option"
              >
                <span
                  className={clsx(
                    "block truncate",
                    selected?.id === option.id ? "font-semibold" : "font-normal"
                  )}
                >
                  {option.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;

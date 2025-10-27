import { useState } from "react";
import clsx from "clsx";

type Option = { id: string; name: string };

type MultiSelectProps = {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selectedIds: string[]) => void;
};

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-full bg-white border border-gray-300 pl-4 pr-10 py-[15px] text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[#0096FF] sm:text-sm mt-1"
      >
        <span className="block truncate">
          {selected.length
            ? options
                .filter((opt) => selected.includes(opt.id))
                .map((o) => o.name)
                .join(", ")
            : "Select features"}
        </span>
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white shadow-lg border border-gray-200 z-10">
          <ul className="max-h-56 overflow-auto py-1 text-base sm:text-sm">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => toggleSelect(option.id)}
                className={clsx(
                  "cursor-pointer select-none relative py-2 pl-4 pr-9 hover:bg-indigo-50",
                  selected.includes(option.id) && "font-semibold bg-indigo-50"
                )}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

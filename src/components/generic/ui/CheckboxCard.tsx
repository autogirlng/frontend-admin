// app/components/generic/ui/CheckboxCard.tsx
"use client";
import { Check } from "lucide-react";
import clsx from "clsx";

type CheckboxCardProps = {
  id: string;
  label: string;
  checked?: boolean; // <-- CHANGED: Made optional
  onChange?: (checked: boolean) => void; // <-- CHANGED: Made optional
};

export default function CheckboxCard({
  id,
  label,
  checked = false, // <-- CHANGED: Added default value
  onChange = () => {}, // <-- CHANGED: Added default value
}: CheckboxCardProps) {
  const baseClasses =
    "relative flex items-center p-4 border cursor-pointer transition-all duration-150";

  const stateClasses = checked
    ? "border-[#0096FF] bg-blue-50 ring-2 ring-[#0096FF]"
    : "border-gray-300 bg-white hover:border-gray-400";

  return (
    <label htmlFor={id} className={clsx(baseClasses, stateClasses)}>
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} // This is now safe
      />
      <div className="flex-1 text-sm font-medium text-gray-800">{label}</div>
      <div
        className={clsx(
          "flex items-center justify-center w-5 h-5 border rounded ml-3 flex-shrink-0",
          checked ? "bg-[#0096FF] border-[#0096FF]" : "border-gray-400 bg-white"
        )}
      >
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
    </label>
  );
}

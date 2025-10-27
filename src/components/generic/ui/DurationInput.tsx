// app/components/generic/ui/DurationInput.tsx
import React from "react";
import { Option } from "./Select"; // Import Option type from your Select component
import { Info } from "lucide-react";
import clsx from "clsx";

// We need to find your other components. Adjust this path if needed.
import TextInput from "./TextInput";
import Select from "./Select";

type DurationInputProps = {
  label: string;
  id: string;
  value?: number | ""; // <-- CHANGED
  unit?: string; // <-- CHANGED
  onValueChange?: (value: number | "") => void; // <-- CHANGED
  onUnitChange?: (unitOption: Option) => void; // <-- CHANGED
  unitOptions: Option[];
  error?: string;
};

const DurationInput = ({
  label,
  id,
  value = "", // <-- CHANGED
  unit = "", // <-- CHANGED
  onValueChange = () => {}, // <-- CHANGED
  onUnitChange = () => {}, // <-- CHANGED
  unitOptions,
  error,
}: DurationInputProps) => {
  const valueError = error; // Apply error to the number input

  // Find the selected unit object to pass to the Select component
  const selectedUnit = unitOptions.find((o) => o.id === unit) || null;

  return (
    <div>
      <div className="flex items-center">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Info className="w-4 h-4 ml-1 text-black" />
      </div>

      {/* Input Group Container */}
      <div className="mt-1 flex">
        {/* Simple Fallback Layout (More Robust) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <TextInput
              id={id}
              type="number"
              label="" // Label is handled above
              value={value}
              onChange={(e) =>
                onValueChange(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              placeholder="e.g., 3"
              error={error} // Pass error here
              hideLabel={true} // We need to add this prop
            />
          </div>
          <div className="col-span-1">
            <Select
              label=""
              options={unitOptions}
              selected={selectedUnit}
              onChange={onUnitChange}
              hideLabel={true} // We need to add this prop
            />
          </div>
        </div>
      </div>
      {/* We must move the error message from TextInput to here 
          to accommodate the `hideLabel` prop.
      */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DurationInput;

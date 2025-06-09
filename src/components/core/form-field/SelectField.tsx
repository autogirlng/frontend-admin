import { Field, ErrorMessage, useField } from "formik";
import { FaInfoCircle } from "react-icons/fa";

interface SelectInputFieldProps {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  tooltip?: string;
  onChanged?: (value: string) => void;
}

const SelectInputField: React.FC<SelectInputFieldProps> = ({
  label,
  name,
  options,
  placeholder,
  tooltip,
  onChanged,
}) => {
  const [field] = useField(name);

  return (
    <div className="relative w-full">
      {/* Label with Tooltip */}
      <div className="flex items-center space-x-1">
        <label htmlFor={name} className="font-medium text-[#101928]">
          {label}
        </label>
        {tooltip && (
          <span title={tooltip} className="text-gray-400 cursor-pointer">
            <FaInfoCircle size={14} />
          </span>
        )}
      </div>

      {/* Select Dropdown */}
      <Field
        as="select"
        {...field}
        className="w-full px-4 py-3 mt-1 border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          field.onChange(e);
          onChanged?.(e.target.value);
        }}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Field>

      {/* Validation Message */}
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default SelectInputField;

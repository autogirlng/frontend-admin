import { useState } from "react";
import { Field } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  tooltip?: string;
  multiline?: boolean;
  type?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string;
  error?: string | false | undefined;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  tooltip,
  multiline = false,
  type = "text",
  onChange,
  value,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col w-full relative">
      <label htmlFor={name} className="font-semibold text-sm">
        {label}
      </label>

      <div className="relative">
        <Field
          as={multiline ? "textarea" : "input"}
          type={type === "password" && showPassword ? "text" : type}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`w-full px-4 py-3 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          rows={multiline ? 4 : undefined}
          onChange={onChange}
          value={value}
        />

        {/* Password Toggle Button */}
        {type === "password" && (
          <button
            type="button"
            className="absolute right-4 top-3 text-blue-100 hover:text-blue-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {tooltip && <small className="text-gray-500">{tooltip}</small>}

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default InputField;

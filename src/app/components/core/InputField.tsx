import { Field, ErrorMessage, useField } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  onChanged?: (value: string) => void; // Optional prop
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  onChanged,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field] = useField(name);

  return (
    <div className="relative">
      <label className="block text-gray-700 font-medium">{label}</label>
      <div className="relative">
        <Field
          {...field}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={(e: any) => {
            field.onChange(e); // Ensure Formik updates state
            onChanged?.(e.target.value); // Call optional callback
          }}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default InputField;

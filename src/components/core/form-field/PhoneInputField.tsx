import { useField } from "formik";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  onChanged?: (value: string) => void;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  label,
  name,
  placeholder = "Enter phone number",
  onChanged,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="relative w-full mb-3">
      {label && (
        <label className="block font-medium text-[#101928] mb-1">{label}</label>
      )}

      <div className="relative">
        <PhoneInput
          defaultCountry="ng"
          value={field.value}
          onChange={(value) => {
            helpers.setValue(value.trim()); // Trim spaces
            onChanged?.(value);
          }}
          placeholder={placeholder}
          inputClassName={`w-full px-4 py-2 border ${
            meta.touched && meta.error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 transition text-base`}
        />
      </div>

      {/* Display Error Message */}
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default PhoneInputField;

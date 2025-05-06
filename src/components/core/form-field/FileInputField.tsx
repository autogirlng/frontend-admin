import { FaFile } from "react-icons/fa";
import { useField } from "formik";

interface FileInputFieldProps {
  setFieldValue: (field: string, value: File | null) => void;
  name: string;
  label?: string;
  placeholder?: string;
}

const FileInputField: React.FC<FileInputFieldProps> = ({
  setFieldValue,
  name,
  label = "Attachment (Optional)",
  placeholder = "Choose a file",
}) => {
  // Get Formik field state (error, touched)
  const [, meta] = useField(name);

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-[#101928]"
        >
          {label}
        </label>
      )}

      {/* Wrapper for Input and Suffix Icon */}
      <div className="relative flex items-center">
        <input
          id={name}
          type="file"
          name={name}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0] || null;
            setFieldValue(name, file);
          }}
          className={`mt-1 block w-full px-4 py-3 border ${
            meta.touched && meta.error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm cursor-pointer focus:ring-blue-500 focus:border-blue-500 pr-10`}
          aria-describedby={`${name}-description`}
          placeholder={placeholder}
        />
        {/* Suffix Icon */}
        <FaFile className="absolute right-3 text-gray-400 pointer-events-none" />
      </div>

      {/* Error Message */}
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default FileInputField;

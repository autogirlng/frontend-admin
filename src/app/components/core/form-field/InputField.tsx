import { Field, ErrorMessage } from "formik";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  tooltip?: string;
  multiline?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  tooltip,
  multiline = false,
  type = "text",
}) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="font-semibold text-sm">
        {label}
      </label>

      <Field
        as={multiline ? "textarea" : "input"}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full px-4 py-3 mt-1 border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
        rows={multiline ? 4 : undefined}
      />

      {tooltip && <small className="text-gray-500">{tooltip}</small>}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default InputField;

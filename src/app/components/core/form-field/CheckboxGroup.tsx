import { Field } from "formik";

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: string[];
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
}) => {
  return (
    <div className="col-span-2">
      <label className="font-semibold text-sm">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <Field
              className="p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer border-none" // Removed border-gray-50 and added border-none
              type="checkbox"
              name={name}
              value={option}
            />
            <span className="text-sm text-nowrap">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;

import { useFormikContext } from "formik";

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, text }) => {
  const { isValid, dirty } = useFormikContext(); // Get form validation state

  return (
    <button
      type="submit"
      className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center
        ${
          isValid && dirty
            ? "bg-[#0673FF] hover:bg-blue-600 text-white"
            : "bg-grey-300 text-gray-500 cursor-not-allowed"
        }
      `}
      disabled={!isValid || !dirty || isLoading}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;

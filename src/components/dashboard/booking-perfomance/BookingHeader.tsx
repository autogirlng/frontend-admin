import Icons from "@/utils/Icon";
import InputField2 from "../../core/form-field/inputFiel";

const BookingHeader = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-2">
        <button className="flex items-center  text-gray-700">
          {Icons.ic_ticket}
          <span className="ml-1 text-sm">Bookings</span>
        </button>
      </div>
      <div className="w-full md:w-1/3">
        <InputField2 id="search" name="search" placeholder="Search Vehicle" />
      </div>
    </div>
  );
};

export default BookingHeader;

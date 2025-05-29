import Icons from "@/utils/Icon";
import cn from "classnames";
import { format } from "date-fns";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimePicker = ({
  className,
  name,
  errors,
  reqError,
  disabled = false,
  required,
  width,
  value,
  showArrow = true,
  ...rest
}: {
  className?: string;
  name?: string;
  width?: string;
  errors?: string;
  reqError?: boolean;
  disabled?: boolean;
  required?: boolean;
  value: Date | null;
  showArrow?: boolean;
  [key: string]: any;
}) => {
  return (
    <div className="flex items-center gap-0.5">
      <div className={cn(width ?? "w-[55px]")}>
        <DatePicker
          value={value ? format(value, "hh:mma") : ""}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText="11:30AM"
          className={`w-full appearance-none outline-none text-grey-900 data-[placeholder]:text-grey-400 text-xs xl:text-sm rounded-md transition duration-150 ease-in-out`}
          {...rest}
          disabled={disabled}
        />
      </div>
      {showArrow && Icons.ic_chevron_down}
    </div>
  );
};

export default TimePicker;

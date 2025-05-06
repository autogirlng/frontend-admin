import Icons from "./icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import Button from "./button";
import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";

type ValuePiece = Date | null;

type Value = Date | null | [ValuePiece, ValuePiece];

const DateRangeCalendar = ({
  title,
  buttonClass,
  selectRange,
  value,
  onChange,
  setCalendarValues,
  isOpen,
  handleIsOpen,
}: {
  title: string;
  buttonClass?: string;
  selectRange: boolean;
  value: Value;
  onChange: (value: Value) => void;
  setCalendarValues: (value: Value) => void;
  isOpen: boolean;
  handleIsOpen: (open: boolean) => void;
}) => {
  const handleDone = () => {
    setCalendarValues(value);
    handleIsOpen(false);
  };

  const handleClearAll = () => {
    onChange(null);
    setCalendarValues(null);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={handleIsOpen}>
      <Popover.Trigger asChild>
        <button className={buttonClass ?? ""}>{Icons.ic_calendar}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="rounded-xl p-4 w-[280px] sm:w-[380px] bg-white border border-grey-200 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm 3xl:text-base font-semibold text-grey-700">
              {title}
            </p>
            <button
              onClick={handleClearAll}
              className="text-xs 3xl:text-sm text-primary-500 flex items-center gap-1 *:w-4 *:h-4 *:ml-1"
            >
              Clear all {Icons.ic_cancel_circle}
            </button>
          </div>
          <Calendar
            onChange={onChange}
            value={value}
            selectRange={selectRange}
            next2Label={null}
            prev2Label={null}
            className="!border-none !w-full !text-black !text-xs"
            nextLabel={Icons.ic_chevron_right}
            prevLabel={Icons.ic_chevron_left}
          />
          <div className="flex justify-between gap-4 mt-8">
            <Button
              fullWidth
              onClick={() => {
                handleClearAll();
                handleIsOpen(false);
              }}
              className="!bg-grey-90 hover:!bg-primary-75 !text-grey-700"
            >
              Back
            </Button>
            <Button
              color="primary"
              varian="filled"
              fullWidth
              onClick={handleDone}
            >
              Done
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const DatePicker = ({
  buttonClass,
  value,
  onChange,
  isOpen,
  handleIsOpen,
  children,
  showMinDate,
}: {
  buttonClass?: string;
  value: Value;
  onChange: (value: Value) => void;
  isOpen: boolean;
  handleIsOpen: (open: boolean) => void;
  children: ReactNode;
  showMinDate?: boolean;
}) => {
  return (
    <Popover.Root open={isOpen} onOpenChange={handleIsOpen}>
      <Popover.Trigger asChild>
        <button className={buttonClass ?? ""}>{children}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="rounded-xl p-4 w-[280px] sm:w-[380px] bg-white border border-grey-200 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <Calendar
            onChange={onChange}
            value={value}
            selectRange={false}
            next2Label={null}
            prev2Label={null}
            className="!border-none !w-full !text-black !text-xs"
            nextLabel={Icons.ic_chevron_right}
            prevLabel={Icons.ic_chevron_left}
            minDate={showMinDate ? new Date() : undefined}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
export default DateRangeCalendar;

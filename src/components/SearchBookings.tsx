import { ChangeEvent, useState } from "react";
import { CalendarValue } from "@/utils/types";
import { DatePicker } from "./shared/calendar";
import Button from "./shared/button";
import Icons from "@/utils/Icon";
import SearchInput from "./shared/searchInput";
import TimePicker from "./TimePicker";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FullPageSpinner } from "./shared/spinner";

type Props = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  fromDateValue: Date | null;
  setFromDateValue: (value: Date | null) => void;
  fromTimeValue: Date | null;
  setFromTimeValue: (value: Date) => void;
  untilDateValue: Date | null;
  setUntilDateValue: (value: Date | null) => void;
  untilTimeValue: Date | null;
  setUntilTimeValue: (value: Date) => void;
};

function SearchBookings({
  searchValue,
  setSearchValue,
  fromDateValue,
  setFromDateValue,
  fromTimeValue,
  setFromTimeValue,
  untilDateValue,
  setUntilDateValue,
  untilTimeValue,
  setUntilTimeValue,
}: Props) {
  const router = useRouter();
  const [fromCalendarIsOpen, setFromCalendarIsOpen] = useState<boolean>(false);

  const [untilCalendarIsOpen, setUntilCalendarIsOpen] =
    useState<boolean>(false);
  return (
    <div className="bg-white text-left md:h-[72px] w-full rounded-3xl p-4 flex flex-col md:flex-row  items-center gap-3">
      <div className="w-full flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-grey-200">
        <Column title="Where">
          <div>
            <SearchInput
              name="search"
              placeholder="Search by city, airport, address"
              inputClass="!border-none !pl-0 !h-5 !p-2 !text-xs xl:!text-sm align-top"
              className="!h-5 min-w-[177px] xl:min-w-[205px]"
              value={searchValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchValue(event.target.value)
              }
            />
            {/* 
            {(searchAddressLoading ||
              (googlePlaces.length > 0 && showAddressList)) && (
              <ul className="list-none border border-grey-300 rounded-xl py-4 px-2 w-full bg-white border border-grey-200 max-h-[200px] overflow-auto shadow-[-2px_4px_6px_-2px_#10192808,12px_16px_37.4px_-4px_#10192814]">
                {searchAddressError ? (
                  <p>{searchAddressError}</p>
                ) : searchAddressLoading ? (
                  <FullPageSpinner className="!min-h-[100px]" />
                ) : (
                  googlePlaces.map((address, index) => (
                    <li
                      key={`address-${index}`}
                      onClick={() => {
                        setShowAddressList(false);
                        setFieldValue(
                          "address",
                          address?.formattedAddress || ""
                        );
                      }}
                      className="cursor-pointer hover:bg-primary-75 py-2 px-4 text-sm text-grey-900 rounded-xl"
                    >
                      {address?.formattedAddress || ""}
                    </li>
                  ))
                )}
              </ul>
            )} */}
          </div>
        </Column>
        <Column title="From">
          <div className="flex items-center justify-between gap-1">
            <DatePicker
              value={fromDateValue}
              onChange={(value: CalendarValue) =>
                setFromDateValue(value as Date | null)
              }
              isOpen={fromCalendarIsOpen}
              handleIsOpen={(open: boolean) => setFromCalendarIsOpen(open)}
            >
              <div className="text-black text-xs xl:text-sm flex items-center gap-0.5">
                {fromDateValue ? (
                  <span className="text-grey-800">
                    {format(new Date(fromDateValue), "dd/MM/yyyy")}
                  </span>
                ) : (
                  <span className="text-grey-400">
                    {format(new Date(), "dd/MM/yyyy")}
                  </span>
                )}

                {Icons.ic_chevron_down}
              </div>
            </DatePicker>
            <div className="text-black text-xs xl:text-sm">
              <TimePicker
                name="fromTimeValue"
                value={fromTimeValue}
                onChange={(date: Date) => setFromTimeValue(date)}
              />
            </div>
          </div>
        </Column>
        <Column title="Until">
          <div className="flex items-center justify-between  gap-1">
            <DatePicker
              value={untilDateValue}
              onChange={(value: CalendarValue) =>
                setUntilDateValue(value as Date | null)
              }
              isOpen={untilCalendarIsOpen}
              handleIsOpen={(open: boolean) => setUntilCalendarIsOpen(open)}
            >
              <div className="text-black text-xs xl:text-sm flex items-center gap-0.5">
                {untilDateValue ? (
                  <span className="text-grey-800">
                    {format(new Date(untilDateValue), "dd/MM/yyyy")}
                  </span>
                ) : (
                  <span className="text-grey-400">
                    {format(new Date(), "dd/MM/yyyy")}
                  </span>
                )}

                {Icons.ic_chevron_down}
              </div>
            </DatePicker>
            <div className="text-black text-xs xl:text-sm">
              <TimePicker
                name="untilTimeValue"
                value={untilTimeValue}
                onChange={(date: Date) => setUntilTimeValue(date)}
              />
            </div>
          </div>
        </Column>
      </div>
      <Button
        variant="filled"
        color="primary"
        className="!p-3 3xl:!p-[18px] !w-full md:!w-fit"
        onClick={() => {
          console.log(
            searchValue,
            fromDateValue,
            untilDateValue,
            fromTimeValue,
            untilTimeValue
          );

          router.push(
            `/explore?search=${encodeURIComponent(searchValue)}` +
              `&fromDate=${fromDateValue ? fromDateValue.toISOString() : ""}` +
              `&fromTime=${fromTimeValue ? fromTimeValue.toISOString() : ""}` +
              `&untilDate=${
                untilDateValue ? untilDateValue.toISOString() : ""
              }` +
              `&untilTime=${untilTimeValue ? untilTimeValue.toISOString() : ""}`
          );
        }}
      >
        <span className="hidden md:block">{Icons.ic_search}</span>
        <span className="block md:hidden">Search for cars</span>
      </Button>
    </div>
  );
}
export default SearchBookings;

const Column = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="w-full py-3 md:py-0 md:pl-3 md:pr-5">
    <p className="text-grey-400 text-xs xl:text-sm">{title}</p>
    {children}
  </div>
);

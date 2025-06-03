import { addSpaceBeforeUppercase, debounce } from "@/utils/functions";
import { HorizontalDivider } from "@/components/shared/divider";
import Icons from "@/utils/Icon";
import { Popup } from "@/components/shared/popup";
import SearchInput from "@/components/shared/searchInput";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import cn from "classnames";
// import { CANCELLED } from "dns"; // This import seems unused and might cause issues. Consider removing if not needed.

type Props = {
  name: string;
  list?: string[];
  filterName: string;
  onChange: (filterName: string, value: string | number[]) => void;
  selectedItems: string[] | number[];
};

const filterTitleStyle =
  "text-grey-800 text-base md:text-xl 3xl:text-h6 !font-semibold";

const filterTitleStyleWithoutPopup =
  "text-grey-800 text-sm md:text-base 3xl:text-xl !font-semibold";

export function ChipFilter({
  name,
  list,
  filterName,
  onChange,
  selectedItems,
}: Props) {
  const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useUpdateBodyHeight({ isOpen: popupIsOpen, contentRef }); // This line is where the error occurs

  const isItemSelected = (item: string) => {
    if (filterName === "numberOfSeats") {
      return (selectedItems as string[]).includes(
        item.split(" ")[0].replace("+", "")
      );
    }
    return selectedItems.includes(item as never);
  };

  return (
    <Popup
      open={true}
      isOpen={popupIsOpen}
      handleIsOpen={(open: boolean) => setPopupIsOpen(open)}
      trigger={
        <button
          className={cn(
            "bg-white border border-grey-300 rounded-lg px-3 py-1 flex items-center gap-2 text-grey-600 text-xs 3xl:text-sm !font-semibold",
            selectedItems.length > 0 && "!bg-black !text-white !border-black"
          )}
        >
          {name} {selectedItems.length > 0 && `(${selectedItems.length})`}
          {Icons.ic_chevron_down}
        </button>
      }
      align="start"
      className="w-[255px] sm:w-[380px]"
      content={
        <div className="space-y-5" ref={contentRef}>
          <p className={filterTitleStyle}>{name}</p>
          <HorizontalDivider variant="light" />
          <ul className="list-none flex items-center gap-3 flex-wrap">
            {list?.map((item: string, index) => (
              <li
                onClick={() => onChange(filterName, item)}
                key={index}
                className={`px-1.5 py-2 text-sm 3xl:text-xl w-fit rounded-xl border cursor-pointer capitalize ${
                  isItemSelected(item)
                    ? "border-primary-500 bg-primary-50"
                    : "border-grey-300 bg-grey-90 text-grey-900"
                }`}
              >
                {addSpaceBeforeUppercase(item)}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

export function ChipFilterWithoutPopup({
  name,
  list,
  filterName,
  onChange,
  selectedItems,
}: Props) {
  const isItemSelected = (item: string) => {
    if (filterName === "numberOfSeats") {
      return (selectedItems as string[]).includes(
        item.split(" ")[0].replace("+", "")
      );
    }
    return selectedItems.includes(item as never);
  };

  return (
    <div className="space-y-5">
      <p className={filterTitleStyleWithoutPopup}>{name}</p>
      <ul className="list-none flex items-center gap-3 flex-wrap">
        {list?.map((item: string, index) => (
          <li
            onClick={() => onChange(filterName, item)}
            key={index}
            className={`px-1.5 py-2 text-sm 3xl:text-xl w-fit rounded-xl border cursor-pointer capitalize ${
              isItemSelected(item)
                ? "border-primary-500 bg-primary-50"
                : "border-grey-300 bg-grey-90 text-grey-900"
            }`}
          >
            {addSpaceBeforeUppercase(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchFilter({
  name,
  list,
  filterName,
  onChange,
  selectedItems,
}: Props) {
  const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const debouncedListingSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  const filteredList = useMemo(() => {
    if (!debouncedSearch) return list;

    return list?.filter((item) =>
      item.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [list, debouncedSearch]);

  useEffect(() => {
    debouncedListingSearch(search);
  }, [search, debouncedListingSearch]);

  const contentRef = useRef<HTMLDivElement>(null);
  useUpdateBodyHeight({ isOpen: popupIsOpen, contentRef }); // This line is where the error occurs

  return (
    <Popup
      open={true}
      isOpen={popupIsOpen}
      handleIsOpen={(open: boolean) => setPopupIsOpen(open)}
      trigger={
        <button
          className={cn(
            "bg-white border border-grey-300 rounded-lg px-3 py-1 flex items-center gap-2 text-grey-600 text-xs 3xl:text-sm !font-semibold",
            selectedItems.length > 0 && "!bg-black !text-white !border-black"
          )}
        >
          {name} {selectedItems.length > 0 && `(${selectedItems.length})`}
          {Icons.ic_chevron_down}
        </button>
      }
      align="start"
      className="w-[255px] sm:w-[300px]"
      content={
        <div className="space-y-5" ref={contentRef}>
          <p className={filterTitleStyle}>{name}</p>
          <SearchInput
            icon
            placeholder={`Search ${name}`}
            name="vehicleMakeSearch"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleSearch(event.target.value)
            }
          />
          <ul className="list-none space-y-2 max-h-[450px] overflow-y-auto">
            {filteredList?.map((item, index) => (
              <li
                onClick={() => onChange(filterName, item)}
                key={index}
                className={`px-2 py-1.5 text-xs 3xl:text-sm w-full cursor-pointer capitalize
                  ${
                    selectedItems?.includes(item as never)
                      ? "text-primary-500 bg-primary-50"
                      : "text-grey-900"
                  }`}
              >
                {addSpaceBeforeUppercase(item)}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

export function SearchFilterWithoutPopup({
  name,
  list,
  filterName,
  onChange,
  selectedItems,
}: Props) {
  const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const debouncedListingSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  const filteredList = useMemo(() => {
    if (!debouncedSearch) return list;

    return list?.filter((item) =>
      item.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [list, debouncedSearch]);

  useEffect(() => {
    debouncedListingSearch(search);
  }, [search, debouncedListingSearch]);

  const contentRef = useRef<HTMLDivElement>(null);
  useUpdateBodyHeight({ isOpen: popupIsOpen, contentRef }); // This line is where the error occurs

  return (
    <div className="space-y-5">
      <p className={filterTitleStyleWithoutPopup}>{name}</p>
      <Popup
        open={true}
        isOpen={popupIsOpen}
        handleIsOpen={(open: boolean) => setPopupIsOpen(open)}
        trigger={
          <button className="w-full bg-white border border-grey-300 rounded-2xl p-3 flex items-center justify-between gap-2 text-grey-700 text-sm 3xl:text-base">
            {name}
            {Icons.ic_chevron_down}
          </button>
        }
        align="start"
        className="w-[255px] sm:w-[220px] 3xl:w-[340px]"
        content={
          <div className="space-y-5" ref={contentRef}>
            <SearchInput
              icon
              placeholder={`Search ${name}`}
              name="vehicleMakeSearch"
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleSearch(event.target.value)
              }
            />
            <ul className="list-none space-y-2 max-h-[450px] overflow-y-auto">
              {filteredList?.map((item, index) => (
                <li
                  onClick={() => onChange(filterName, item)}
                  key={index}
                  className={`px-2 py-1.5 text-xs 3xl:text-sm w-full cursor-pointer capitalize
                    ${
                      selectedItems?.includes(item as never)
                        ? "text-primary-500 bg-primary-50"
                        : "text-grey-900"
                    }`}
                >
                  {addSpaceBeforeUppercase(item)}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
}

// --- FIX STARTS HERE ---

// Corrected type for contentRef to allow `HTMLDivElement | null`
const useUpdateBodyHeight = ({
  isOpen,
  contentRef,
}: {
  isOpen: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>; // Changed this line
}) => {
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      // Give time for the portal to mount
      setTimeout(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
          document.body.style.minHeight = `calc(100vh + ${contentRef.current.scrollHeight}px)`;
          document.body.style.overflow = "auto";
        }
      }, 100);
    } else {
      setContentHeight(0);
      document.body.style.minHeight = "";
      document.body.style.overflow = "";
    }

    return () => {
      setContentHeight(0);
      document.body.style.minHeight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return {};
};

// --- FIX ENDS HERE ---

export function RangeFilter({
  name,
  onChange,
  filterName,
  selectedItems,
}: Props) {
  const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);

  const debouncedRangeChange = useCallback(
    debounce((value: number[]) => {
      onChange(filterName, value);
    }, 500),
    []
  );

  const handleRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      debouncedRangeChange(value);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  useUpdateBodyHeight({ isOpen: popupIsOpen, contentRef }); // This line is where the error occurs

  const formatPrice = (value: number) => `${value / 1000}K/day`;

  return (
    <Popup
      open={true}
      isOpen={popupIsOpen}
      handleIsOpen={(open: boolean) => setPopupIsOpen(open)}
      trigger={
        <button className="bg-white border border-grey-300 rounded-lg px-3 py-1 flex items-center gap-2 text-grey-600 text-xs 3xl:text-sm !font-semibold">
          {name}
          {Icons.ic_chevron_down}
        </button>
      }
      align="start"
      className="w-[255px] sm:w-[380px]"
      content={
        <div className="space-y-5" ref={contentRef}>
          <p className={filterTitleStyle}>{name}</p>
          <HorizontalDivider variant="light" />
          <div className="flex gap-4 justify-center">
            <p className="text-sm text-grey-800 w-fit">
              {formatPrice(selectedItems[0] as number)}
            </p>
            <Slider
              range
              min={0}
              max={100000}
              step={1000}
              // defaultValue={selectedItems[0] as number}
              value={selectedItems as [number, number]}
              onChange={handleRangeChange}
              className="!w-[55%]"
              trackStyle={[{ backgroundColor: "#0673FF", height: 4 }]}
              handleStyle={[
                {
                  backgroundColor: "white",
                  border: "2px solid white",
                  height: "20px",
                  width: "20px",
                  boxShadow:
                    "0px 4.29px 9.29px 0px #0000001F, 0px 0.36px 2.86px 0px #0000001F",
                  marginTop: "-8px",
                  opacity: 1,
                },
                {
                  backgroundColor: "white",
                  border: "2px solid white",
                  height: "20px",
                  width: "20px",
                  boxShadow:
                    "0px 4.29px 9.29px 0px #0000001F, 0px 0.36px 2.86px 0px #0000001F",
                  marginTop: "-8px",
                  opacity: 1,
                },
              ]}
              railStyle={{ backgroundColor: "#0673FF", height: 4 }}
            />
            <p className="text-sm text-grey-800 w-fit">
              {formatPrice(selectedItems[1] as number)}
            </p>
          </div>
        </div>
      }
    />
  );
}

export function RangeFilterWithoutPopup({
  name,
  onChange,
  filterName,
  selectedItems,
}: Props) {
  const debouncedRangeChange = useCallback(
    debounce((value: number[]) => {
      onChange(filterName, value);
    }, 500),
    []
  );

  const handleRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      debouncedRangeChange(value);
    }
  };
  const formatPrice = (value: number) => `${value / 1000}K/day`;

  return (
    <div className="space-y-5">
      <p className={filterTitleStyleWithoutPopup}>{name}</p>
      <div className="flex gap-4 justify-center">
        <p className="text-sm text-grey-800 w-fit">
          {formatPrice(selectedItems[0] as number)}
        </p>
        <Slider
          range
          min={0}
          max={100000}
          step={1000}
          // defaultValue={selectedItems[0] as number}
          value={selectedItems as [number, number]}
          onChange={handleRangeChange}
          className="!w-[55%]"
          trackStyle={[{ backgroundColor: "#0673FF", height: 4 }]}
          handleStyle={[
            {
              backgroundColor: "white",
              border: "2px solid white",
              height: "20px",
              width: "20px",
              boxShadow:
                "0px 4.29px 9.29px 0px #0000001F, 0px 0.36px 2.86px 0px #0000001F",
              marginTop: "-8px",
              opacity: 1,
            },
            {
              backgroundColor: "white",
              border: "2px solid white",
              height: "20px",
              width: "20px",
              boxShadow:
                "0px 4.29px 9.29px 0px #0000001F, 0px 0.36px 2.86px 0px #0000001F",
              marginTop: "-8px",
              opacity: 1,
            },
          ]}
          railStyle={{ backgroundColor: "#0673FF", height: 4 }}
        />
        <p className="text-sm text-grey-800 w-fit">
          {formatPrice(selectedItems[1] as number)}
        </p>
      </div>
    </div>
  );
}

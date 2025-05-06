import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import Tooltip from "@repo/ui/tooltip";
import { Spinner } from "@repo/ui/spinner";
import cn from "classnames";
import Icons from "@repo/ui/icons";

type BankProp = {
  bankId: string;
  baseUssdCode: string;
  code: string;
  name: string;
  nipBankCode: string;
  transferUssdTemplate: string;
  ussdTemplate: string;
};

type Props = {
  banks: BankProp[];
  className?: string;
  id: string;
  label?: string;
  placeholder?: string;
  variant?: "outlined" | "filled";
  onChange?: (bank: BankProp) => void;
  value?: BankProp | null;
  error?: string;
  info?: boolean;
  tooltipTitle?: string;
  tooltipDescription?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

const SearchSelectInput = ({
  banks,
  className,
  id,
  label,
  placeholder,
  variant,
  value,
  onChange,
  error,
  info,
  tooltipTitle,
  tooltipDescription,
  disabled = false,
  isLoading,
}: Props) => {
  const [query, setQuery] = useState<string>("");

  const filteredBanks =
    query === ""
      ? banks
      : banks.filter((bank) => {
          return bank.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="relative w-full space-y-2 custom-radix-select">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "label text-sm block font-medium text-nowrap",
            variant === "filled" ? "text-white" : "text-grey-900",
            info ? "flex items-center gap-3" : ""
          )}
        >
          <span> {label}</span>
          {info && (
            <Tooltip
              title={tooltipTitle || ""}
              description={tooltipDescription || ""}
            />
          )}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center justify-between w-full rounded-[18px] p-4 text-sm h-[56px] gap-[5px] outline-none data-[placeholder]:text-grey-400 disabled:bg-grey-100 disabled:text-grey-400 disabled:border-grey-300",
          error
            ? "border border-error-500 focus:border-error-500"
            : variant === "filled"
              ? "bg-grey-800 text-grey-400 border-none"
              : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]",
          className
        )}
      >
        <Combobox
          value={value}
          onChange={onChange}
          onClose={() => setQuery("")}
          as={Fragment}
        >
          <div>
            <ComboboxInput
              aria-label={label}
              displayValue={(bank: BankProp) => bank?.name}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none"
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              {Icons.ic_chevron_down}
            </ComboboxButton>
            <ComboboxOptions
              anchor="bottom"
              className={cn(
                "!overflow-hidden rounded-3xl z-[999] min-w-[250px] sm:min-w-[300px] !max-w-[270px] sm:!max-w-auto sm:!max-w-[375px] p-4 ml-4 sm:ml-5 md:ml-[75px] mt-5",
                variant === "filled"
                  ? "bg-grey-800 text-grey-400 border-none"
                  : "bg-white border border-grey-300 shadow-[0px_4px_6px_-2px_#10192808,0px_16px_24px_-4px_#10192814]"
              )}
            >
              <div className="max-h-[300px] overflow-auto">
                {isLoading ? (
                  <Spinner />
                ) : (
                  filteredBanks.map((bank) => (
                    <ComboboxOption
                      key={bank.code}
                      value={bank}
                      className={cn(
                        "text-xs 3xl:text-sm flex items-center mb-2 px-2 py-4 h-4 rounded-xl transition relative select-none cursor-pointer hover:bg-primary-75 data-[disabled]:text-grey-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:text-primary-500",
                        className
                      )}
                    >
                      {bank.name}
                    </ComboboxOption>
                  ))
                )}
              </div>
            </ComboboxOptions>
          </div>
        </Combobox>
      </div>
      {error && (
        <p className="text-error-500 text-sm mt-2 text-nowrap">{error}</p>
      )}
    </div>
  );
};

export default SearchSelectInput;

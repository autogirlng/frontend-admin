import React from "react";
import { Filter, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import Select from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import { DatePickerWithRange } from "../../availability/DatePickerWithRange";
import { enumToOptions } from "./utils";
import { PaymentStatus, PaymentProvider } from "../types";

const paymentStatusOptions = enumToOptions(PaymentStatus);
const paymentProviderOptions = enumToOptions(PaymentProvider);

interface PaymentFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filters: {
    paymentStatus: string | null;
    paymentProvider: string | null;
    dateRange: DateRange | null;
  };
  handleFilterChange: (
    key: "paymentStatus" | "paymentProvider",
    value: string | null
  ) => void;
  handleDateChange: (range: DateRange | undefined) => void;
  clearFilters: () => void;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  handleFilterChange,
  handleDateChange,
  clearFilters,
}) => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search"
            id="search"
            hideLabel
            type="text"
            placeholder="Search Customer, Invoice"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        <Select
          label="Payment Status"
          hideLabel
          placeholder="Status: All"
          options={paymentStatusOptions}
          selected={
            filters.paymentStatus
              ? {
                  id: filters.paymentStatus,
                  name: filters.paymentStatus.replace(/_/g, " "),
                }
              : null
          }
          onChange={(option) => handleFilterChange("paymentStatus", option.id)}
        />

        <Select
          label="Payment Provider"
          hideLabel
          placeholder="Provider: All"
          options={paymentProviderOptions}
          selected={
            filters.paymentProvider
              ? {
                  id: filters.paymentProvider,
                  name: filters.paymentProvider.replace(/_/g, " "),
                }
              : null
          }
          onChange={(option) =>
            handleFilterChange("paymentProvider", option.id)
          }
        />

        <DatePickerWithRange
          date={filters.dateRange || undefined}
          setDate={handleDateChange}
        />
      </div>

      <Button
        variant="secondary"
        className="w-auto px-4 mt-4"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
};

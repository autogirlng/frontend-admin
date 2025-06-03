"use client";
import Icons from "@/utils/Icon";
import { ChipFilter, RangeFilter, SearchFilter } from "./Filter";
import {
  vehicleMakeArray,
  vehicleTypeArray,
  yearsFilterArray,
} from "@/utils/data";
import { Dispatch, SetStateAction } from "react";

type Props = {
  filters: {
    price: number[];
    type: string[];
    make: string[];
    yearOfRelease: string[];
    numberOfSeats: string[];
  };
  handleFilterChange: (filterName: string, value: string | number[]) => void;
  setShowAllFilters: Dispatch<SetStateAction<boolean>>;
};

export default function MainFilters({
  handleFilterChange,
  setShowAllFilters,
  filters,
}: Props) {
  return (
    <div className="hidden md:flex items-center gap-[14px]">
      <RangeFilter
        name="Daily price"
        filterName="price"
        onChange={handleFilterChange}
        selectedItems={filters.price}
      />
      <ChipFilter
        name="Vehicle type"
        list={vehicleTypeArray}
        filterName="type"
        onChange={handleFilterChange}
        selectedItems={filters.type}
      />
      <SearchFilter
        name="Make"
        list={vehicleMakeArray}
        filterName="make"
        onChange={handleFilterChange}
        selectedItems={filters.make}
      />
      <ChipFilter
        name="Years"
        list={yearsFilterArray}
        filterName="yearOfRelease"
        onChange={handleFilterChange}
        selectedItems={filters.yearOfRelease}
      />
      <ChipFilter
        name="Seats"
        list={[
          "2 seater",
          "3 seater",
          "4 seater",
          "5 seater",
          "6 seater",
          "7+ seater",
        ]}
        filterName="numberOfSeats"
        onChange={handleFilterChange}
        selectedItems={filters.numberOfSeats}
      />
      {/* <ChipFilter name="Fuel type" list={["Petrol", "Hybrid", "Electric"]} onChange={handleFilterChange} /> */}
      <button
        onClick={() => setShowAllFilters(true)}
        className="bg-white border border-grey-900 rounded-lg px-3 py-1 flex items-center gap-2 text-grey-900 text-xs 3xl:text-sm !font-semibold"
      >
        {Icons.ic_filter}
        <span className="hidden md:block">View all filters</span>
      </button>
    </div>
  );
}

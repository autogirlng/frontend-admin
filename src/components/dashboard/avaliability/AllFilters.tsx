"use client";

import cn from "classnames";
import Icons from "@/utils/Icon";
import {
  ChipFilterWithoutPopup,
  RangeFilterWithoutPopup,
  SearchFilterWithoutPopup,
} from "./Filter";
import {
  vehicleFeaturesOptions,
  vehicleMakeArray,
  vehicleTypeArray,
  yearsFilterArray,
} from "@/utils/data";
import { Dispatch, SetStateAction } from "react";
import { HorizontalDivider } from "@/components/shared/divider";

type Props = {
  filters: {
    price: number[];
    type: string[];
    make: string[];
    yearOfRelease: string[];
    numberOfSeats: string[];
    features: string[];
  };
  handleFilterChange: (filterName: string, value: string | number[]) => void;
  setShowAllFilters: Dispatch<SetStateAction<boolean>>;
};

export default function AllFilters({
  handleFilterChange,
  setShowAllFilters,
  filters,
}: Props) {
  return (
    <div
      className={cn(
        "space-y-10 flex-col fixed z-[999] left-0 top-[113px] h-full w-full lg:w-[300px] 2xl:w-[500px] bg-grey-50 py-8 px-6 2xl:px-16 !mt-0 !pb-[200px] overflow-auto"
      )}
    >
      <button
        onClick={() => setShowAllFilters(false)}
        className="ml-auto p-1 flex items-center gap-1 text-grey-800 text-xs 2xl:text-sm !font-semibold"
      >
        {Icons.ic_chevron_left} <span>Hide filters</span>
      </button>

      <h5>Filters</h5>

      <HorizontalDivider className="!bg-grey-300" />

      <RangeFilterWithoutPopup
        name="Prince Range"
        filterName="price"
        onChange={handleFilterChange}
        selectedItems={filters.price}
      />

      <HorizontalDivider className="!bg-grey-300" />

      <ChipFilterWithoutPopup
        name="Vehicle type"
        list={vehicleTypeArray}
        filterName="type"
        onChange={handleFilterChange}
        selectedItems={filters.type}
      />

      <HorizontalDivider className="!bg-grey-300" />

      <SearchFilterWithoutPopup
        name="Vehicle Make"
        list={vehicleMakeArray}
        filterName="make"
        onChange={handleFilterChange}
        selectedItems={filters.make}
      />

      <HorizontalDivider className="!bg-grey-300" />

      <ChipFilterWithoutPopup
        name="Vehicle Year"
        list={yearsFilterArray}
        filterName="yearOfRelease"
        onChange={handleFilterChange}
        selectedItems={filters.yearOfRelease}
      />

      <HorizontalDivider className="!bg-grey-300" />

      <ChipFilterWithoutPopup
        name="Number Of Seats"
        list={["2+", "3+", "4+", "5+", "6+", "7+"]}
        filterName="numberOfSeats"
        onChange={handleFilterChange}
        selectedItems={filters.numberOfSeats}
      />

      <HorizontalDivider className="!bg-grey-300" />

      <ChipFilterWithoutPopup
        name="Vehicle Features"
        list={vehicleFeaturesOptions}
        filterName="features"
        onChange={handleFilterChange}
        selectedItems={filters.features}
      />
    </div>
  );
}

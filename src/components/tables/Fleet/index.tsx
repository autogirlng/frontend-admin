import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import SearchInput from "@/components/shared/searchInput";
import FilterBy from "@/components/shared/filter";
import { fleetFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";
import Button from "@/components/shared/button";
import Icons from "@/utils/Icon";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Link from "next/link";
import { LocalRoute } from "@/utils/LocalRoutes";
import FleetDataTable from "./FleetTable";

type Props = {};

export default function Fleet({}: Props) {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (selectedFilters: Record<string, string[]>) =>
    setFilters(selectedFilters);

  const handleSearch = (value: string) => setSearch(value);

  const debouncedBookingSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedBookingSearch(search);
  }, [search, debouncedBookingSearch]);

  return (
    <div className="space-y-8 p-4 md:p-0">
      {" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <DashboardSectionTitle icon={Icons.ic_car} title="All Vehicles" />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 flex-wrap">
        <SearchInput
          placeholder="Search By Vehicle model, name, make and year"
          name="fleetSearch"
          className="w-full md:w-auto md:flex-grow min-w-0"
          value={search}
          icon
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
          }
        />

        <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-0 w-full md:w-auto flex-wrap justify-start md:justify-end">
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            <FilterBy
              categories={fleetFilters}
              dateEnabled
              onChange={handleFilterChange}
            />
            <FilterBy
              categories={fleetFilters}
              dateEnabled
              onChange={handleFilterChange}
            />
          </div>

          {/* Add Vehicle Button */}
          <Link href={LocalRoute.selectHostPage}>
            <Button
              color="primary"
              className="flex gap-1 justify-center text-sm text-nowrap items-center w-full md:w-auto flex-shrink-0"
            >
              {Icons.ic_add}
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>
      <FleetDataTable filters={filters} search={debouncedSearch} />
    </div>
  );
}

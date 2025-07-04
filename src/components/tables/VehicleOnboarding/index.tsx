import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import SearchInput from "@/components/shared/searchInput";
import FilterBy from "@/components/shared/filter";
import { bookingFilters, VehicleOnboardingFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";
import VehicleOnboardingTable from "./vehicleOnboardingTable";
import Button from "@/components/shared/button";
import Icons from "@/utils/Icon";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Link from "next/link";
import { LocalRoute } from "@/utils/LocalRoutes";
type Props = {};

export default function VehicleOnboarding({}: Props) {
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
    <div className="space-y-8">
      <DashboardSectionTitle icon={Icons.ic_car} title="Listings" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          placeholder="Search By Vehicle ID, Host Name"
          name="bookingsSearch"
          className="w-full"
          value={search}
          icon
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
          }
        />
        <div className="flex items-center gap-3">
          <FilterBy
            categories={VehicleOnboardingFilters}
            dateEnabled
            onChange={handleFilterChange}
          />
          <Link href={LocalRoute.selectHostPage}>
            <Button
              color="primary"
              className="flex gap-1 justify-center text-sm text-nowrap items-center"
            >
              {Icons.ic_add}
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>
      <VehicleOnboardingTable filters={filters} search={debouncedSearch} />
    </div>
  );
}

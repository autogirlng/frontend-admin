// src/pages/Team.tsx (or wherever your Team component is located)
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import SearchInput from "@/components/shared/searchInput";
import FilterBy from "@/components/shared/filter";
import { fleetFilters, teamSettingFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";
import Icons from "@/utils/Icon";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import HostDataTable from "./HostTable";

import { Member } from "@/utils/types"; // Import Member type if not already

type Props = {};

export default function HostFull({}: Props) {
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
      <div className="flex justify-between items-center mb-6">
        <DashboardSectionTitle icon={Icons.ic_host} title="Team Members" />{" "}
        {/* Changed title to Team Members */}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 flex-wrap">
        <SearchInput
          placeholder="Search By Member name, email, or role"
          name="memberSearch" // Changed name
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
              categories={teamSettingFilters}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
      <HostDataTable filters={filters} search={debouncedSearch} />
    </div>
  );
}

import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import SearchInput from "@/components/shared/searchInput";
import { debounce } from "@/utils/functions";
import Button from "@/components/shared/button";
import Icons from "@/utils/Icon";
import Link from "next/link";
import { LocalRoute } from "@/utils/LocalRoutes";
import SelectHostTable from "./SelectHostTable";
type Props = {};

export default function SelectHost({}: Props) {
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
      {/* <DashboardSectionTitle icon={Icons.ic_car} title="Vehicle Onboarding" /> */}

      <div className="flex items-center justify-between gap-3">
        <SearchInput
          placeholder="Search by host name and host ID"
          name="searchHost"
          className="w-full"
          value={search}
          icon
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
          }
        />
        <div className="flex items-center gap-3">
          <Link href={LocalRoute.hostOnboardingPage}>
            <Button
              color="primary"
              className="flex gap-1 justify-center text-sm text-nowrap items-center"
            >
              {Icons.ic_add}
              Add Host
            </Button>
          </Link>
        </div>
      </div>
      <SelectHostTable search={debouncedSearch} />
    </div>
  );
}

// src/pages/Team.tsx (or wherever your Team component is located)
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import SearchInput from "@/components/shared/searchInput";
import FilterBy from "@/components/shared/filter";
import { fleetFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";
import Button from "@/components/shared/button";
import Icons from "@/utils/Icon";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
// import Link from "next/link"; // No longer needed for Add Member button
// import { LocalRoute } from "@/utils/LocalRoutes"; // No longer needed for Add Member button
import TeamDataTable from "./TeamTable";

// Import the AddTeamMember component
import AddTeamMember from "./Details/modals/AddNewMember";
// Assuming you have a type for Member from '@/utils/types'
import { Member } from "@/utils/types"; // Import Member type if not already

type Props = {};

export default function Team({}: Props) {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  // State for the AddTeamMember modal
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Assuming TeamDataTable will eventually fetch/manage its own data,
  // or you might manage it here and pass it down.
  // For now, let's just log the new member data.
  const handleAddNewMember = async (formData: any) => {
    setIsAddingMember(true);
    console.log("Submitting new team member:", formData);
    // In a real application, you would send this formData to your backend API
    // const response = await fetch('/api/team-members', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
    // const newMember = await response.json();

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsAddingMember(false);
    setIsAddMemberModalOpen(false); // Close the modal on success
    alert(`New member ${formData.firstName} added (simulated)!`);
  };

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
        <DashboardSectionTitle icon={Icons.ic_car} title="Team Members" />{" "}
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
              categories={fleetFilters} // Consider if these filters are appropriate for team members
              dateEnabled
              onChange={handleFilterChange}
            />
            {/* If you have specific filters for team members, replace fleetFilters */}
            {/* <FilterBy
              categories={teamMemberFilters} // Example for specific team filters
              dateEnabled
              onChange={handleFilterChange}
            /> */}
          </div>

          {/* Add Member Button - now triggers the modal */}
          <AddTeamMember
            openModal={isAddMemberModalOpen}
            handleModal={setIsAddMemberModalOpen}
            isLoading={isAddingMember}
            trigger={
              <Button
                color="primary"
                className="flex gap-1 justify-center text-sm text-nowrap items-center w-full md:w-auto flex-shrink-0"
              >
                {Icons.ic_add}
                Add Member
              </Button>
            }
          />
        </div>
      </div>
      <TeamDataTable filters={filters} search={debouncedSearch} />
    </div>
  );
}

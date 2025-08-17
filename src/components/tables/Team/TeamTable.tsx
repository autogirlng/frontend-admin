import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import FleetDataHoldingTable from "./Table";
import TeamDataHoldingTable from "./Table";
import useTeamTable from "./hooks/useTeamTable";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
type Props = { search?: string; filters?: Record<string, string[]> };

export default function TeamDataTable({ search, filters }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading ,refetch} =
    useTeamTable({
      currentPage: currentPage,
      pageLimit: 10,
      search: search,
      filters: filters,
    });

  return (
    <div>
      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
          <EmptyState image={ ImageAssets.icons.errorState} title="An Error Occurred" buttonAction={refetch} buttonText="Try Again" message='Failed to load team members'/> ) : (
        <TeamDataHoldingTable
          items={data}
          emptyStateTitle="No Team Member "
          emptyStateMessage="Your Team Members  Will Appear Here"
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageLimit={pageSize}
        totalPage={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

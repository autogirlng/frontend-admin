import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import FleetDataHoldingTable from "./Table";
import TeamDataHoldingTable from "./Table";
import useTeamTable from "./hooks/useTeamTable";
type Props = { search?: string; filters?: Record<string, string[]> };

export default function TeamDataTable({ search, filters }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading } =
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
        <p>something went wrong</p>
      ) : (
        <TeamDataHoldingTable
          items={data}
          emptyStateTitle="No  Fleet Available "
          emptyStateMessage="Your Fleet Will Appear Here"
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

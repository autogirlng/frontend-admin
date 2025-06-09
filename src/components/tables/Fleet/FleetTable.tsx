import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import useFleetTable from "./hooks/useFleetTable";
import FleetDataHoldingTable from "./Table";
type Props = { search?: string; filters?: Record<string, string[]> };

export default function FleetDataTable({ search, filters }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading } =
    useFleetTable({
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
        <FleetDataHoldingTable
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

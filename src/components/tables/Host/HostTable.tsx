import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import HostDataHoldingTable from "./Table";
import useHostTable from "./hooks/useTeamTable";
type Props = { search?: string; filters?: Record<string, string[]> };

export default function HostDataTable({ search, filters }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading } =
    useHostTable({
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
        <HostDataHoldingTable
          items={data}
          emptyStateTitle="No  Host Available "
          emptyStateMessage="Your Host Will Appear Here"
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

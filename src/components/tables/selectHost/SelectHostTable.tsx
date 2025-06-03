import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import useSelectHostTable from "./hooks/useSelectHost";
import SelectingHostTable from "./Table";
type Props = { search?: string };

export default function SelectHostTable({ search }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading } =
    useSelectHostTable({
      currentPage: currentPage,
      pageLimit: 10,
      search: search,
      // filters: filters,
    });

  return (
    <div>
      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p>something went wrong</p>
      ) : (
        <SelectingHostTable
          items={data}
          emptyStateTitle="No Host  Available"
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

import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import useVehicleOnboardingTable from "./hooks/useVehicleOnboardingTable";
import OnboardedAnalyticsTable from "./Table";
type Props = { search?: string; filters?: Record<string, string[]> };

export default function VehicleOnboardingTable({ search, filters }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading } =
    useVehicleOnboardingTable({
      currentPage: currentPage,
      pageLimit: 10,
      search: search,
      filters: filters,
    });

  console.log("VehicleOnboardingTable data", data);

  return (
    <div>
      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p>something went wrong</p>
      ) : (
        <OnboardedAnalyticsTable
          items={data}
          emptyStateTitle="No Onboared Vehicles "
          emptyStateMessage="Your Onboarded Vehicles Will Appear Here"
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

import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import useVehicleOnboardingTable from "./hooks/useVehicleOnboardingTable";
import OnboardedAnalyticsTable from "./Table";
type Props = { search?: string; filters?: Record<string, string[]> };

export default function VehicleOnboardingTable({}: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 10;

  const { data, totalCount, isError, isLoading } = useVehicleOnboardingTable({
    currentPage: 1,
    pageLimit: 10,
    search: "",
    filters: {},
  });

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
        pageLimit={pageLimit}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

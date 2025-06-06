import DashboardCard from "@/components/cards/DashboardCard";
import Icons from "@/utils/Icon";
import useHostStats from "./hooks/hostStat";
import { useState } from "react";
import OnboardingDistribution from "./hostOnboardingData";

type Props = {};

export default function HostStats({}: Props) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, isError } = useHostStats(filters);

  const handleFilterChange = (selectedFilters: Record<string, string>) =>
    setFilters(selectedFilters);

  return (
    <div className="space-y-3 gap-1.5 overflow-auto">
      <DashboardCard
        title="Host"
        onChange={handleFilterChange}
        loading={isLoading}
        error={isError}
        icon={Icons.ic_host_Admin}
        metrics={[
          { title: "Total Host", value: data?.totalHost || 0 },
          {
            title: "Active Host",
            value: data?.activeHost || 0,
          },
          { title: "Inactive Host", value: data?.inactiveHost || 0 },
          { title: "Blocked Host", value: data?.blockedHost || 0 },
        ]}
        showFilter={false}
      />
      <OnboardingDistribution
        selfOnboarded={9985}
        adminOnboarded={3210}
        isLoading={isLoading}
      />
    </div>
  );
}

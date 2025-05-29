import ActivityCard from "@/components/shared/activityCard";
import useFleetStats from "./hooks/useFleetStats";

type Props = {};

export default function FleetStats({}: Props) {
  const { data, isLoading } = useFleetStats();
  return (
    <div className="flex gap-1.5 overflow-auto">
      <ActivityCard
        primary
        title="Total Vehicles"
        value={`${data?.totalVehicles || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Active Vehicles"
        value={`${data?.activeVehicles || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Inactive Vehicles"
        value={`${data?.inactiveVehicles || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Vehicle In Maintenance "
        value={`${data?.vehiclesInMaintenance || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Suspended Vehicles"
        value={`${data?.suspendedVehicles || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
    </div>
  );
}

// Your component: VehicleOnboardingStats.tsx
import ActivityCard from "@/components/shared/activityCard";
import useVehicleOnboardingStats from "./hooks/useVehicleOnboardingStats";

type Props = {};

export default function VehicleOnboardingStats({}: Props) {
  const { data, isLoading } = useVehicleOnboardingStats();
  return (
    <div className="flex gap-1.5 overflow-auto">
      <ActivityCard
        primary
        title="Pending Listing"
        value={`${data?.inReview || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Requires Update"
        value={`${data?.approved || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Rejected Submission"
        value={`${data?.rejected || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Accepted Submission"
        value={`${data?.approved || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Drafts"
        value={`${data?.drafts || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
    </div>
  );
}

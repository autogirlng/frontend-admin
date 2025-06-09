// Your component: VehicleOnboardingStats.tsx
import ActivityCard from "@/components/shared/activityCard";
import useVehicleOnboardingStats from "./hooks/useVehicleOnboardingStats";

type Props = {};

export default function VehicleOnboardingStats({}: Props) {
  const { data, isLoading } = useVehicleOnboardingStats();
  return (
    <div className="flex gap-1.5 overflow-auto">
      <ActivityCard
        title="Total Listing"
        tooltip="This shows every listing associated with your account—whether it's in review, approved, rejected, or requires an update. Use this to get a complete overview of your listing status."
        value={`${data?.totalListings || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Approved"
        tooltip="The listing has been reviewed and approved by the admin. It is now live and visible to"
        value={`${data?.approved || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Rejected "
        tooltip="This listing has been reviewed and rejected. A reason for the rejection will be provided, and the host may be required to update or resubmit."
        value={`${data?.rejected || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Inreview"
        tooltip="The listing has been reviewed but needs corrections. It is not rejected, but the host must make the requested updates before it can be approved."
        value={`${data?.inReview || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Drafts"
        tooltip="These are listings you’ve started creating but haven’t submitted yet. You can return anytime to complete and submit them for review."
        value={`${data?.drafts || `-`}`}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
    </div>
  );
}

import AvailabilityComponent from "@/components/availability-fleet/component/AvailabilityComponent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AvailabilityPage() {
  return (
    <DashboardLayout title="Fleet Availability" currentPage="Fleet">
      <AvailabilityComponent />
    </DashboardLayout>
  );
}

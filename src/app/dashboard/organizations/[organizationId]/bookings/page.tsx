import OrganizationBookings from "@/components/dashboard/organizations/OrganizationBookings";

export default async function OrganizationBookingsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  return <OrganizationBookings organizationId={organizationId} />;
}

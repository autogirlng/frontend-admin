import OrganizationKycHistory from "@/components/dashboard/organizations/OrganizationKycHistory";

export default async function OrganizationKycHistoryPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  return <OrganizationKycHistory organizationId={organizationId} />;
}

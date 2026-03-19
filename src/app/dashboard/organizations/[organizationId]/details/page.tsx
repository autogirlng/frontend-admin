import OrganizationDetail from "@/components/dashboard/organizations/OrganizationDetail";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  return <OrganizationDetail organizationId={organizationId} />;
}

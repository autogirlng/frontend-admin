import OrganizationMembers from "@/components/dashboard/organizations/OrganizationMembers";

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  return <OrganizationMembers organizationId={organizationId} />;
}

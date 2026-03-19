import OrganizationTransactions from "@/components/dashboard/organizations/OrganizationTransactions";

export default async function OrganizationTransactionsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  return <OrganizationTransactions organizationId={organizationId} />;
}

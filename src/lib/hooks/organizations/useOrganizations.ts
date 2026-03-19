import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  PaginatedData,
  Organization,
  OrganizationDetail,
  Booking,
  KycHistory,
  CorporateStats,
  OrganizationMember,
  OrganizationTransaction,
} from "@/components/dashboard/organizations/types";

const ORG_KEYS = {
  list: "organizations",
  pendingKyc: "organizationsPendingKyc",
  stats: "corporateStats",
  detail: "organizationDetail",
  bookings: "organizationBookings",
  kyc: "organizationKyc",
  members: "organizationMembers",
  transactions: "organizationTransactions",
};

// 1. Get All Organizations
export function useGetOrganizations(page: number, size: number = 10) {
  return useQuery<PaginatedData<Organization>>({
    queryKey: [ORG_KEYS.list, page, size],
    queryFn: () =>
      apiClient.get<PaginatedData<Organization>>(
        `/admin/organizations?page=${page}&size=${size}`
      ),
    placeholderData: (previousData) => previousData,
  });
}

// 2. Get Organization Details
export function useGetOrganizationDetails(orgId: string | null) {
  return useQuery<OrganizationDetail>({
    queryKey: [ORG_KEYS.detail, orgId],
    queryFn: () =>
      apiClient.get<OrganizationDetail>(`/admin/organizations/${orgId}`),
    enabled: !!orgId,
  });
}

// 3. Get Organization Bookings
export function useGetOrganizationBookings(orgId: string | null, page: number, size: number = 10) {
  return useQuery<PaginatedData<Booking>>({
    queryKey: [ORG_KEYS.bookings, orgId, page],
    queryFn: () =>
      apiClient.get<PaginatedData<Booking>>(
        `/admin/organizations/${orgId}/bookings?page=${page}&size=${size}`
      ),
    enabled: !!orgId,
  });
}

// 4. Get KYC History
export function useGetKycHistory(orgId: string | null) {
  return useQuery<KycHistory[]>({
    queryKey: [ORG_KEYS.kyc, orgId],
    queryFn: () =>
      apiClient.get<KycHistory[]>(`/admin/organizations/${orgId}/kyc-history`),
    enabled: !!orgId,
  });
}

// 5. Review KYC (Mutation)
export function useReviewKyc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, payload }: { orgId: string; payload: { status: string; remarks: string } }) =>
      apiClient.patch(`/admin/organizations/${orgId}/kyc-review`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORG_KEYS.detail, variables.orgId] });
      queryClient.invalidateQueries({ queryKey: [ORG_KEYS.kyc, variables.orgId] });
    },
  });
}

// 6. Get Organization Members
export function useGetOrganizationMembers(orgId: string | null, page: number, size: number = 10) {
  return useQuery<PaginatedData<OrganizationMember>>({
    queryKey: [ORG_KEYS.members, orgId, page],
    queryFn: () =>
      apiClient.get<PaginatedData<OrganizationMember>>(
        `/admin/organizations/${orgId}/members?page=${page}&size=${size}`
      ),
    enabled: !!orgId,
  });
}

// 7. Get Organization Transactions
export function useGetOrganizationTransactions(orgId: string | null, page: number, size: number = 10) {
  return useQuery<PaginatedData<OrganizationTransaction>>({
    queryKey: [ORG_KEYS.transactions, orgId, page],
    queryFn: () =>
      apiClient.get<PaginatedData<OrganizationTransaction>>(
        `/admin/organizations/${orgId}/transactions?page=${page}&size=${size}`
      ),
    enabled: !!orgId,
  });
}

/**
 * GET /v1/admin/organizations/kyc-pending
 */
export function useGetPendingKycOrganizations(page: number, size: number = 10) {
  return useQuery<PaginatedData<Organization>>({
    queryKey: [ORG_KEYS.pendingKyc, page, size],
    queryFn: () =>
      apiClient.get<PaginatedData<Organization>>(
        `/admin/organizations/kyc-pending?page=${page}&size=${size}`
      ),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * GET /v1/admin/organizations/stats
 */
export function useGetCorporateStats() {
  return useQuery<CorporateStats>({
    queryKey: [ORG_KEYS.stats],
    queryFn: () => apiClient.get<CorporateStats>("/admin/organizations/stats"),
  });
}
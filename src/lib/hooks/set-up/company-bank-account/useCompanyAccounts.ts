import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path as needed

import toast from "react-hot-toast";
import {
  CompanyAccount,
  CompanyAccountPayload,
  BankResolveResponse,
  Bank,
} from "@/components/set-up-management/bank-accounts/types";

// --- Query Keys ---
const ACCOUNT_KEYS = {
  all: ["companyAccounts"] as const,
  banks: (search: string) => ["banks", search] as const,
  resolve: (account: string, code: string) =>
    ["resolveAccount", account, code] as const,
};

// --- GET All Company Accounts ---
// (Note: Assuming the GET endpoint is /admin/company-bank-accounts)
export function useGetCompanyAccounts() {
  return useQuery<CompanyAccount[]>({
    queryKey: ACCOUNT_KEYS.all,
    queryFn: () =>
      apiClient.get<CompanyAccount[]>("/public/company-bank-accounts"),
  });
}

// --- GET Banks (for search) ---
export function useGetBanks(searchQuery: string) {
  return useQuery<Bank[]>({
    queryKey: ACCOUNT_KEYS.banks(searchQuery),
    // Only run the query if the search query is 3+ characters
    queryFn: () => apiClient.get<Bank[]>(`/banks?searchQuery=${searchQuery}`),
    enabled: !!searchQuery && searchQuery.length > 2,
    staleTime: 1000 * 60 * 5, // Cache bank list for 5 minutes
  });
}

// --- GET Resolve Account Details ---
export function useResolveAccount(
  accountNumber: string,
  bankCode: string
): UseQueryResult<BankResolveResponse, Error> {
  return useQuery<BankResolveResponse>({
    queryKey: ACCOUNT_KEYS.resolve(accountNumber, bankCode),
    queryFn: () =>
      apiClient.get<BankResolveResponse>(
        `/banks/resolve?accountNumber=${accountNumber}&bankCode=${bankCode}`
      ),
    enabled: false, // <-- IMPORTANT: This query is manually triggered
    retry: false, // Don't retry on failure, just show the error
  });
}

// --- POST Create Account ---
export function useCreateCompanyAccount() {
  const queryClient = useQueryClient();
  return useMutation<CompanyAccount, Error, CompanyAccountPayload>({
    mutationFn: (payload) =>
      apiClient.post("/admin/company-bank-accounts", payload),
    onSuccess: (newData) => {
      // Add the new account to the cache
      queryClient.setQueryData<CompanyAccount[]>(
        ACCOUNT_KEYS.all,
        (oldData = []) => [...oldData, newData]
      );
      toast.success("Account created successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to create account: ${error.message}`);
    },
  });
}

// --- DELETE Account ---
export function useDeleteCompanyAccount() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/company-bank-accounts/${id}`),
    onSuccess: (_, id) => {
      // Optimistically remove the account from the cache
      queryClient.setQueryData<CompanyAccount[]>(
        ACCOUNT_KEYS.all,
        (oldData = []) => oldData.filter((item) => item.id !== id)
      );
      toast.success("Account deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete account: ${error.message}`);
    },
  });
}

// --- PATCH Set Default Account ---
export function useSetDefaultCompanyAccount() {
  const queryClient = useQueryClient();
  return useMutation<CompanyAccount, Error, string>({
    mutationFn: (id) =>
      apiClient.patch(`/admin/company-bank-accounts/set-default/${id}`, {}),
    onSuccess: () => {
      // Refetch the entire list to ensure 'default' status is correct
      queryClient.invalidateQueries({ queryKey: ACCOUNT_KEYS.all });
      toast.success("Default account updated.");
    },
    onError: (error) => {
      toast.error(`Failed to set default: ${error.message}`);
    },
  });
}

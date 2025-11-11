// lib/hooks/setup/useCompanyBankAccounts.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import { CompanyBankAccount } from "@/components/dashboard/bookings-management/types";

export const BANK_ACCOUNTS_KEY = "companyBankAccounts";

/**
 * Fetches all public company bank accounts.
 */
export function useGetCompanyBankAccounts() {
  return useQuery<CompanyBankAccount[], Error>({
    queryKey: [BANK_ACCOUNTS_KEY],
    queryFn: () =>
      apiClient.get<CompanyBankAccount[]>("/public/company-bank-accounts"),
  });
}

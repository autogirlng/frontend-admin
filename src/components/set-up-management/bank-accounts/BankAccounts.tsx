"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  Loader2,
  Check,
  Trash2,
  Banknote,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import {
  useGetCompanyAccounts,
  useCreateCompanyAccount,
  useDeleteCompanyAccount,
  useSetDefaultCompanyAccount,
  useGetBanks,
  useResolveAccount,
} from "@/lib/hooks/set-up/company-bank-account/useCompanyAccounts";
import { BankResolveResponse } from "./types";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Main Page Component ---
export default function CompanyBankAccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Make sure Toaster is rendered, ideally in your layout */}
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Company Bank Accounts
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage accounts for payouts and company use.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto px-5" // Override fixed width for flexibility
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Account
          </Button>
        </div>

        {/* --- Account List --- */}
        <AccountList />
      </main>

      {/* --- Add Account Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
            {/* Form is rendered inside the modal */}
            <AddAccountForm onFormClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

// --- Account List Sub-Component ---
function AccountList() {
  const { data: accounts, isLoading, isError } = useGetCompanyAccounts();
  const deleteMutation = useDeleteCompanyAccount();
  const setDefaultMutation = useSetDefaultCompanyAccount();

  const isMutating = deleteMutation.isPending || setDefaultMutation.isPending;

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-8 w-8" />
        <span className="font-semibold">Failed to load bank accounts.</span>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-gray-500 border border-dashed rounded-lg">
        <Banknote className="h-10 w-10" />
        <h3 className="font-semibold">No Accounts Added</h3>
        <p className="text-sm">
          Get started by adding a new company bank account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          {/* Account Details */}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {account.accountName}
              </h3>
              {account.default && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  <Check className="h-3 w-3" />
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {account.bankName} - {account.accountNumber}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            {!account.default && (
              <Button
                variant="secondary"
                size="sm"
                className="w-auto px-3" // Override fixed width
                onClick={() => setDefaultMutation.mutate(account.id)}
                isLoading={
                  setDefaultMutation.isPending &&
                  setDefaultMutation.variables === account.id
                }
                disabled={isMutating}
              >
                Set as Default
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              className="w-auto px-3" // Override fixed width
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this account?"
                  )
                ) {
                  deleteMutation.mutate(account.id);
                }
              }}
              isLoading={
                deleteMutation.isPending &&
                deleteMutation.variables === account.id
              }
              disabled={isMutating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Add Account Form Sub-Component ---
function AddAccountForm({ onFormClose }: { onFormClose: () => void }) {
  // Form State
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<Option | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedAccount, setResolvedAccount] =
    useState<BankResolveResponse | null>(null);

  const debouncedBankSearch = useDebounce(bankSearch, 500);

  // API Hooks
  const { data: banks, isLoading: isBankListLoading } =
    useGetBanks(debouncedBankSearch);
  const {
    data: resolvedData,
    isFetching: isResolving,
    isError: isResolveError,
    error: resolveError,
    refetch: resolveAccountDetails,
  } = useResolveAccount(accountNumber, selectedBank?.id || "");

  const createAccountMutation = useCreateCompanyAccount();

  // Memoize bank options for the Select component
  const bankOptions: Option[] = useMemo(() => {
    return banks
      ? banks.map((bank) => ({ id: bank.code, name: bank.name }))
      : [];
  }, [banks]);

  // Effect to trigger account resolution
  useEffect(() => {
    // Only resolve if we have a 10-digit account number and a selected bank
    if (accountNumber.length === 10 && selectedBank) {
      resolveAccountDetails();
    }
  }, [accountNumber, selectedBank, resolveAccountDetails]);

  // Effect to handle the result of the resolution
  useEffect(() => {
    if (resolvedData) setResolvedAccount(resolvedData);
    else setResolvedAccount(null);
  }, [resolvedData]);

  // Clear resolved account if inputs change
  useEffect(() => {
    setResolvedAccount(null);
  }, [accountNumber, selectedBank]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedAccount) {
      toast.error("Please wait for account to be verified.");
      return;
    }

    createAccountMutation.mutate(
      {
        accountName: resolvedAccount.accountName,
        accountNumber: resolvedAccount.accountNumber,
        bankName: resolvedAccount.bankName,
        bankCode: resolvedAccount.bankCode,
      },
      { onSuccess: () => onFormClose() } // Close modal on success
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Add New Bank Account
        </h2>
        <button
          type="button"
          onClick={onFormClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form Body */}
      <div className="space-y-4">
        {/* Bank Search Input */}
        <TextInput
          label="Search for Bank"
          id="bankSearch"
          placeholder="Type to search (e.g., Access, UBA...)"
          value={bankSearch}
          onChange={(e) => {
            setBankSearch(e.target.value);
            setSelectedBank(null); // Clear selection when searching
          }}
        />

        {/* Bank Select Dropdown */}
        <Select
          label="Select Bank"
          hideLabel
          placeholder={
            isBankListLoading ? "Searching..." : "Select from results"
          }
          options={bankOptions}
          selected={selectedBank}
          onChange={(option) => {
            setSelectedBank(option);
            setBankSearch(option.name); // Sync search input with selection
          }}
        />

        {/* Account Number Input */}
        <TextInput
          label="Account Number"
          id="accountNumber"
          type="text"
          placeholder="Enter 10-digit account number"
          value={accountNumber}
          maxLength={10}
          onChange={(e) => {
            setAccountNumber(e.target.value.replace(/[^0-9]/g, "")); // Allow only numbers
          }}
          disabled={!selectedBank}
        />

        {/* Account Resolution Status UI */}
        <div className="h-12 pt-2">
          {isResolving && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying account details...
            </div>
          )}
          {isResolveError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>
                {(resolveError as Error)?.message ||
                  "Could not verify account."}
              </span>
            </div>
          )}
          {resolvedAccount && (
            <div className="flex items-center gap-2 text-sm text-green-700 p-2 bg-green-50 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">
                {resolvedAccount.accountName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Form Footer */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <Button type="button" variant="secondary" onClick={onFormClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={createAccountMutation.isPending}
          // Disable button unless account is resolved and not mutating
          disabled={!resolvedAccount || createAccountMutation.isPending}
        >
          Save Account
        </Button>
      </div>
    </form>
  );
}

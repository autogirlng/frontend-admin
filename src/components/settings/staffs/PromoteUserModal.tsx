// app/dashboard/settings/staffs/PromoteUserModal.tsx
"use client";

import React, { useState } from "react";
import { X, Search, User, Check } from "lucide-react";
import { toast } from "react-hot-toast";

import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import clsx from "clsx";
import { Customer, Host } from "./types";
import {
  useGetCustomersForPromotion,
  useGetHostsForPromotion,
  usePromoteUserToAdmin,
} from "@/lib/hooks/settings/useAdmins";

interface PromoteUserModalProps {
  onClose: () => void;
}

type UserType = "CUSTOMER" | "HOST";
type SelectedUser = (Customer | Host) & { userType: UserType };

export function PromoteUserModal({ onClose }: PromoteUserModalProps) {
  const [userType, setUserType] = useState<UserType>("CUSTOMER");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: customerData, isLoading: isLoadingCustomers } =
    useGetCustomersForPromotion(debouncedSearchTerm);
  const { data: hostData, isLoading: isLoadingHosts } =
    useGetHostsForPromotion(debouncedSearchTerm);

  const { mutate: promoteUser, isPending } = usePromoteUserToAdmin();

  const isLoading = isLoadingCustomers || isLoadingHosts;
  const searchResults =
    userType === "CUSTOMER" ? customerData?.content : hostData?.content;

  const handlePromote = () => {
    if (!selectedUser) {
      toast.error("Please select a user to promote.");
      return;
    }
    promoteUser(selectedUser.id, {
      onSuccess: onClose,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isPending}
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
          Promote User to Admin
        </h3>

        {/* User Type Toggle */}
        <div className="flex shadow-sm mb-4">
          <button
            type="button"
            onClick={() => setUserType("CUSTOMER")}
            className={clsx(
              "relative -mr-px inline-flex flex-1 items-center justify-center gap-x-2 border border-gray-300 px-3 py-2 text-sm font-semibold",
              userType === "CUSTOMER"
                ? "bg-[#0096FF] text-white"
                : "bg-white text-gray-900 hover:bg-gray-50"
            )}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType("HOST")}
            className={clsx(
              "relative inline-flex flex-1 items-center justify-center gap-x-2 border border-gray-300 px-3 py-2 text-sm font-semibold",
              userType === "HOST"
                ? "bg-[#0096FF] text-white"
                : "bg-white text-gray-900 hover:bg-gray-50"
            )}
          >
            Host
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label={`Search ${userType}s`}
            id="user-search"
            hideLabel
            placeholder={`Search for a ${userType.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* Search Results */}
        <div className="mt-4 h-48 overflow-y-auto border">
          {isLoading && <CustomLoader />}
          {!isLoading && !searchResults && (
            <p className="p-4 text-center text-gray-500">
              Type 3 or more characters to search...
            </p>
          )}
          {!isLoading && searchResults && searchResults.length === 0 && (
            <p className="p-4 text-center text-gray-500">No users found.</p>
          )}
          {!isLoading &&
            searchResults &&
            searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser({ ...user, userType: userType })}
                className={clsx(
                  "flex w-full items-center justify-between p-3 text-left hover:bg-gray-50 border-b",
                  selectedUser?.id === user.id && "bg-blue-50"
                )}
              >
                <div>
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {selectedUser?.id === user.id && (
                  <Check className="h-5 w-5 text-[#0096FF]" />
                )}
              </button>
            ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handlePromote}
            isLoading={isPending}
            disabled={!selectedUser}
            className="w-auto"
          >
            Promote to Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

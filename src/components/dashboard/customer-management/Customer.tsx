// app/dashboard/customer-management/CustomersPage.tsx
"use client";

import React, { useState } from "react";
import { useGetCustomers } from "@/lib/hooks/customer-management/useCustomers";
import { useUpdateCustomerStatus } from "@/lib/hooks/customer-management/useUpdateCustomerStatus";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Customer } from "./types";

import TextInput from "@/components/generic/ui/TextInput";
import {
  AlertCircle,
  Search,
  View,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { CustomerDetailModal } from "./CustomerDetailModal"; // ✅ Import new modal

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // ✅ Add "view" to modal state
  const [modal, setModal] = useState<"status" | "view" | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Data Fetching ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetCustomers(currentPage, debouncedSearchTerm);

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateCustomerStatus();

  const customers = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Modal Handlers ---
  const openModal = (type: "status" | "view", customer: Customer) => {
    setSelectedCustomer(customer);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedCustomer(null);
  };

  const handleStatusConfirm = () => {
    if (selectedCustomer) {
      updateStatus(
        {
          userId: selectedCustomer.id,
          isActive: !selectedCustomer.active,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );
    }
  };

  // --- Define Actions for the Menu ---
  const getCustomerActions = (customer: Customer): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: View,
      onClick: () => openModal("view", customer), // ✅ Use new modal
    },
    customer.active
      ? {
          label: "Deactivate",
          icon: Trash2,
          onClick: () => openModal("status", customer),
          danger: true,
        }
      : {
          label: "Activate",
          icon: CheckCircle,
          onClick: () => openModal("status", customer),
          danger: false,
        },
  ];

  // --- Define Columns for the Customer Table ---
  const columns: ColumnDefinition<Customer>[] = [
    {
      header: "Full Name",
      accessorKey: "fullName",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Total Bookings",
      accessorKey: "totalBookings",
    },
    {
      header: "Status",
      accessorKey: "active",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getCustomerActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all customers on the platform.
            </p>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Customers"
            id="search"
            hideLabel
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* --- Table Display --- */}
        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load customers.</span>
          </div>
        )}
        {!isLoading && !isError && customers.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No customers found.</p>
          </div>
        )}

        {/* Table: Use opacity for loading state on refetch */}
        {!isError && (customers.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={customers}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        {/* --- Pagination Controls --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>

      {/* ✅ Status Update Modal */}
      {modal === "status" && selectedCustomer && (
        <ActionModal
          title={
            selectedCustomer.active
              ? "Deactivate Customer"
              : "Activate Customer"
          }
          message={
            <>
              Are you sure you want to{" "}
              {selectedCustomer.active ? "deactivate" : "activate"}{" "}
              <span className="font-bold">{selectedCustomer.fullName}</span>?
              {selectedCustomer.active
                ? " This will prevent them from accessing the platform."
                : " This will restore their access to the platform."}
            </>
          }
          actionLabel={selectedCustomer.active ? "Deactivate" : "Activate"}
          onClose={closeModal}
          onConfirm={handleStatusConfirm}
          isLoading={isUpdatingStatus}
          variant={selectedCustomer.active ? "danger" : "primary"}
        />
      )}

      {/* ✅ RENDER NEW MODAL */}
      {modal === "view" && selectedCustomer && (
        <CustomerDetailModal
          customerId={selectedCustomer.id}
          onClose={closeModal}
        />
      )}
    </>
  );
}

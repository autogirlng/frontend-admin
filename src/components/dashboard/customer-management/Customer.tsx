"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGetCustomers } from "@/lib/hooks/customer-management/useCustomers";
import { useUpdateCustomerStatus } from "@/lib/hooks/customer-management/useUpdateCustomerStatus";
import { useUpdateCustomerApiVisibility } from "@/lib/hooks/customer-management/useUpdateCustomerApiVisibility";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Customer } from "./types";

import TextInput from "@/components/generic/ui/TextInput";
import {
  AlertCircle,
  Search,
  View,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useCustomerExport } from "./hooks/useCustomerExport";
import { useAllCustomerExport } from "./hooks/useAllCustomerExport";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { CustomerDetailModal } from "./CustomerDetailModal";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [modal, setModal] = useState<"status" | "view" | "api" | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetCustomers(currentPage, debouncedSearchTerm);

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateCustomerStatus();
  const { mutate: updateApiVisibility, isPending: isUpdatingApi } =
    useUpdateCustomerApiVisibility();

  const customers = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const { handleExportCustomers, isExporting } = useCustomerExport({
    searchTerm: debouncedSearchTerm,
  });

  const { handleExportAllCustomers, isExportingAll } = useAllCustomerExport();

  const openModal = (type: "status" | "view" | "api", customer: Customer) => {
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
        },
      );
    }
  };

  const handleApiConfirm = () => {
    if (selectedCustomer) {
      updateApiVisibility(
        {
          userId: selectedCustomer.id,
          canSeeApi: !selectedCustomer.canSeeApi,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        },
      );
    }
  };

  const getCustomerActions = (customer: Customer): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: View,
      onClick: () => openModal("view", customer),
    },
    {
      label: customer.canSeeApi ? "Hide API" : "Show API",
      icon: customer.canSeeApi ? EyeOff : Eye,
      onClick: () => openModal("api", customer),
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
        <div ref={topRef} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all customers on the platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={handleExportAllCustomers}
              variant="secondary"
              size="smd"
              disabled={isExportingAll}
              className="w-full sm:w-auto min-w-[140px] whitespace-nowrap"
            >
              {isExportingAll ? (
                <span>Exporting...</span>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Export All Customers
                </>
              )}
            </Button>
            <Button
              onClick={handleExportCustomers}
              variant="primary"
              size="smd"
              disabled={isLoading || customers.length === 0 || isExporting}
              className="w-full sm:w-auto min-w-[140px] whitespace-nowrap"
            >
              {isExporting ? (
                <span>Exporting...</span>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Export Customers
                </>
              )}
            </Button>
          </div>
        </div>
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
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>
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
      {modal === "api" && selectedCustomer && (
        <ActionModal
          title={
            selectedCustomer.canSeeApi
              ? "Revoke API Access"
              : "Grant API Access"
          }
          message={
            <>
              Are you sure you want to{" "}
              {selectedCustomer.canSeeApi ? "revoke" : "grant"} API visibility
              for <span className="font-bold">{selectedCustomer.fullName}</span>
              ?
            </>
          }
          actionLabel={selectedCustomer.canSeeApi ? "Revoke" : "Grant"}
          onClose={closeModal}
          onConfirm={handleApiConfirm}
          isLoading={isUpdatingApi}
          variant={selectedCustomer.canSeeApi ? "danger" : "primary"}
        />
      )}
      {modal === "view" && selectedCustomer && (
        <CustomerDetailModal
          customerId={selectedCustomer.id}
          onClose={closeModal}
        />
      )}
    </>
  );
}

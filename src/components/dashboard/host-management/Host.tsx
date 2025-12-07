"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetHosts } from "@/lib/hooks/host-management/useHosts";
import { useSendCredentials } from "@/lib/hooks/host-management/useSendCredentials";
import { useUpdateHostStatus } from "@/lib/hooks/host-management/useUpdateHostStatus";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Host } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CreateHostModal from "./CreateHostModal";
import {
  AlertCircle,
  Search,
  View,
  Trash2,
  Plus,
  KeyRound,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { useRouter } from "next/navigation";

export default function HostsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [modal, setModal] = useState<"status" | "view" | null>(null);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const topRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm]);

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
  } = useGetHosts(currentPage, debouncedSearchTerm);

  const { mutate: sendCredentials, isPending: isSendingCredentials } =
    useSendCredentials();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateHostStatus();

  const hosts = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const openModal = (type: "status" | "view", host: Host) => {
    setSelectedHost(host);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedHost(null);
  };

  const handleStatusConfirm = () => {
    if (selectedHost) {
      updateStatus(
        {
          userId: selectedHost.id,
          isActive: !selectedHost.active,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );
    }
  };

  const getHostActions = (host: Host): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: View,
      onClick: () => {
        toast.success(`Viewing ${host.fullName}`);
        router.push(`/dashboard/host/${host.id}`);
      },
    },
    {
      label: "View Payouts",
      icon: Wallet,
      onClick: () => {
        router.push(`/dashboard/host/payouts/${host.id}`);
      },
    },
    {
      label: "Send Credentials",
      icon: KeyRound,
      onClick: () => sendCredentials(host.id),
    },
    host.active
      ? {
          label: "Deactivate Host",
          icon: Trash2,
          onClick: () => openModal("status", host),
          danger: true,
        }
      : {
          label: "Activate Host",
          icon: CheckCircle,
          onClick: () => openModal("status", host),
          danger: false,
        },
  ];

  const columns: ColumnDefinition<Host>[] = [
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
      header: "Vehicles",
      accessorKey: "totalVehicles",
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
      cell: (item) => <ActionMenu actions={getHostActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        {/* --- Header --- */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="my-1">
            <h1 className="text-3xl font-bold text-gray-900">Hosts</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all hosts on the platform.
            </p>
          </div>
          <div className="my-1">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Host
            </Button>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Hosts"
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
            <span className="font-semibold">Failed to load hosts.</span>
          </div>
        )}
        {!isLoading && !isError && hosts.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No hosts found.</p>
          </div>
        )}

        {!isError && (hosts.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData || isSendingCredentials ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={hosts}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        {/* --- Pagination --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>

      {/* --- Modals --- */}
      {isCreateModalOpen && (
        <CreateHostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {modal === "status" && selectedHost && (
        <ActionModal
          title={selectedHost.active ? "Deactivate Host" : "Activate Host"}
          message={
            <>
              Are you sure you want to{" "}
              {selectedHost.active ? "deactivate" : "activate"}{" "}
              <span className="font-bold">{selectedHost.fullName}</span>?
              {selectedHost.active
                ? " This will prevent them from accessing the platform."
                : " This will restore their access to the platform."}
            </>
          }
          actionLabel={selectedHost.active ? "Deactivate" : "Activate"}
          onClose={closeModal}
          onConfirm={handleStatusConfirm}
          isLoading={isUpdatingStatus}
          variant={selectedHost.active ? "danger" : "primary"}
        />
      )}
    </>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  AlertCircle,
  CheckCircle,
  MessageSquareWarning,
  RefreshCw,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import {
  useGetAdminDisputes,
  usePatchDispute,
} from "@/lib/hooks/host-management/deductions/useDeductions";
import type { Dispute, DisputeStatus } from "@/lib/types/deductions";

const allStatusesOption: Option = { id: "ALL", name: "All Disputes" };

const statusOptions: Option[] = [
  allStatusesOption,
  { id: "OPEN", name: "Open" },
  { id: "UNDER_REVIEW", name: "Under Review" },
  { id: "RESOLVED", name: "Resolved" },
];

const updateStatusOptions: Option[] = statusOptions.filter(
  (option) => option.id !== allStatusesOption.id,
);

const formatEnumValue = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

const getStatusClassName = (status: DisputeStatus) => {
  switch (status) {
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "UNDER_REVIEW":
      return "bg-blue-100 text-blue-800";
    case "OPEN":
      return "bg-[#F3A218] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const StatusBadge = ({ status }: { status: DisputeStatus }) => (
  <span
    className={clsx(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      getStatusClassName(status),
    )}
  >
    {formatEnumValue(status)}
  </span>
);

const DisputeContextCell = ({ hostContext }: Dispute) => (
  <div className="max-w-[420px]">
    <p className="truncate font-medium text-gray-900">{hostContext}</p>
  </div>
);

export default function Disputes() {
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Option>(allStatusesOption);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetAdminDisputes({
    page: currentPage,
    size: 10,
    status:
      statusFilter.id === allStatusesOption.id
        ? undefined
        : (statusFilter.id as DisputeStatus),
  });

  const { mutate: patchDispute, isPending: isUpdatingDispute } =
    usePatchDispute();

  const disputes = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const openUpdateModal = (dispute: Dispute) => {
    if (dispute.status === "RESOLVED") return;

    setSelectedDispute(dispute);
    setSelectedStatus(
      updateStatusOptions.find((option) => option.id === dispute.status) ??
        updateStatusOptions[0],
    );
    setResolutionNotes(dispute.resolutionNotes ?? "");
  };

  const closeUpdateModal = () => {
    setSelectedDispute(null);
    setSelectedStatus(null);
    setResolutionNotes("");
  };

  const handleStatusFilterChange = (option: Option) => {
    setStatusFilter(option);
    setCurrentPage(0);
  };

  const handleUpdateDispute = () => {
    if (!selectedDispute || !selectedStatus) return;

    patchDispute(
      {
        id: selectedDispute.id,
        payload: {
          status: selectedStatus.id as DisputeStatus,
          resolutionNotes: resolutionNotes.trim(),
        },
      },
      {
        onSuccess: closeUpdateModal,
      },
    );
  };

  const getDisputeActions = (dispute: Dispute): ActionMenuItem[] => [
    {
      label: dispute.status === "RESOLVED" ? "Resolved" : "Update State",
      icon: dispute.status === "RESOLVED" ? CheckCircle : RefreshCw,
      disabled: dispute.status === "RESOLVED",
      onClick: () => openUpdateModal(dispute),
    },
  ];

  const columns: ColumnDefinition<Dispute>[] = [
    {
      header: "Dispute",
      accessorKey: "hostContext",
      cell: (item) => <DisputeContextCell {...item} />,
    },
    {
      header: "Deduction ID",
      accessorKey: "deductionId",
      cell: (item) => (
        <span className="font-mono text-sm">{item.deductionId}</span>
      ),
    },
    {
      header: "Host ID",
      accessorKey: "hostId",
      cell: (item) => item.hostId || "-",
    },
    {
      header: "Ticket",
      accessorKey: "csTicketReference",
      cell: (item) => item.csTicketReference || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getDisputeActions(item)} />,
    },
  ];

  const notesChanged =
    resolutionNotes.trim() !== (selectedDispute?.resolutionNotes ?? "");
  const isConfirmDisabled =
    !selectedDispute ||
    !selectedStatus ||
    selectedDispute.status === "RESOLVED" ||
    (selectedStatus.id === selectedDispute.status && !notesChanged);

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto relative">
        <div ref={topRef} className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="my-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Deduction Disputes
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Review deduction disputes and update their resolution state.
              </p>
            </div>
            <div className="w-full sm:w-56">
              <Select
                label="Status"
                hideLabel
                options={statusOptions}
                selected={statusFilter}
                onChange={handleStatusFilterChange}
              />
            </div>
          </div>
        </div>

        {isLoading && !paginatedData && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load disputes.</span>
          </div>
        )}

        {!isLoading && !isError && disputes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-10 text-gray-500">
            <MessageSquareWarning className="h-10 w-10 text-gray-300" />
            <p>No deduction disputes found.</p>
          </div>
        )}

        {!isError && (disputes.length > 0 || isLoading) && (
          <div
            className={clsx(
              (isPlaceholderData || isUpdatingDispute) &&
                "opacity-60 pointer-events-none",
            )}
          >
            <CustomTable
              columns={columns}
              data={disputes}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData || isLoading}
        />
      </main>

      {selectedDispute && (
        <ActionModal
          title="Update Dispute State"
          message={
            <>
              Update dispute{" "}
              <span className="font-semibold">{selectedDispute.id}</span>.
            </>
          }
          actionLabel="Update State"
          onClose={closeUpdateModal}
          onConfirm={handleUpdateDispute}
          isLoading={isUpdatingDispute}
          isConfirmDisabled={isConfirmDisabled}
          variant="primary"
        >
          <div className="space-y-4">
            <Select
              label="State"
              options={updateStatusOptions}
              selected={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select dispute state"
            />
            <TextAreaInput
              id="resolution-notes"
              label="Resolution Note"
              placeholder="Add a resolution note..."
              value={resolutionNotes}
              onChange={(event) => setResolutionNotes(event.target.value)}
              rows={4}
            />
            {selectedDispute.status === "RESOLVED" && (
              <p className="text-sm text-gray-500">
                Resolved disputes are final and cannot be changed.
              </p>
            )}
          </div>
        </ActionModal>
      )}
    </>
  );
}

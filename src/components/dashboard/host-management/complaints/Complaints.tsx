"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquareWarning,
  RefreshCw,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Button from "@/components/generic/ui/Button";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import {
  useGetComplaintDetails,
  useGetComplaints,
  useUpdateComplaintStatus,
} from "@/lib/hooks/host-management/complaints/useComplaints";
import type {
  Complaint,
  ComplaintStatus,
  ComplaintType,
} from "@/lib/types/complaints";

const statusOptions: Option[] = [
  { id: "PENDING", name: "Pending" },
  { id: "IN_PROGRESS", name: "In Progress" },
  { id: "RESOLVED", name: "Resolved" },
];

const getAvailableStatusOptions = (status: ComplaintStatus): Option[] => {
  if (status === "PENDING") {
    return statusOptions.filter((option) => option.id !== "PENDING");
  }

  if (status === "IN_PROGRESS") {
    return statusOptions.filter((option) => option.id === "RESOLVED");
  }

  return [];
};

const formatEnumValue = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

const getStatusClassName = (status: ComplaintStatus) => {
  switch (status) {
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "PENDING":
      return "bg-[#F3A218] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeClassName = (type: ComplaintType) => {
  switch (type) {
    case "COMPLAINT":
      return "bg-red-100 text-red-800";
    case "SUGGESTION":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const StatusBadge = ({ status }: { status: ComplaintStatus }) => (
  <span
    className={clsx(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      getStatusClassName(status),
    )}
  >
    {formatEnumValue(status)}
  </span>
);

const TypeBadge = ({ type }: { type: ComplaintType }) => (
  <span
    className={clsx(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      getTypeClassName(type),
    )}
  >
    {formatEnumValue(type)}
  </span>
);

const ComplaintTextCell = ({ title, description }: Complaint) => (
  <div className="max-w-[360px]">
    <p className="font-medium text-gray-900 truncate">{title}</p>
    <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
  </div>
);

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

export default function Complaints() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [detailComplaintId, setDetailComplaintId] = useState<string | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetComplaints({ page: currentPage, size: 10 });

  const {
    data: complaintDetails,
    isLoading: isLoadingDetails,
    isError: isDetailError,
  } = useGetComplaintDetails(detailComplaintId);

  const { mutate: updateComplaintStatus, isPending: isUpdatingStatus } =
    useUpdateComplaintStatus();

  const complaints = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const detailComplaint = complaintDetails || selectedComplaint;

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const openDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDetailComplaintId(complaint.id);
    setIsDetailOpen(true);
  };

  const openStatusModal = (complaint: Complaint) => {
    if (complaint.status === "RESOLVED") return;

    const availableStatusOptions = getAvailableStatusOptions(complaint.status);

    setSelectedComplaint(complaint);
    setSelectedStatus(availableStatusOptions[0] ?? null);
    setResolutionNote("");
    setIsStatusModalOpen(true);
  };

  const closeDetails = () => {
    setIsDetailOpen(false);
    setDetailComplaintId(null);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedComplaint(null);
    setSelectedStatus(null);
    setResolutionNote("");
  };

  const handleStatusConfirm = () => {
    if (!selectedComplaint || !selectedStatus) return;

    updateComplaintStatus(
      {
        id: selectedComplaint.id,
        payload: {
          status: selectedStatus.id as ComplaintStatus,
          resolutionNote: resolutionNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          closeStatusModal();
        },
      },
    );
  };

  const getComplaintActions = (complaint: Complaint): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => openDetails(complaint),
    },
    {
      label:
        complaint.status === "RESOLVED"
          ? "Status Resolved"
          : "Update Status",
      icon: complaint.status === "RESOLVED" ? CheckCircle : RefreshCw,
      disabled: complaint.status === "RESOLVED",
      onClick: () => openStatusModal(complaint),
    },
  ];

  const columns: ColumnDefinition<Complaint>[] = [
    {
      header: "Complaint",
      accessorKey: "title",
      cell: (item) => <ComplaintTextCell {...item} />,
    },
    {
      header: "Submitted By",
      accessorKey: "complaintUser",
      cell: (item) => (
        <div>
          <p className="font-medium text-gray-900">
            {item.complaintUser?.name || "-"}
          </p>
          <p className="text-xs text-gray-500">
            {item.complaintUser?.email || ""}
          </p>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (item) => <TypeBadge type={item.type} />,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getComplaintActions(item)} />,
    },
  ];

  const isConfirmDisabled =
    !selectedComplaint ||
    !selectedStatus ||
    selectedStatus.id === selectedComplaint.status ||
    selectedComplaint.status === "RESOLVED";

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto relative">
        <div ref={topRef}>
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="my-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Host Complaints
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Review host complaints and update their progress.
              </p>
            </div>
          </div>
        </div>

        {isLoading && !paginatedData && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load complaints.</span>
          </div>
        )}

        {!isLoading && !isError && complaints.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No host complaints found.</p>
          </div>
        )}

        {!isError && (complaints.length > 0 || isLoading) && (
          <div
            className={clsx(
              (isPlaceholderData || isUpdatingStatus) &&
                "opacity-60 pointer-events-none",
            )}
          >
            <CustomTable
              columns={columns}
              data={complaints}
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

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close complaint details"
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={closeDetails}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Complaint Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Full host submission and progress state.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={closeDetails}
                className="w-auto"
              >
                Close
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingDetails && <CustomLoader />}
              {isDetailError && (
                <div className="flex flex-col items-center gap-2 p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-8 w-8" />
                  <span className="font-semibold">
                    Failed to load complaint details.
                  </span>
                </div>
              )}
              {!isLoadingDetails && !isDetailError && detailComplaint && (
                <dl className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                      <MessageSquareWarning className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {detailComplaint.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <TypeBadge type={detailComplaint.type} />
                        <StatusBadge status={detailComplaint.status} />
                      </div>
                    </div>
                  </div>

                  <DetailItem
                    label="Submitted By"
                    value={
                      <div>
                        <p>{detailComplaint.complaintUser?.name || "-"}</p>
                        <p className="text-xs text-gray-500">
                          {detailComplaint.complaintUser?.email || ""}
                        </p>
                      </div>
                    }
                  />
                  <DetailItem
                    label="Description"
                    value={
                      <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                        {detailComplaint.description}
                      </p>
                    }
                  />
                </dl>
              )}
            </div>
          </aside>
        </div>
      )}

      {isStatusModalOpen && selectedComplaint && (
        <ActionModal
          title="Update Complaint Status"
          message={
            <>
              Update progress for{" "}
              <span className="font-semibold">{selectedComplaint.title}</span>.
            </>
          }
          actionLabel="Update Status"
          onClose={closeStatusModal}
          onConfirm={handleStatusConfirm}
          isLoading={isUpdatingStatus}
          isConfirmDisabled={isConfirmDisabled}
          variant="primary"
        >
          <div className="space-y-4">
            <Select
              label="Status"
              options={getAvailableStatusOptions(selectedComplaint.status)}
              selected={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select complaint status"
            />
            <TextAreaInput
              id="resolution-note"
              label="Resolution Note"
              placeholder="Add an optional note for this status update..."
              value={resolutionNote}
              onChange={(event) => setResolutionNote(event.target.value)}
              rows={3}
            />
            {isConfirmDisabled && (
              <p className="text-sm text-gray-500">
                Choose a different non-final status to update this complaint.
              </p>
            )}
          </div>
        </ActionModal>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import { useGetHostMOUs, useDownloadMOU } from "@/lib/hooks/host-management/useHostMou";
import { MOUData } from "./types";
import { CustomTable, ColumnDefinition } from "@/components/generic/ui/Table";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { Download, RefreshCcw, AlertCircle } from "lucide-react";
import UpdateMouStatusModal from "./UpdateMouStatusModal";

interface HostMouProps {
  hostId: string;
}

export default function HostMou({ hostId }: HostMouProps) {
  const { data: mous, isLoading, isError } = useGetHostMOUs(hostId);
  const { mutate: downloadMOU, isPending: isDownloading } = useDownloadMOU();

  const [selectedMou, setSelectedMou] = useState<MOUData | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleDownload = (mouId: string) => {
    downloadMOU(mouId);
  };

  const openUpdateModal = (mou: MOUData) => {
    setSelectedMou(mou);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedMou(null);
    setIsUpdateModalOpen(false);
  };

  const getMouActions = (mou: MOUData): ActionMenuItem[] => [
    {
      label: "Download MOU",
      icon: Download,
      onClick: () => handleDownload(mou.id),
    },
    {
      label: "Update Status",
      icon: RefreshCcw,
      onClick: () => openUpdateModal(mou),
    },
  ];

  const columns: ColumnDefinition<MOUData>[] = [
    {
      header: "Version",
      accessorKey: "mouVersion",
      cell: (item) => (
        <span className="font-medium text-gray-900">{item.mouVersion}</span>
      ),
    },
    {
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : item.status === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: (item) => new Date(item.updatedAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getMouActions(item)} />,
    },
  ];

  return (
    <>
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="my-1">
            <h1 className="text-3xl font-bold text-gray-900">Host MOUs</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage MOU submissions for this host.
            </p>
          </div>
        </div>

        {isLoading && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load MOUs.</span>
          </div>
        )}
        {!isLoading && !isError && (!mous || mous.length === 0) && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No MOUs found for this host.</p>
          </div>
        )}

        {!isError && mous && mous.length > 0 && (
          <div className={`${isDownloading ? "opacity-50" : ""} transition-opacity`}>
            <CustomTable
              data={mous}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}
      </main>

      {isUpdateModalOpen && selectedMou && (
        <UpdateMouStatusModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          mou={selectedMou}
        />
      )}
    </>
  );
}

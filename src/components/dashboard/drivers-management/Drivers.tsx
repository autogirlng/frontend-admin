"use client";

import React, { useState } from "react";
import {
  useGetMyDrivers,
  useSendScheduleLink,
} from "@/lib/hooks/drivers-management/useDrivers";
import { Driver } from "./types";
import { CreateDriverModal } from "./CreateDriverModal";
import { DriverScheduleModal } from "./DriverScheduleModal";
import Button from "@/components/generic/ui/Button";
import { AlertCircle, Plus, Send, Calendar } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";

export default function DriversPage() {
  const [modal, setModal] = useState<"create" | "schedule" | "sendLink" | null>(
    null
  );
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // --- API Hooks ---
  const { data: drivers, isLoading, isError } = useGetMyDrivers();
  const sendLinkMutation = useSendScheduleLink();

  // --- Modal Handlers ---
  const openModal = (
    type: "create" | "schedule" | "sendLink",
    driver: Driver | null = null
  ) => {
    setSelectedDriver(driver);
    setModal(type);
  };
  const closeModal = () => {
    setModal(null);
    setSelectedDriver(null);
  };

  // --- Action Handlers ---
  const handleSendLink = () => {
    if (!selectedDriver) return;
    sendLinkMutation.mutate(
      { driverId: selectedDriver.id },
      { onSuccess: closeModal }
    );
  };

  // --- Define Actions for the Menu ---
  const getDriverActions = (driver: Driver): ActionMenuItem[] => [
    {
      label: "View/Edit Schedule",
      icon: Calendar,
      onClick: () => openModal("schedule", driver),
    },
    {
      label: "Send Schedule Link",
      icon: Send,
      onClick: () => openModal("sendLink", driver),
    },
    // Add other actions like 'Edit Driver' or 'Delete Driver' here
  ];

  // --- Define Columns for the Table ---
  const columns: ColumnDefinition<Driver>[] = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (item) => `${item.firstName} ${item.lastName}`,
    },
    {
      header: "Identifier",
      accessorKey: "driverIdentifier",
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Owner",
      accessorKey: "owner",
      cell: (item) => item.owner.firstName, // Assuming you just want the name
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getDriverActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage your company's drivers and their schedules.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto px-5"
            onClick={() => openModal("create")}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Driver
          </Button>
        </div>

        {/* --- Table Display --- */}
        {isLoading && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load drivers.</span>
          </div>
        )}
        {!isLoading && !isError && drivers && (
          <CustomTable
            data={drivers}
            columns={columns}
            getUniqueRowId={(item) => item.id}
          />
        )}
      </main>

      {/* --- Modals --- */}
      {modal === "create" && <CreateDriverModal onClose={closeModal} />}

      {modal === "schedule" && selectedDriver && (
        <DriverScheduleModal driver={selectedDriver} onClose={closeModal} />
      )}

      {modal === "sendLink" && selectedDriver && (
        <ActionModal
          title="Send Schedule Link"
          message={
            <>
              Are you sure you want to send a schedule setup link to{" "}
              <strong className="text-gray-900">
                {selectedDriver.firstName} {selectedDriver.lastName}
              </strong>
              ?
            </>
          }
          actionLabel="Yes, Send Link"
          onClose={closeModal}
          onConfirm={handleSendLink}
          isLoading={sendLinkMutation.isPending}
          variant="primary"
        />
      )}
    </>
  );
}

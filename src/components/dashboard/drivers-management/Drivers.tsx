"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetMyDrivers,
  useSendScheduleLink,
  useUnassignDriverFromVehicle,
  useUpdateDriverStatus,
} from "@/lib/hooks/drivers-management/useDrivers";
import { Driver } from "./types";
import { CreateDriverModal } from "./CreateDriverModal";
import { DriverScheduleModal } from "./DriverScheduleModal";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import {
  AlertCircle,
  Plus,
  Send,
  Calendar,
  Search,
  CheckCircle,
  Trash2,
  Edit,
  Unlink,
  Link as LinkIcon,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";
import { EditDriverModal } from "./EditDriverModal";
import Link from "next/link";
import { AssignVehicleModal } from "./AssignVehicleModal";

export default function DriversPage() {
  const [modal, setModal] = useState<
    | "create"
    | "schedule"
    | "sendLink"
    | "status"
    | "edit"
    | "assignVehicle" // ✅ Add
    | "unassignVehicle" // ✅ Add
    | null
  >(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetMyDrivers(currentPage, debouncedSearchTerm);

  const sendLinkMutation = useSendScheduleLink();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateDriverStatus();
  // ✅ Instantiate new mutation hook
  const { mutate: unassignDriver, isPending: isUnassigning } =
    useUnassignDriverFromVehicle();

  const drivers = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Modal Handlers ---
  const openModal = (
    type:
      | "create"
      | "schedule"
      | "sendLink"
      | "status"
      | "edit"
      | "assignVehicle"
      | "unassignVehicle",
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

  const handleStatusConfirm = () => {
    if (!selectedDriver) return;
    updateStatus(
      {
        driverId: selectedDriver.id,
        isActive: !selectedDriver.active,
      },
      {
        onSuccess: closeModal,
      }
    );
  };

  // ✅ New handler for unassigning
  const handleUnassignConfirm = () => {
    if (!selectedDriver || !selectedDriver.assignedVehicleId) return;
    unassignDriver(
      { vehicleId: selectedDriver.assignedVehicleId },
      {
        onSuccess: closeModal,
      }
    );
  };

  // --- Define Actions for the Menu (Updated) ---
  const getDriverActions = (driver: Driver): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "Edit Driver",
        icon: Edit,
        onClick: () => openModal("edit", driver),
      },
      // ✅ Dynamic Assign/Unassign Action
      driver.assignedVehicleId
        ? {
            label: "Unassign Vehicle",
            icon: Unlink,
            onClick: () => openModal("unassignVehicle", driver),
            danger: true,
          }
        : {
            label: "Assign Vehicle",
            icon: LinkIcon,
            onClick: () => openModal("assignVehicle", driver),
          },
      {
        label: "View/Edit Schedule",
        icon: Calendar,
        onClick: () => openModal("schedule", driver),
      },
      /*       {
        label: "Send Schedule Link",
        icon: Send,
        onClick: () => openModal("sendLink", driver),
      }, */
      driver.active
        ? {
            label: "Deactivate Driver",
            icon: Trash2,
            onClick: () => openModal("status", driver),
            danger: true,
          }
        : {
            label: "Activate Driver",
            icon: CheckCircle,
            onClick: () => openModal("status", driver),
            danger: false,
          },
    ];
    return actions;
  };

  // --- Define Columns for the Table (Updated) ---
  const columns: ColumnDefinition<Driver>[] = [
    {
      header: "Name",
      accessorKey: "fullName",
    },
    {
      header: "Identifier",
      accessorKey: "driverIdentifier",
    },
    // ✅ UPDATED COLUMN
    {
      header: "Assigned Vehicle",
      accessorKey: "assignedVehicleName",
      cell: (item) =>
        item.assignedVehicleId ? (
          <Link
            href={`/dashboard/vehicle-onboarding/${item.assignedVehicleId}`}
            className="group"
          >
            <div className="font-medium text-gray-900 group-hover:text-[#0096FF] group-hover:underline">
              {item.assignedVehicleName}
            </div>
            <div className="text-sm text-gray-500">
              {item.assignedVehicleIdentifier}
            </div>
          </Link>
        ) : (
          <span className="text-gray-400">Not Assigned</span>
        ),
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Owner",
      accessorKey: "ownerName",
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

        {/* --- Search Bar --- */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Drivers"
            id="search"
            hideLabel
            type="text"
            placeholder="Search by name, identifier, or phone..."
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
            <span className="font-semibold">Failed to load drivers.</span>
          </div>
        )}
        {!isLoading && !isError && drivers.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No drivers found.</p>
          </div>
        )}

        {!isError && (drivers.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData || sendLinkMutation.isPending
                ? "opacity-50"
                : ""
            } transition-opacity`}
          >
            <CustomTable
              data={drivers}
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

      {/* --- Modals --- */}
      {modal === "create" && <CreateDriverModal onClose={closeModal} />}

      {modal === "schedule" && selectedDriver && (
        <DriverScheduleModal driver={selectedDriver} onClose={closeModal} />
      )}

      {modal === "edit" && selectedDriver && (
        <EditDriverModal driverId={selectedDriver.id} onClose={closeModal} />
      )}

      {/* ✅ RENDER NEW MODALS */}
      {modal === "assignVehicle" && selectedDriver && (
        <AssignVehicleModal driver={selectedDriver} onClose={closeModal} />
      )}

      {modal === "unassignVehicle" && selectedDriver && (
        <ActionModal
          title="Unassign Vehicle"
          message={
            <>
              Are you sure you want to unassign{" "}
              <strong className="text-gray-900">
                {selectedDriver.fullName}
              </strong>{" "}
              from{" "}
              <strong className="text-gray-900">
                {selectedDriver.assignedVehicleName}
              </strong>
              ?
            </>
          }
          actionLabel="Yes, Unassign"
          onClose={closeModal}
          onConfirm={handleUnassignConfirm}
          isLoading={isUnassigning}
          variant="danger"
        />
      )}

      {modal === "sendLink" && selectedDriver && (
        <ActionModal
          title="Send Schedule Link"
          message={
            <>
              Are you sure you want to send a schedule setup link to{" "}
              <strong className="text-gray-900">
                {selectedDriver.fullName}
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

      {modal === "status" && selectedDriver && (
        <ActionModal
          title={
            selectedDriver.active ? "Deactivate Driver" : "Activate Driver"
          }
          message={
            <>
              Are you sure you want to{" "}
              {selectedDriver.active ? "deactivate" : "activate"}{" "}
              <strong className="text-gray-900">
                {selectedDriver.fullName}
              </strong>
              ?
            </>
          }
          actionLabel={selectedDriver.active ? "Deactivate" : "Activate"}
          onClose={closeModal}
          onConfirm={handleStatusConfirm}
          isLoading={isUpdatingStatus}
          variant={selectedDriver.active ? "danger" : "primary"}
        />
      )}
    </>
  );
}

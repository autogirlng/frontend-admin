"use client";

import React, { useState, useMemo } from "react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Vehicle, VehicleStatus, AvailabilityStatus } from "./types";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import {
  AlertCircle,
  Search,
  View,
  Check,
  X,
  PauseCircle,
  Play,
  Plus,
  Edit,
  Circle,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import {
  useGetVehicles,
  useSetVehicleActive,
  useUpdateVehicleStatus,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import CustomLoader from "@/components/generic/CustomLoader";
import { ApproveVehicleModal } from "./ApproveVehicleModal";
import Button from "@/components/generic/ui/Button";
import { AddVehicleModal } from "./AddVehicleModal";
import { useRouter } from "next/navigation";
import { ManageUnavailabilityModal } from "./ManageUnavailabilityModal";
import clsx from "clsx";

// --- Define Status Options for Filtering ---
const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  { id: VehicleStatus.DRAFT, name: "Draft" },
  { id: VehicleStatus.IN_REVIEW, name: "In Review" },
  { id: VehicleStatus.APPROVED, name: "Approved" },
  { id: VehicleStatus.REJECTED, name: "Rejected" },
  /*   { id: VehicleStatus.UNAVAILABLE, name: "Unavailable" },
  { id: VehicleStatus.IN_MAINTENANCE, name: "In Maintenance" },
  { id: VehicleStatus.COMPANY_USE, name: "Company Use" }, */
];

const formatOnboardingStatus = (status: VehicleStatus) => {
  return (status || "")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const formatOperationalStatus = (status: string) => {
  let colorClasses = "bg-gray-100 text-gray-800";
  let icon = <Circle className="h-2 w-2 text-gray-500" />;

  switch (status) {
    case "FREE":
      colorClasses = "bg-green-100 text-green-800";
      icon = <Circle className="h-2 w-2 text-green-500 fill-current" />;
      break;
    case "BOOKED":
    case "IN_TRIP": // Assuming IN_TRIP might appear
      colorClasses = "bg-blue-100 text-blue-800";
      icon = <Circle className="h-2 w-2 text-blue-500 fill-current" />;
      break;
    case "MAINTENANCE":
    case "COMPANY_USE":
      colorClasses = "bg-yellow-100 text-yellow-800";
      icon = <Circle className="h-2 w-2 text-yellow-500 fill-current" />;
      break;
    case "UNAVAILABLE":
      colorClasses = "bg-red-100 text-red-800";
      icon = <Circle className="h-2 w-2 text-red-500 fill-current" />;
      break;
    case "DRAFT":
    default:
      icon = <Circle className="h-2 w-2 text-gray-400" />;
      break;
  }

  const formattedText = (status || "DRAFT")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full",
        colorClasses
      )}
    >
      {icon}
      {formattedText}
    </span>
  );
};

export default function VehicleOnboarding() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Option | null>(null);

  // ✅ MODIFIED: Updated modal state
  const [modal, setModal] = useState<"reject" | "setActive" | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isUnavailabilityModalOpen, setIsUnavailabilityModalOpen] =
    useState(false); // ✅ NEW

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetVehicles(currentPage, debouncedSearchTerm, statusFilter?.id || "");

  // 🛑 REMOVED: availabilityMutation
  const setActiveMutation = useSetVehicleActive();
  const rejectMutation = useUpdateVehicleStatus();

  const vehicles = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Modal Handling ---
  const openModal = (type: "reject" | "setActive", vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModal(type);
  };
  const openApproveModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsApproveModalOpen(true);
  };
  // ✅ NEW: Handler for new modal
  const openUnavailabilityModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUnavailabilityModalOpen(true);
  };

  const closeModal = () => {
    setModal(null);
    setIsApproveModalOpen(false);
    setIsAddVehicleModalOpen(false);
    setIsUnavailabilityModalOpen(false); // ✅ NEW
    setSelectedVehicle(null);
  };

  // --- Action Handlers ---
  // 🛑 REMOVED: handleSetAvailability

  const handleSetActive = () => {
    if (!selectedVehicle) return;
    setActiveMutation.mutate(
      { id: selectedVehicle.id },
      { onSuccess: closeModal }
    );
  };

  const handleReject = () => {
    if (!selectedVehicle) return;
    rejectMutation.mutate(
      { id: selectedVehicle.id, status: VehicleStatus.REJECTED },
      { onSuccess: closeModal }
    );
  };

  // --- Dynamic Action Menu ---
  const getVehicleActions = (vehicle: Vehicle): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [];

    actions.push({
      label: "View Details",
      icon: View,
      onClick: () => {
        toast.success(`Navigating to details for ${vehicle.name}`);
        router.push(`/dashboard/vehicle-onboarding/${vehicle.id}`);
      },
    });

    switch (vehicle.status) {
      case VehicleStatus.DRAFT:
      case VehicleStatus.IN_REVIEW:
        actions.push({
          label: "Review / Approve",
          icon: Check,
          onClick: () => openApproveModal(vehicle),
        });
        actions.push({
          label: "Reject",
          icon: X,
          onClick: () => openModal("reject", vehicle),
          danger: true,
        });
        break;

      case VehicleStatus.APPROVED:
        actions.push({
          label: "Manage Unavailability", // ✅ RENAMED
          icon: PauseCircle,
          onClick: () => openUnavailabilityModal(vehicle), // ✅ UPDATED
        });
        break;

      case VehicleStatus.REJECTED:
      case VehicleStatus.UNAVAILABLE:
      case VehicleStatus.IN_MAINTENANCE:
      case VehicleStatus.COMPANY_USE:
        actions.push({
          label: "Set as Active",
          icon: Play,
          onClick: () => openModal("setActive", vehicle),
        });
        break;
    }
    return actions;
  };

  // --- Table Columns ---
  const columns: ColumnDefinition<Vehicle>[] = useMemo(
    () => [
      {
        header: "Vehicle ID",
        accessorKey: "vehicleIdentifier",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Owner",
        accessorKey: "ownerName",
      },
      {
        header: "License Plate",
        accessorKey: "licensePlateNumber",
        cell: (item) => item.licensePlateNumber || "N/A",
      },
      {
        header: "Onboarding Status", // ✅ Renamed
        accessorKey: "status",
        cell: (item) => {
          let colorClasses = "";
          switch (item.status) {
            case VehicleStatus.APPROVED:
              colorClasses = "bg-green-100 text-green-800";
              break;
            case VehicleStatus.IN_REVIEW:
            case VehicleStatus.IN_MAINTENANCE:
              colorClasses = "bg-yellow-100 text-yellow-800";
              break;
            case VehicleStatus.REJECTED:
            case VehicleStatus.UNAVAILABLE:
              colorClasses = "bg-red-100 text-red-800";
              break;
            case VehicleStatus.IN_TRIP:
            case VehicleStatus.BOOKED:
              colorClasses = "bg-blue-100 text-blue-800";
              break;
            case VehicleStatus.DRAFT:
            case VehicleStatus.COMPANY_USE:
            default:
              colorClasses = "bg-gray-100 text-gray-800";
              break;
          }
          return (
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses}`}
            >
              {formatOnboardingStatus(item.status)}
            </span>
          );
        },
      },
      // ✅ --- NEW COLUMN ---
      {
        header: "Operational Status",
        accessorKey: "operationalStatus",
        cell: (item) => formatOperationalStatus(item.operationalStatus),
      },
      // ✅ --- END NEW COLUMN ---
      {
        header: "Actions",
        accessorKey: "id",
        cell: (item) => <ActionMenu actions={getVehicleActions(item)} />,
      },
    ],
    [] // Empty dep array, getVehicleActions is stable
  );

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vehicle Onboarding
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Review, approve, and manage all vehicles.
            </p>
          </div>
          <div>
            <Button
              variant="primary"
              className="w-auto px-5" // Use your Button component
              onClick={() => setIsAddVehicleModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add a New Vehicle
            </Button>
          </div>
        </div>

        {/* --- Filters --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              label="Search Vehicles"
              id="search"
              hideLabel
              type="text"
              placeholder="Search by name, ID, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: 35 }}
            />
          </div>
          <Select
            label="Filter by Status"
            hideLabel
            placeholder="Filter by status"
            options={statusOptions}
            selected={statusFilter}
            onChange={(option) => setStatusFilter(option)}
          />
        </div>

        {/* --- Table Display --- */}
        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load vehicles.</span>
          </div>
        )}
        {!isLoading && !isError && vehicles.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No vehicles found for the selected filters.</p>
          </div>
        )}

        {!isError && (vehicles.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={vehicles}
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

      {/* 2. Reject Vehicle Modal */}
      {modal === "reject" && selectedVehicle && (
        <ActionModal
          title="Reject Vehicle"
          message={
            <>
              Are you sure you want to reject this vehicle:{" "}
              <strong className="text-gray-900">{selectedVehicle.name}</strong>?
              This action cannot be undone.
            </>
          }
          actionLabel="Yes, Reject"
          onClose={closeModal}
          onConfirm={handleReject}
          isLoading={rejectMutation.isPending}
          variant="danger"
        />
      )}

      {/* 3. Set Active Modal */}
      {modal === "setActive" && selectedVehicle && (
        <ActionModal
          title="Set Vehicle Active"
          message={
            <>
              Are you sure you want to set this vehicle to{" "}
              <strong className="text-green-600">APPROVED</strong>:{" "}
              <strong className="text-gray-900">{selectedVehicle.name}</strong>?
            </>
          }
          actionLabel="Set to Active"
          onClose={closeModal}
          onConfirm={handleSetActive}
          isLoading={setActiveMutation.isPending}
          variant="primary"
        />
      )}

      {isApproveModalOpen && selectedVehicle && (
        <ApproveVehicleModal
          vehicleId={selectedVehicle.id}
          onClose={closeModal}
        />
      )}

      {isAddVehicleModalOpen && <AddVehicleModal onClose={closeModal} />}

      {isUnavailabilityModalOpen && selectedVehicle && (
        <ManageUnavailabilityModal
          vehicleId={selectedVehicle.id}
          vehicleName={selectedVehicle.name}
          onClose={closeModal}
        />
      )}
    </>
  );
}

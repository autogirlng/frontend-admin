"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Vehicle, VehicleStatus } from "./types";
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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ManageUnavailabilityModal } from "./ManageUnavailabilityModal";

const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  { id: VehicleStatus.DRAFT, name: "Draft" },
  { id: VehicleStatus.IN_REVIEW, name: "In Review" },
  { id: VehicleStatus.APPROVED, name: "Approved" },
  { id: VehicleStatus.REJECTED, name: "Rejected" },
];

const formatOnboardingStatus = (status: VehicleStatus) => {
  return (status || "")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export default function VehicleOnboarding() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const topRef = useRef<HTMLDivElement>(null);

  const currentPageParam = Number(searchParams.get("page")) || 0;
  const statusParam = searchParams.get("status") || "";
  const searchParam = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchParam);

  const selectedStatusOption =
    statusOptions.find((opt) => opt.id === statusParam) || statusOptions[0];

  const [modal, setModal] = useState<"reject" | "setActive" | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isUnavailabilityModalOpen, setIsUnavailabilityModalOpen] =
    useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const updateURLParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === 0) {
        if (key === "page" && value === 0) params.delete(key);
        else if (value === "") params.delete(key);
        else params.set(key, String(value));
      } else {
        params.set(key, String(value));
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (debouncedSearchTerm !== searchParam) {
      updateURLParams({ search: debouncedSearchTerm, page: 0 });
    }
  }, [debouncedSearchTerm]);

  const handlePageChange = (newPage: number) => {
    updateURLParams({ page: newPage });
  };

  const handleStatusChange = (option: Option) => {
    updateURLParams({ status: option.id, page: 0 });
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPageParam]);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetVehicles(currentPageParam, searchParam, statusParam);

  const setActiveMutation = useSetVehicleActive();
  const rejectMutation = useUpdateVehicleStatus();

  const vehicles = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const openModal = (type: "reject" | "setActive", vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModal(type);
  };
  const openApproveModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsApproveModalOpen(true);
  };
  const openUnavailabilityModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUnavailabilityModalOpen(true);
  };

  const closeModal = () => {
    setModal(null);
    setIsApproveModalOpen(false);
    setIsAddVehicleModalOpen(false);
    setIsUnavailabilityModalOpen(false);
    setSelectedVehicle(null);
  };

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

  const getVehicleActions = (vehicle: Vehicle): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [];

    actions.push({
      label: "View Details",
      icon: View,
      onClick: () => {
        toast.success(`Navigating to details for ${vehicle.vehicleIdentifier}`);
        router.push(`/dashboard/vehicle-onboarding/${vehicle.id}`);
      },
    });

    actions.push({
      label: "Edit Vehicle",
      icon: Edit,
      onClick: () => {
        toast.success(`Navigating to details for ${vehicle.vehicleIdentifier}`);
        router.push(`/dashboard/onboarding?id=${vehicle.id}`);
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
          label: "Set Availability",
          icon: PauseCircle,
          onClick: () => openUnavailabilityModal(vehicle),
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
        header: "Onboarding Status",
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
      {
        header: "Actions",
        accessorKey: "id",
        cell: (item) => <ActionMenu actions={getVehicleActions(item)} />,
      },
    ],
    []
  );

  return (
    <>
      <div ref={topRef} />

      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
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
              className="w-auto px-5"
              onClick={() => setIsAddVehicleModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add a New Vehicle
            </Button>
          </div>
        </div>

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
              placeholder="Search by name, vehicle Id"
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
            selected={selectedStatusOption}
            onChange={handleStatusChange}
          />
        </div>

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

        <PaginationControls
          currentPage={currentPageParam}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isPlaceholderData}
        />
      </main>

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

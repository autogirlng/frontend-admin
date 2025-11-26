"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  User,
  Phone,
  Mail,
  Wallet,
  Car,
  Search,
  Eye,
  ArrowLeft,
  BadgeCheck,
  AlertCircle,
  Circle,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

// Hooks
import { useGetHostDetails } from "@/lib/hooks/host-management/useHosts";
import { useGetHostVehicles } from "@/lib/hooks/host-management/useHostVehicles";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";

// Components
import CustomLoader from "@/components/generic/CustomLoader";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { ActionMenu } from "@/components/generic/ui/ActionMenu";
import Button from "@/components/generic/ui/Button";

// Types
import { HostVehicle } from "./types";
import CustomBack from "@/components/generic/CustomBack";

// --- Helpers ---

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  { id: "DRAFT", name: "Draft" },
  { id: "IN_REVIEW", name: "In Review" },
  { id: "APPROVED", name: "Approved" },
  { id: "REJECTED", name: "Rejected" },
];

const formatStatus = (status: string) => {
  return (status || "")
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper for Operational Status Badge
const OperationalStatusBadge = ({ status }: { status: string }) => {
  let colorClasses = "bg-gray-100 text-gray-800";
  let icon = <Circle className="h-2 w-2 text-gray-500" />;

  switch (status) {
    case "FREE":
      colorClasses = "bg-green-100 text-green-800";
      icon = <Circle className="h-2 w-2 text-green-500 fill-current" />;
      break;
    case "BOOKED":
      colorClasses = "bg-blue-100 text-blue-800";
      icon = <Circle className="h-2 w-2 text-blue-500 fill-current" />;
      break;
    case "MAINTENANCE":
      colorClasses = "bg-yellow-100 text-yellow-800";
      icon = <Circle className="h-2 w-2 text-yellow-500 fill-current" />;
      break;
    case "DRAFT":
      colorClasses = "bg-gray-100 text-gray-600";
      break;
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full",
        colorClasses
      )}
    >
      {icon}
      {formatStatus(status)}
    </span>
  );
};

export default function HostDetail() {
  const router = useRouter();
  const params = useParams();
  const hostId = params.hostId as string;

  // --- State ---
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Option | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, statusFilter]);

  // --- API Hooks ---
  const {
    data: host,
    isLoading: isLoadingHost,
    isError: isHostError,
  } = useGetHostDetails(hostId);

  const {
    data: vehiclesData,
    isLoading: isLoadingVehicles,
    isPlaceholderData,
  } = useGetHostVehicles({
    hostId,
    page: currentPage,
    searchTerm: debouncedSearchTerm,
    status: statusFilter?.id || null,
  });

  const vehicles = vehiclesData?.content || [];
  const totalPages = vehiclesData?.totalPages || 0;

  // --- Handlers ---
  const handleBack = () => router.back();

  // --- Columns ---
  const columns: ColumnDefinition<HostVehicle>[] = [
    {
      header: "Vehicle",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-500">{item.vehicleIdentifier}</div>
        </div>
      ),
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
        let color = "bg-gray-100 text-gray-800";
        if (item.status === "APPROVED") color = "bg-green-100 text-green-800";
        if (item.status === "IN_REVIEW")
          color = "bg-yellow-100 text-yellow-800";
        if (item.status === "REJECTED") color = "bg-red-100 text-red-800";

        return (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${color}`}
          >
            {formatStatus(item.status)}
          </span>
        );
      },
    },
    {
      header: "Operational Status",
      accessorKey: "operationalStatus",
      cell: (item) => (
        <OperationalStatusBadge status={item.operationalStatus} />
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <ActionMenu
          actions={[
            {
              label: "View Vehicle",
              icon: Eye,
              onClick: () =>
                router.push(`/dashboard/vehicle-onboarding/${item.id}`),
            },
          ]}
        />
      ),
    },
  ];

  if (isLoadingHost) return <CustomLoader />;

  if (isHostError || !host) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-600">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>Failed to load host details.</p>
        <Button variant="secondary" onClick={handleBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-8xl mx-auto space-y-2">
      <div ref={topRef} />
      <Toaster position="top-right" />

      <CustomBack />

      {/* --- Host Profile Card --- */}
      <div className="bg-white border border-gray-400 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
              {host.profilePictureUrl ? (
                <img
                  src={host.profilePictureUrl}
                  alt={host.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-500">
                  {host.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>

            {/* Name & Badges */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {host.fullName}
                </h2>
                {host.active && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-gray-400" /> {host.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gray-400" /> {host.phoneNumber}
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex gap-6 border-l border-gray-200 pl-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Vehicles
                </p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {host.totalVehicles}
                  <Car className="h-4 w-4 text-blue-500" />
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {host.totalBookings}
                  <BadgeCheck className="h-4 w-4 text-green-500" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Referral Wallet
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatPrice(host.referralWalletBalance)}
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Booking Earnings
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatPrice(host.totalBookingEarnings)}
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Bank Details
              </span>
            </div>
            {host.hasBankDetails ? (
              <div className="mt-2 text-sm">
                <p className="font-semibold text-gray-900">{host.bankName}</p>
                <p className="text-gray-600">{host.accountNumber}</p>
                <p className="text-xs text-gray-400">{host.accountName}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-400 italic">
                No bank details added
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- Fleet Section --- */}
      <div className="space-y-2">
        {/* Filters */}
        <div className="bg-white py-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <TextInput
              id="vehicle-search"
              label="Search"
              hideLabel
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full !pl-10"
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              label="Status"
              hideLabel
              options={statusOptions}
              selected={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by Status"
            />
          </div>
        </div>

        {/* Table */}
        <div
          className={clsx(
            "bg-white overflow-hidden",
            isPlaceholderData && "opacity-60"
          )}
        >
          {isLoadingVehicles ? (
            <div className="p-12">
              <CustomLoader />
            </div>
          ) : vehicles.length > 0 ? (
            <CustomTable
              data={vehicles}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No vehicles found for this host.</p>
            </div>
          )}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </div>
    </main>
  );
}

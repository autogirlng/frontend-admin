"use client";

import React, { useState, useEffect } from "react";
import {
  useGetAdmins,
  useUpdateAdminStatus,
  useResendCredentials,
  useDownloadCredentials,
} from "@/lib/hooks/settings/useAdmins";
import {
  useGetDepartments,
  useUnassignDepartment,
} from "@/lib/hooks/admin/useDepartments";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { AdminUser } from "./types";

// Reusable Components
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { CreateAdminModal } from "./CreateAdminModal";
import { PromoteUserModal } from "./PromoteUserModal";
import { AdminDetailModal } from "./AdminDetailModal";
import { AssignDepartmentModal } from "./AssignDepartmentModal";

// Icons
import {
  AlertCircle,
  Search,
  CheckCircle,
  Trash2,
  Plus,
  Send,
  Download,
  ArrowUpCircle,
  View,
  Building,
  UserX,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [modal, setModal] = useState<
    | "create"
    | "promote"
    | "status"
    | "resend"
    | "view"
    | "assignDept"
    | "unassignDept"
    | null
  >(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ✅ 2. FIX: Reset pagination to 0 whenever search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm]);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading: isLoadingAdmins,
    isError,
    isPlaceholderData,
  } = useGetAdmins(currentPage, debouncedSearchTerm);

  const { isLoading: isLoadingDepts } = useGetDepartments();

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateAdminStatus();
  const { mutate: resendCredentials, isPending: isResending } =
    useResendCredentials();
  const { mutate: downloadCredentials, isPending: isDownloading } =
    useDownloadCredentials();
  const { mutate: unassignUser, isPending: isUnassigning } =
    useUnassignDepartment();

  const admins = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const isLoading = isLoadingAdmins || isLoadingDepts;

  // --- Modal Handlers ---
  const openModal = (
    type:
      | "create"
      | "promote"
      | "status"
      | "resend"
      | "view"
      | "assignDept"
      | "unassignDept",
    admin: AdminUser | null = null
  ) => {
    setSelectedAdmin(admin);
    setModal(type);
  };
  const closeModal = () => {
    setModal(null);
    setSelectedAdmin(null);
  };

  // --- Action Handlers ---
  const handleStatusConfirm = () => {
    if (!selectedAdmin) return;
    updateStatus(
      { userId: selectedAdmin.id, isActive: !selectedAdmin.active },
      { onSuccess: closeModal }
    );
  };

  const handleResendConfirm = () => {
    if (!selectedAdmin) return;
    resendCredentials(selectedAdmin.id, { onSuccess: closeModal });
  };

  const handleDownload = (admin: AdminUser) => {
    const adminName = `${admin.firstName}-${admin.lastName}`;
    downloadCredentials({ adminId: admin.id, adminName: adminName });
  };

  const handleUnassignConfirm = () => {
    if (!selectedAdmin) return;
    unassignUser({ userId: selectedAdmin.id }, { onSuccess: closeModal });
  };

  // --- Define Actions for the Menu ---
  const getAdminActions = (admin: AdminUser): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [
      {
        label: "View Details",
        icon: View,
        onClick: () => openModal("view", admin),
      },
      admin.departmentName
        ? {
            label: "Change Department",
            icon: Building,
            onClick: () => openModal("assignDept", admin),
          }
        : {
            label: "Assign Department",
            icon: Building,
            onClick: () => openModal("assignDept", admin),
          },
      ...(admin.departmentName
        ? [
            {
              label: "Leave Department",
              icon: UserX,
              onClick: () => openModal("unassignDept", admin),
              danger: true,
            },
          ]
        : []),
      {
        label: "Resend Credentials",
        icon: Send,
        onClick: () => openModal("resend", admin),
      },
      {
        label: "Save Credentials",
        icon: Download,
        onClick: () => handleDownload(admin),
      },
      admin.active
        ? {
            label: "Deactivate",
            icon: Trash2,
            onClick: () => openModal("status", admin),
            danger: true,
          }
        : {
            label: "Activate",
            icon: CheckCircle,
            onClick: () => openModal("status", admin),
          },
    ];
    return actions;
  };

  // --- Define Columns for the Table ---
  const columns: ColumnDefinition<AdminUser>[] = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (item) => `${item.firstName} ${item.lastName}`,
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
      header: "Department",
      accessorKey: "departmentName",
      cell: (item) =>
        item.departmentName || <span className="text-gray-400">N/A</span>,
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
      cell: (item) => <ActionMenu actions={getAdminActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all admin accounts and permissions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="w-auto"
              onClick={() => openModal("promote")}
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Promote User
            </Button>
            <Button
              variant="primary"
              className="w-auto"
              onClick={() => openModal("create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Admin
            </Button>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Admins"
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
            <span className="font-semibold">Failed to load staff.</span>
          </div>
        )}
        {!isLoading && !isError && admins.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No staff members found.</p>
          </div>
        )}

        {!isError && (admins.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData || isDownloading ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={admins}
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
      {modal === "create" && <CreateAdminModal onClose={closeModal} />}

      {modal === "promote" && <PromoteUserModal onClose={closeModal} />}

      {modal === "view" && selectedAdmin && (
        <AdminDetailModal adminId={selectedAdmin.id} onClose={closeModal} />
      )}

      {modal === "assignDept" && selectedAdmin && (
        <AssignDepartmentModal adminUser={selectedAdmin} onClose={closeModal} />
      )}

      {modal === "unassignDept" && selectedAdmin && (
        <ActionModal
          title="Unassign Admin"
          message={
            <>
              Are you sure you want to unassign{" "}
              <strong className="text-gray-900">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </strong>{" "}
              from the{" "}
              <strong className="text-gray-900">
                {selectedAdmin.departmentName}
              </strong>{" "}
              department?
            </>
          }
          actionLabel="Yes, Unassign"
          onClose={closeModal}
          onConfirm={handleUnassignConfirm}
          isLoading={isUnassigning}
          variant="danger"
        />
      )}

      {modal === "status" && selectedAdmin && (
        <ActionModal
          title={selectedAdmin.active ? "Deactivate Admin" : "Activate Admin"}
          message={
            <>
              Are you sure you want to{" "}
              {selectedAdmin.active ? "deactivate" : "activate"}{" "}
              <strong className="text-gray-900">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </strong>
              ?
            </>
          }
          actionLabel={selectedAdmin.active ? "Deactivate" : "Activate"}
          onClose={closeModal}
          onConfirm={handleStatusConfirm}
          isLoading={isUpdatingStatus}
          variant={selectedAdmin.active ? "danger" : "primary"}
        />
      )}

      {modal === "resend" && selectedAdmin && (
        <ActionModal
          title="Resend Credentials"
          message={
            <>
              This will reset the password for{" "}
              <strong className="text-gray-900">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </strong>{" "}
              and send new login details to their email. Are you sure?
            </>
          }
          actionLabel="Yes, Resend"
          onClose={closeModal}
          onConfirm={handleResendConfirm}
          isLoading={isResending}
          variant="primary"
        />
      )}
    </>
  );
}

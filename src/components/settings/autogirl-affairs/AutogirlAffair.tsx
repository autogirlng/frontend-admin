// app/dashboard/autogirl/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  useGetDepartments,
  useDeleteDepartment,
  useUnassignDepartment,
} from "@/lib/hooks/admin/useDepartments";
import { useGetAdmins } from "@/lib/hooks/admin/useAdmins"; // Adjust path
import { Department, AdminUser, PaginatedResponse } from "./types";
import { DepartmentModal } from "./DepartmentModal"; // Adjust path
import { AssignAdminModal } from "./AssignAdminModal"; // Adjust path
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import {
  AlertCircle,
  Building,
  Plus,
  Edit,
  Trash2,
  Users,
  UserX,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import CustomBack from "@/components/generic/CustomBack";

export default function AutoGirlPage() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [modal, setModal] = useState<
    | "createDept"
    | "editDept"
    | "deleteDept"
    | "assignAdmin"
    | "unassignAdmin"
    | null
  >(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // --- API Hooks ---
  const {
    data: departments = [],
    isLoading: isLoadingDepts,
    isError: isDeptsError,
  } = useGetDepartments();
  const { data: adminData, isLoading: isLoadingAdmins } = useGetAdmins(0, "");

  const admins = (adminData as PaginatedResponse<AdminUser>)?.content || [];

  const deleteDeptMutation = useDeleteDepartment();
  const unassignUserMutation = useUnassignDepartment();

  // --- Memos ---
  const departmentMap = useMemo(() => {
    return new Map(departments.map((d) => [d.id, d.name]));
  }, [departments]);

  // Filter admins based on selected department
  const adminsInSelectedDept = useMemo(() => {
    if (!selectedDept || !admins) return [];
    return admins.filter((a) => a.departmentName === selectedDept.name);
  }, [admins, selectedDept]);

  // --- Handlers ---
  const closeModal = () => {
    setModal(null);
    setSelectedAdmin(null);
    // Don't reset selectedDept, so the right pane stays active
  };

  const handleDeleteDept = () => {
    if (modal === "deleteDept" && selectedDept) {
      deleteDeptMutation.mutate(selectedDept.id, {
        onSuccess: () => {
          closeModal();
          setSelectedDept(null); // Clear selection as it's deleted
        },
      });
    }
  };

  const handleUnassignUser = () => {
    if (modal === "unassignAdmin" && selectedAdmin) {
      unassignUserMutation.mutate(
        { userId: selectedAdmin.id },
        {
          onSuccess: closeModal,
        }
      );
    }
  };

  // --- Render Functions ---
  const renderDepartmentList = () => {
    if (isLoadingDepts) {
      return (
        <div className="h-96">
          <CustomLoader />
        </div>
      );
    }
    if (isDeptsError) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load departments.</span>
        </div>
      );
    }
    // Filter for parent departments
    const parents = departments.filter((d) => !d.parentDepartmentId);
    return (
      <div className="space-y-1">
        {parents.map((parent) => {
          // Find children for this parent
          const children = departments.filter(
            (d) => d.parentDepartmentId === parent.id
          );
          return (
            <div key={parent.id}>
              <div
                className={clsx(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer",
                  selectedDept?.id === parent.id
                    ? "bg-[#0096FF] text-white"
                    : "hover:bg-gray-100"
                )}
                onClick={() => setSelectedDept(parent)}
              >
                <span className="font-semibold">{parent.name}</span>
                <ActionMenu
                  actions={[
                    {
                      label: "Edit",
                      icon: Edit,
                      onClick: () => setModal("editDept"),
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => setModal("deleteDept"),
                      danger: true,
                    },
                  ]}
                />
              </div>
              {/* Render Children (indented) */}
              <div className="ml-6 space-y-1 mt-1">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className={clsx(
                      "group flex items-center justify-between p-3 rounded-lg cursor-pointer",
                      selectedDept?.id === child.id
                        ? "bg-[#0096FF] text-white"
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => setSelectedDept(child)}
                  >
                    <span className="font-normal text-gray-700">
                      {child.name}
                    </span>
                    <ActionMenu
                      actions={[
                        {
                          label: "Edit",
                          icon: Edit,
                          onClick: () => setModal("editDept"),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          onClick: () => setModal("deleteDept"),
                          danger: true,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAdminList = () => {
    if (isLoadingAdmins) {
      return (
        <div className="h-96">
          <CustomLoader />
        </div>
      );
    }
    if (adminsInSelectedDept.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-gray-500 h-96">
          <Users className="h-16 w-16 text-gray-400 mb-4" />
          <p className="font-semibold">No Staff Assigned</p>
          <p className="text-sm">Assign staff members to this department.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {adminsInSelectedDept.map((admin) => (
          <div
            key={admin.id}
            className="p-3 bg-gray-50 rounded-lg border flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {admin.firstName} {admin.lastName}
              </p>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="w-auto"
              onClick={() => {
                setSelectedAdmin(admin);
                setModal("unassignAdmin");
              }}
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Affairs</h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage departments and staff assignments.
          </p>
        </div>

        {/* --- Two-Column Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Departments --- */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Departments
              </h2>
              <Button
                variant="primary"
                className="w-auto"
                onClick={() => setModal("createDept")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
              {renderDepartmentList()}
            </div>
          </div>

          {/* --- Right Column: Admins in Department --- */}
          <div className="lg:col-span-2">
            {selectedDept ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Staff in: {selectedDept.name}
                  </h2>
                  <Button
                    variant="primary"
                    className="w-auto"
                    onClick={() => setModal("assignAdmin")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Staff
                  </Button>
                </div>
                <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
                  {renderAdminList()}
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full items-center justify-center p-10 text-gray-500 bg-gray-50 border-2 border-dashed rounded-lg">
                <Building className="h-16 w-16 text-gray-400 mb-4" />
                <p className="font-semibold">Select a department</p>
                <p className="text-sm">
                  Choose a department from the left to view its staff.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Modals --- */}
      {(modal === "createDept" || modal === "editDept") && (
        <DepartmentModal
          onClose={closeModal}
          initialData={modal === "editDept" ? selectedDept : null}
          allDepartments={departments}
        />
      )}

      {modal === "deleteDept" && selectedDept && (
        <ActionModal
          title="Delete Department"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">{selectedDept.name}</strong>?
              This action cannot be undone.
            </>
          }
          actionLabel="Delete"
          onClose={closeModal}
          onConfirm={handleDeleteDept}
          isLoading={deleteDeptMutation.isPending}
          variant="danger"
        />
      )}

      {modal === "assignAdmin" && selectedDept && (
        <AssignAdminModal department={selectedDept} onClose={closeModal} />
      )}

      {modal === "unassignAdmin" && selectedAdmin && (
        <ActionModal
          title="Unassign Admin"
          message={
            <>
              Are you sure you want to remove{" "}
              <strong className="text-gray-900">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </strong>{" "}
              from this department?
            </>
          }
          actionLabel="Yes, Unassign"
          onClose={closeModal}
          onConfirm={handleUnassignUser}
          isLoading={unassignUserMutation.isPending}
          variant="danger"
        />
      )}
    </>
  );
}

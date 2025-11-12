// app/dashboard/settings/roles/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useGetRoles, useDeleteRole } from "./useRoles";
import { AdminUser, Role } from "./types";
import { RoleModal } from "./RoleModal";
import { PermissionManager } from "./PermissionManager";
import { UserRoleManager } from "./UserRoleManager";
import { AssignRolesModal } from "./AssignRolesModal";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import {
  AlertCircle,
  Building,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

type ActiveTab = "permissions" | "users";

export default function Roles() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("permissions");
  const [modal, setModal] = useState<
    "createRole" | "editRole" | "deleteRole" | "assignUserRoles" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // --- API Hooks ---
  const {
    data: roles = [],
    isLoading: isLoadingRoles,
    isError: isRolesError,
  } = useGetRoles();
  const deleteRoleMutation = useDeleteRole();

  // --- Handlers ---
  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    if (modal !== "editRole") {
      // Don't deselect role when just editing it
    }
  };

  const handleDeleteRole = () => {
    if (modal === "deleteRole" && selectedRole) {
      deleteRoleMutation.mutate(selectedRole.id, {
        onSuccess: () => {
          closeModal();
          setSelectedRole(null); // Clear selection
        },
      });
    }
  };

  const handleOpenAssignUserRoles = (user: AdminUser) => {
    setSelectedUser(user);
    setModal("assignUserRoles");
  };

  // --- Render Functions ---
  const renderRoleList = () => {
    if (isLoadingRoles) {
      return (
        <div className="h-96">
          <CustomLoader />
        </div>
      );
    }
    if (isRolesError) {
      return (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load roles.</span>
        </div>
      );
    }
    if (roles.length === 0) {
      return <p className="text-gray-500 p-4">No roles created yet.</p>;
    }

    return (
      <div className="space-y-1">
        {roles.map((role) => (
          <div
            key={role.id}
            className={clsx(
              "group flex items-center justify-between p-3 rounded-lg cursor-pointer",
              selectedRole?.id === role.id
                ? "bg-[#0096FF] text-white"
                : "hover:bg-gray-100"
            )}
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate">{role.name}</p>
              <p
                className={clsx(
                  "text-sm truncate",
                  selectedRole?.id === role.id
                    ? "text-blue-100"
                    : "text-gray-500"
                )}
              >
                {role.description}
              </p>
            </div>
            <ActionMenu
              actions={[
                {
                  label: "Edit Role",
                  icon: Edit,
                  onClick: () => {
                    setSelectedRole(role);
                    setModal("editRole");
                  },
                },
                {
                  label: "Delete Role",
                  icon: Trash2,
                  onClick: () => {
                    setSelectedRole(role);
                    setModal("deleteRole");
                  },
                  danger: true,
                },
              ]}
            />
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
          <h1 className="text-3xl font-bold text-gray-900">
            Roles & Permissions
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage user roles and what they can access.
          </p>
        </div>

        {/* --- Three-Column Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Left Column: Roles --- */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
              <Button
                variant="primary"
                className="w-auto"
                onClick={() => setModal("createRole")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Role
              </Button>
            </div>
            <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-lg h-[600px] overflow-y-auto">
              {renderRoleList()}
            </div>
          </div>

          {/* --- Right Columns: Manager --- */}
          <div className="lg:col-span-2">
            {!selectedRole ? (
              <div className="flex flex-col h-[600px] items-center justify-center p-10 text-gray-500 bg-gray-50 border-2 border-dashed rounded-lg">
                <Shield className="h-16 w-16 text-gray-400 mb-4" />
                <p className="font-semibold">Select a Role</p>
                <p className="text-sm text-center">
                  Choose a role from the left to manage its permissions and
                  users.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
                {/* --- Tabs --- */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("permissions")}
                      className={clsx(
                        "flex items-center gap-2 w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm",
                        activeTab === "permissions"
                          ? "border-[#0096FF] text-[#0096FF]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      )}
                    >
                      <Shield className="h-4 w-4" />
                      Manage Permissions
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className={clsx(
                        "flex items-center gap-2 w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm",
                        activeTab === "users"
                          ? "border-[#0096FF] text-[#0096FF]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      User Assignments
                    </button>
                  </nav>
                </div>

                {/* --- Tab Content --- */}
                <div className="p-6">
                  {activeTab === "permissions" && (
                    <PermissionManager selectedRole={selectedRole} />
                  )}
                  {activeTab === "users" && (
                    <UserRoleManager
                      onAssignClick={handleOpenAssignUserRoles}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Modals --- */}
      {(modal === "createRole" || modal === "editRole") && (
        <RoleModal
          onClose={closeModal}
          initialData={modal === "editRole" ? selectedRole : null}
        />
      )}

      {modal === "deleteRole" && selectedRole && (
        <ActionModal
          title="Delete Role"
          message={
            <>
              Are you sure you want to delete the role{" "}
              <strong className="text-gray-900">{selectedRole.name}</strong>?
              This will unassign it from all users.
            </>
          }
          actionLabel="Delete Role"
          onClose={closeModal}
          onConfirm={handleDeleteRole}
          isLoading={deleteRoleMutation.isPending}
          variant="danger"
        />
      )}

      {modal === "assignUserRoles" && selectedUser && (
        <AssignRolesModal adminUser={selectedUser} onClose={closeModal} />
      )}
    </>
  );
}

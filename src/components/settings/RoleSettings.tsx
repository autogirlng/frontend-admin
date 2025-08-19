import React, { useState, useMemo } from "react";
import {
  useRolePermissions,
  useUpdateRolePermissions,
  RolePermission,
} from "./hook/use_role_settings";
import AppSwitch from "../shared/switch";
import { FullPageSpinner } from "../shared/spinner";
import EmptyState from "../EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";

const RolePermissionsManager = () => {
  const { data: roles, isLoading, isError, error } = useRolePermissions();
  const { mutate: updatePermissions, isPending: isUpdating } =
    useUpdateRolePermissions();

  const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);

  // Define all possible permissions using useMemo to prevent re-creation on every render
  const allPossiblePermissions = useMemo(
    () => [
      "CREATE_USER",
      "READ_USER",
      "UPDATE_USER",
      "DELETE_USER",
      "CREATE_VEHICLE",
      "READ_VEHICLE",
      "UPDATE_VEHICLE",
      "DELETE_VEHICLE",
      "APPROVE_VEHICLE",
      "MANAGE_VEHICLES",
      "CREATE_BOOKING",
      "READ_BOOKING",
      "UPDATE_BOOKING",
      "DELETE_BOOKING",
      "VIEW_TRANSACTIONS",
      "MANAGE_TRANSACTIONS",
      "MANAGE_REFUNDS",
      "VIEW_FINANCIAL_REPORTS",
      "HANDLE_SUPPORT_TICKETS",
      "MANAGE_CUSTOMER_ISSUES",
      "MANAGE_SYSTEM_SETTINGS",
      "VIEW_ANALYTICS",
      "MANAGE_ROLES",
    ],
    []
  );

  // --- Loading and Error States ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
        <FullPageSpinner className="h-[300px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        image={ImageAssets.icons.errorState}
        message={error?.message || "Failed to load role permissions."} // Added a fallback message
        title="Error Loading Roles" // Added a more descriptive title
      />
    );
  }

  // --- Permission Toggle Logic ---
  const handlePermissionToggle = (permission: string, isChecked: boolean) => {
    if (!selectedRole) return;

    const updatedPermissions = isChecked
      ? [...new Set([...selectedRole.permissions, permission])] // Add permission if checked
      : selectedRole.permissions.filter((p) => p !== permission); // Remove permission if unchecked

    // Optimistically update the UI
    setSelectedRole((prev) =>
      prev ? { ...prev, permissions: updatedPermissions } : null
    );

    // Call API to update permissions
    updatePermissions({
      role: selectedRole.role,
      permissions: updatedPermissions,
    });
  };

  // --- Helper to Format Permission Names ---
  const formatPermissionName = (permission: string) => {
    return permission
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-80px)]">
      {" "}
      {/* Added height constraints */}
      {/* Left Sidebar for Role Selection */}
      <div className="w-full lg:w-1/4  rounded-lg shadow-md flex flex-col">
        {" "}
        {/* Added flex-col */}
        <h2 className="text-2xl font-bold text-grey-800 mb-6 border-b border-grey-200 p-3">
          Default Roles
        </h2>
        {/* Role List with Scrollability */}
        <ul className="space-y-3 overflow-y-auto flex-grow  custom-scrollbar">
          {" "}
          {/* Added overflow, flex-grow, and padding for scrollbar */}
          {roles?.map((roleEntry) => (
            <li key={roleEntry.id}>
              <button
                className={`w-full text-left  px-4 rounded-md transition-colors duration-200 ${
                  selectedRole?.id === roleEntry.id
                    ? "bg-primary-100 text-primary-700 py-7 font-semibold shadow-sm"
                    : "hover:bg-grey-100 text-grey-700 py-3"
                }`}
                onClick={() => setSelectedRole(roleEntry)}
              >
                {formatPermissionName(roleEntry.role)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Main Content Area for Role Details and Permissions */}
      <div className="w-full lg:w-3/4 p-6 overflow-y-auto custom-scrollbar">
        {" "}
        {/* Added overflow for content */}
        {/* Dynamic Role Title */}
        <h1 className="text-3xl font-bold text-grey-900 mb-2">
          {selectedRole
            ? formatPermissionName(selectedRole.role)
            : "Select a Role"}
        </h1>
        <p className="text-grey-600 mb-8">
          {selectedRole
            ? `Manage the specific permissions for the ${formatPermissionName(
                selectedRole.role
              )} role.`
            : "Select a role from the left sidebar to view and manage its associated permissions."}
        </p>
        {!selectedRole ? (
          <div className="flex items-center justify-center h-64 text-grey-500 text-lg border border-dashed border-grey-300 rounded-lg">
            Select a role to view and manage its permissions.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* "What This Role Can Access" Section */}
            <div className="rounded-lg shadow-md border border-grey-200">
              {" "}
              {/* Added border */}
              <h3 className="text-xl text-grey-700 font-semibold bg-success-100 p-5 rounded-t-lg mb-4">
                What This Role Can Access
              </h3>
              <div className="space-y-4 p-6">
                {selectedRole.permissions.length > 0 ? ( // Check if there are any permissions
                  allPossiblePermissions
                    .filter((p) => selectedRole.permissions.includes(p))
                    .map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center justify-between py-2 border-b-[1px] border-grey-100 last:border-b-0"
                      >
                        <label
                          htmlFor={`${selectedRole.id}-${permission}-access`}
                          className="text-grey-800 text-base flex-grow cursor-pointer"
                        >
                          Can {formatPermissionName(permission)}
                        </label>
                        <AppSwitch
                          id={`${selectedRole.id}-${permission}-access`}
                          name={`${selectedRole.id}-${permission}-access`}
                          value={true} // Always true as it's in "Can Access"
                          onChange={(checked) =>
                            handlePermissionToggle(permission, checked)
                          }
                          disabled={isUpdating}
                        />
                      </div>
                    ))
                ) : (
                  <p className="text-grey-500 italic">
                    This role currently has no specific access permissions.
                  </p>
                )}
              </div>
            </div>

            {/* "What This Role Can't Access" Section */}
            <div className="rounded-lg shadow-md border border-grey-200">
              {" "}
              {/* Added border */}
              <h3 className="text-xl text-grey-700 font-semibold bg-error-100 p-5 rounded-t-lg mb-4">
                What This Role Can't Access
              </h3>
              <p className="text-gray-600 text-sm px-6 mb-4">
                (Toggling a switch here will **add** the permission to this
                role.)
              </p>
              <div className="space-y-4 p-6">
                {" "}
                {/* Added padding */}
                {allPossiblePermissions.filter(
                  (p) => !selectedRole.permissions.includes(p)
                ).length > 0 ? (
                  allPossiblePermissions
                    .filter((p) => !selectedRole.permissions.includes(p))
                    .map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center justify-between py-2 border-b-[1px] border-grey-200 last:border-b-0"
                      >
                        <label
                          htmlFor={`${selectedRole.id}-${permission}-no-access`}
                          className="text-grey-800 text-base flex-grow cursor-pointer"
                        >
                          Can {formatPermissionName(permission)}
                        </label>
                        <AppSwitch
                          id={`${selectedRole.id}-${permission}-no-access`}
                          name={`${selectedRole.id}-${permission}-no-access`}
                          value={false} // Always false as it's in "Can't Access"
                          onChange={(checked) =>
                            handlePermissionToggle(permission, checked)
                          }
                          disabled={isUpdating}
                        />
                      </div>
                    ))
                ) : (
                  <p className="text-grey-500 italic">
                    This role currently has all possible permissions.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePermissionsManager;

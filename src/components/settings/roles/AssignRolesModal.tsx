// app/dashboard/settings/roles/AssignRolesModal.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetRoles,
  useAssignRolesToUser,
  useRemoveRolesFromUser,
} from "./useRoles";
import { useGetAdminDetails } from "@/lib/hooks/settings/useAdmins";
import { AdminUser, Role } from "./types";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";
import CheckboxCard from "@/components/generic/ui/CheckboxCard"; // Uses your component

interface AssignRolesModalProps {
  onClose: () => void;
  adminUser: AdminUser;
}

export function AssignRolesModal({
  onClose,
  adminUser,
}: AssignRolesModalProps) {
  // State to hold the IDs of checked roles
  const [selectedRoleIds, setSelectedRoleIds] = useState(new Set<string>());

  // Fetch all available roles
  const { data: allRoles = [], isLoading: isLoadingRoles } = useGetRoles();
  // Fetch the user's details to get their *current* roles
  const { data: userDetail, isLoading: isLoadingUser } = useGetAdminDetails(
    adminUser.id
  );

  const assignMutation = useAssignRolesToUser();
  const removeMutation = useRemoveRolesFromUser();

  const isLoading = isLoadingRoles || isLoadingUser;
  const isMutating = assignMutation.isPending || removeMutation.isPending;

  // Memoize the user's original roles
  const originalRoleIds = useMemo(() => {
    return new Set(userDetail?.roles?.map((r) => r.id) || []);
  }, [userDetail]);

  // When user data loads, populate the selection state
  useEffect(() => {
    if (userDetail?.roles) {
      setSelectedRoleIds(new Set(userDetail.roles.map((r) => r.id)));
    }
  }, [userDetail]);

  const handleToggleRole = (roleId: string, isChecked: boolean) => {
    setSelectedRoleIds((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(roleId);
      } else {
        newSet.delete(roleId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // Calculate the difference
    const rolesToAssign = [...selectedRoleIds].filter(
      (id) => !originalRoleIds.has(id)
    );
    const rolesToRemove = [...originalRoleIds].filter(
      (id) => !selectedRoleIds.has(id)
    );

    // Create an array of promises
    const promises = [];

    if (rolesToAssign.length > 0) {
      promises.push(
        assignMutation.mutateAsync({
          userId: adminUser.id,
          roleIds: rolesToAssign,
        })
      );
    }
    if (rolesToRemove.length > 0) {
      promises.push(
        removeMutation.mutateAsync({
          userId: adminUser.id,
          roleIds: rolesToRemove,
        })
      );
    }

    if (promises.length === 0) {
      toast("No changes made.");
      onClose();
      return;
    }

    // Run all mutations
    Promise.all(promises)
      .then(() => {
        toast.success("User roles updated successfully.");
        onClose();
      })
      .catch((e) => {
        // Errors are already toasted by the hooks
        console.error("Failed to update one or more role assignments", e);
      });
  };

  return (
    <ActionModal
      title={`Manage Roles for ${adminUser.firstName}`}
      message="Select the roles this user should have."
      actionLabel="Save Changes"
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={isMutating}
      variant="primary"
    >
      <div className="space-y-3 mt-4 max-h-80 overflow-y-auto pr-2">
        {isLoading && <CustomLoader />}
        {!isLoading &&
          allRoles.map((role: Role) => (
            <CheckboxCard
              key={role.id}
              id={role.id}
              label={role.name}
              checked={selectedRoleIds.has(role.id)}
              onChange={(isChecked) => handleToggleRole(role.id, isChecked)}
            />
          ))}
      </div>
    </ActionModal>
  );
}

// app/dashboard/settings/roles/RoleModal.tsx
"use client";

import React, { useState } from "react";
import { useCreateRole, useUpdateRole } from "./useRoles"; // Adjust path
import { Role, RolePayload } from "./types";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";

interface RoleModalProps {
  onClose: () => void;
  /** Pass the role to edit, or null to create */
  initialData: Role | null;
}

export function RoleModal({ onClose, initialData }: RoleModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();

  const isEditMode = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    const payload: RolePayload = { name, description };

    if (isEditMode) {
      updateMutation.mutate(
        { id: initialData!.id, payload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <ActionModal
      title={isEditMode ? "Edit Role" : "Create New Role"}
      message="Roles define a set of permissions that can be assigned to users."
      actionLabel={isEditMode ? "Save Changes" : "Create Role"}
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={isLoading}
      variant="primary"
    >
      <div className="space-y-4 mt-4">
        <TextInput
          id="name"
          label="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
        <TextAreaInput
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          rows={3}
        />
      </div>
    </ActionModal>
  );
}

// app/dashboard/autogirl/DepartmentModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/lib/hooks/admin/useDepartments";
import { Department, DepartmentPayload } from "./types";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";

interface DepartmentModalProps {
  onClose: () => void;
  /** Pass the department to edit, or null to create */
  initialData: Department | null;
  /** Full list of departments to select a parent */
  allDepartments: Department[];
}

export function DepartmentModal({
  onClose,
  initialData,
  allDepartments,
}: DepartmentModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [parent, setParent] = useState<Option | null>(
    initialData?.parentDepartmentId
      ? {
          id: initialData.parentDepartmentId,
          name:
            allDepartments.find((d) => d.id === initialData.parentDepartmentId)
              ?.name || "",
        }
      : null
  );

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const isEditMode = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const departmentOptions: Option[] = useMemo(
    () =>
      allDepartments
        .filter((d) => d.id !== initialData?.id) // Can't be its own parent
        .map((d) => ({ id: d.id, name: d.name })),
    [allDepartments, initialData]
  );

  const handleSubmit = () => {
    const payload: DepartmentPayload = {
      name,
      parentDepartmentId: parent?.id || undefined,
    };

    if (isEditMode) {
      updateMutation.mutate(
        { id: initialData.id, payload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <ActionModal
      title={isEditMode ? "Edit Department" : "Create Department"}
      message="Fill in the details for the department."
      actionLabel={isEditMode ? "Save Changes" : "Create"}
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={isLoading}
      variant="primary"
    >
      <div className="space-y-4 mt-4">
        <TextInput
          id="name"
          label="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
        <Select
          label="Parent Department (Optional)"
          options={departmentOptions}
          selected={parent}
          onChange={setParent}
          placeholder="Select a parent..."
          disabled={isLoading}
        />
      </div>
    </ActionModal>
  );
}

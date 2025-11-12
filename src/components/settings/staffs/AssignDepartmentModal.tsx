// app/dashboard/settings/staffs/AssignDepartmentModal.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  useGetDepartments,
  useAssignDepartment,
} from "@/lib/hooks/admin/useDepartments";
import { Department } from "./types";
import { AdminUser } from "./types";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select, { Option } from "@/components/generic/ui/Select";
import CustomLoader from "@/components/generic/CustomLoader";

interface AssignDepartmentModalProps {
  onClose: () => void;
  adminUser: AdminUser;
}

export function AssignDepartmentModal({
  onClose,
  adminUser,
}: AssignDepartmentModalProps) {
  const [selectedDept, setSelectedDept] = useState<Option | null>(null);

  const { data: departments = [], isLoading: isLoadingDepts } =
    useGetDepartments();

  const assignMutation = useAssignDepartment();

  // Memoize options
  const departmentOptions: Option[] = useMemo(
    () => departments.map((d) => ({ id: d.id, name: d.name })),
    [departments]
  );

  // Pre-select current department if it exists
  useEffect(() => {
    if (adminUser.departmentName && departments.length > 0) {
      const currentDept = departments.find(
        (d) => d.name === adminUser.departmentName
      );
      if (currentDept) {
        setSelectedDept({ id: currentDept.id, name: currentDept.name });
      }
    }
  }, [adminUser, departments]);

  const handleSubmit = () => {
    if (!selectedDept) {
      toast.error("Please select a department.");
      return;
    }
    assignMutation.mutate(
      { userId: adminUser.id, departmentId: selectedDept.id },
      { onSuccess: onClose }
    );
  };

  return (
    <ActionModal
      title={`Assign Department to ${adminUser.firstName}`}
      message="Select a department to assign this staff member to."
      actionLabel="Assign"
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={assignMutation.isPending || isLoadingDepts}
      variant="primary"
    >
      <div className="space-y-4 mt-4">
        {isLoadingDepts ? (
          <CustomLoader />
        ) : (
          <Select
            label="Department"
            options={departmentOptions}
            selected={selectedDept}
            onChange={setSelectedDept}
            placeholder="Select a department..."
          />
        )}
      </div>
    </ActionModal>
  );
}

// app/dashboard/settings/roles/PermissionManager.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGetPermissions, useAssignPermissionsToRole } from "./useRoles"; // Adjust path
import { Role, Permission } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Info,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import clsx from "clsx";

// --- Internal ListBox Component ---
const PermissionListBox = ({
  title,
  permissions,
  selected,
  onSelect,
}: {
  title: string;
  permissions: Permission[];
  selected: Set<string>;
  onSelect: (name: string) => void;
}) => (
  <div className="flex-1 flex flex-col h-full">
    <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
    <div className="border border-gray-300 rounded-lg bg-white h-full overflow-y-auto">
      {permissions.length === 0 && (
        <p className="p-4 text-sm text-gray-500">No permissions.</p>
      )}
      <ul className="divide-y divide-gray-200">
        {permissions.map((perm) => (
          <li
            key={perm.name}
            onClick={() => onSelect(perm.name)}
            className={clsx(
              "p-3 cursor-pointer group",
              selected.has(perm.name)
                ? "bg-blue-100 ring-1 ring-inset ring-blue-400"
                : "hover:bg-gray-50"
            )}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm text-gray-900">{perm.name}</p>
              <Info className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <p className="text-xs text-gray-500">{perm.description}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- Main Manager Component ---
interface PermissionManagerProps {
  selectedRole: Role;
}

export function PermissionManager({ selectedRole }: PermissionManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // API Hooks
  const { data: allPermissions = [], isLoading: isLoadingPermissions } =
    useGetPermissions(debouncedSearchTerm);
  const assignMutation = useAssignPermissionsToRole();

  // State
  const [assigned, setAssigned] = useState(
    new Set(selectedRole.permissionNames)
  );
  const [selAvailable, setSelAvailable] = useState(new Set<string>());
  const [selAssigned, setSelAssigned] = useState(new Set<string>());

  // Sync state when selectedRole changes
  useEffect(() => {
    setAssigned(new Set(selectedRole.permissionNames));
    setSelAvailable(new Set());
    setSelAssigned(new Set());
  }, [selectedRole]);

  // Derived Lists
  const { availablePermissions, assignedPermissions } = useMemo(() => {
    const assignedSet = new Set(assigned);
    const assignedList: Permission[] = [];
    const availableList: Permission[] = [];

    allPermissions.forEach((perm) => {
      if (assignedSet.has(perm.name)) {
        assignedList.push(perm);
      } else {
        availableList.push(perm);
      }
    });
    return {
      availablePermissions: availableList,
      assignedPermissions: assignedList,
    };
  }, [allPermissions, assigned]);

  // --- Selection Handlers ---
  const toggleSelection = (list: "available" | "assigned", name: string) => {
    const [selected, setSelected] =
      list === "available"
        ? [selAvailable, setSelAvailable]
        : [selAssigned, setSelAssigned];

    const newSet = new Set(selected);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setSelected(newSet);
  };

  // --- Move Handlers ---
  const moveSelected = (direction: "toAssigned" | "toAvailable") => {
    if (direction === "toAssigned") {
      setAssigned(new Set([...assigned, ...selAvailable]));
      setSelAvailable(new Set());
    } else {
      const newAssigned = new Set(assigned);
      selAssigned.forEach((name) => newAssigned.delete(name));
      setAssigned(newAssigned);
      setSelAssigned(new Set());
    }
  };

  const moveAll = (direction: "toAssigned" | "toAvailable") => {
    if (direction === "toAssigned") {
      setAssigned(new Set(allPermissions.map((p) => p.name)));
    } else {
      setAssigned(new Set());
    }
    setSelAvailable(new Set());
    setSelAssigned(new Set());
  };

  const handleSave = () => {
    assignMutation.mutate({
      roleId: selectedRole.id,
      permissionNames: Array.from(assigned),
    });
  };

  const hasChanges =
    JSON.stringify(Array.from(assigned).sort()) !==
    JSON.stringify(selectedRole.permissionNames.sort());

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <TextInput
          id="permission-search"
          hideLabel
          label="Search Permissions"
          placeholder="Search all permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          style={{ paddingLeft: 35 }}
        />
      </div>

      {/* Dual List Box */}
      <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 h-[500px]">
        {/* Available */}
        {isLoadingPermissions ? (
          <CustomLoader />
        ) : (
          <PermissionListBox
            title="Available Permissions"
            permissions={availablePermissions}
            selected={selAvailable}
            onSelect={(name) => toggleSelection("available", name)}
          />
        )}

        {/* Controls */}
        <div className="flex flex-col items-center justify-center gap-2">
          <Button
            variant="secondary"
            className="w-10 h-10 p-0"
            onClick={() => moveAll("toAssigned")}
            title="Assign All"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="w-10 h-10 p-0"
            onClick={() => moveSelected("toAssigned")}
            title="Assign Selected"
            disabled={selAvailable.size === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="w-10 h-10 p-0"
            onClick={() => moveSelected("toAvailable")}
            title="Remove Selected"
            disabled={selAssigned.size === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="w-10 h-10 p-0"
            onClick={() => moveAll("toAvailable")}
            title="Remove All"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Assigned */}
        <PermissionListBox
          title="Assigned Permissions"
          permissions={assignedPermissions}
          selected={selAssigned}
          onSelect={(name) => toggleSelection("assigned", name)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          variant="primary"
          className="w-auto"
          onClick={handleSave}
          isLoading={assignMutation.isPending}
          disabled={!hasChanges}
        >
          Save Permission Changes
        </Button>
      </div>
    </div>
  );
}

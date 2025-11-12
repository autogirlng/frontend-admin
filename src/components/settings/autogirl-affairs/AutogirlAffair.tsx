// app/dashboard/autogirl/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  useGetDepartments,
  useDeleteDepartment,
} from "@/lib/hooks/admin/useDepartments";
import { Department } from "./types";
import { DepartmentModal } from "./DepartmentModal";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionMenu } from "@/components/generic/ui/ActionMenu";
import {
  AlertCircle,
  Building,
  Plus,
  Edit,
  Trash2,
  ChevronRight, // --- NEW ---
  ChevronDown, // --- NEW ---
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import CustomBack from "@/components/generic/CustomBack";

// --- NEW ---
// Define a new type for the tree structure
type DepartmentNode = Department & {
  children: DepartmentNode[];
};

// --- NEW ---
// A reusable item for the recursive list
const DepartmentItem: React.FC<{
  node: DepartmentNode;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  level: number;
}> = ({ node, onEdit, onDelete, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="flex flex-col">
      {/* This Row */}
      <div
        className="group flex items-center justify-between rounded-md hover:bg-gray-50"
        style={{ paddingLeft: `${level * 16}px` }} // Indentation
      >
        <div className="flex items-center flex-1 p-3">
          {/* Toggle Button */}
          {hasChildren ? (
            <button onClick={() => setIsOpen(!isOpen)} className="mr-2 p-1">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            // Spacer to keep alignment
            <div className="w-7 mr-2"></div>
          )}
          {/* Name */}
          <span
            className={
              level === 0 ? "font-semibold text-gray-800" : "text-gray-700"
            }
          >
            {node.name}
          </span>
        </div>

        {/* Actions */}
        <div className="pr-3">
          <ActionMenu
            actions={[
              {
                label: "Edit",
                icon: Edit,
                onClick: () => onEdit(node),
              },
              {
                label: "Delete",
                icon: Trash2,
                onClick: () => onDelete(node),
                danger: true,
              },
            ]}
          />
        </div>
      </div>

      {/* Children (Rendered recursively) */}
      {isOpen && hasChildren && (
        <div className="border-l border-gray-200 ml-6 pl-2">
          {" "}
          {/* Connecting line */}
          {node.children.map((child) => (
            <DepartmentItem
              key={child.id}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- NEW ---
// The main list component that builds and renders the tree
const DepartmentList: React.FC<{
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}> = ({ departments, onEdit, onDelete }) => {
  // Efficiently build a tree structure in O(N) time
  const departmentTree = useMemo(() => {
    const map = new Map<string, DepartmentNode>();
    const tree: DepartmentNode[] = [];

    // 1. Initialize map with all nodes
    const allNodes: DepartmentNode[] = departments.map((d) => ({
      ...d,
      children: [],
    }));
    allNodes.forEach((node) => {
      map.set(node.id, node);
    });

    // 2. Link children to parents
    allNodes.forEach((node) => {
      if (node.parentDepartmentId && map.has(node.parentDepartmentId)) {
        const parent = map.get(node.parentDepartmentId)!;
        parent.children.push(node);
      } else {
        // Root node (no parent)
        tree.push(node);
      }
    });

    return tree;
  }, [departments]);

  return (
    <div className="space-y-1">
      {departmentTree.map((node) => (
        <DepartmentItem
          key={node.id}
          node={node}
          onEdit={onEdit}
          onDelete={onDelete}
          level={0}
        />
      ))}
    </div>
  );
};

// --- UPDATED --- Renamed component
export default function DepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [modal, setModal] = useState<
    "createDept" | "editDept" | "deleteDept" | null
  >(null);

  // --- API Hooks ---
  const {
    data: departments = [],
    isLoading: isLoadingDepts,
    isError: isDeptsError,
  } = useGetDepartments();
  const deleteDeptMutation = useDeleteDepartment();

  // --- Handlers ---
  const openModal = (
    type: "createDept" | "editDept" | "deleteDept",
    dept: Department | null = null
  ) => {
    setSelectedDept(dept);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDept(null);
  };

  const handleDeleteDept = () => {
    if (modal === "deleteDept" && selectedDept) {
      deleteDeptMutation.mutate(selectedDept.id, {
        onSuccess: closeModal,
      });
    }
  };

  // --- UPDATED --- Clean render function for content
  const renderContent = () => {
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
    if (departments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-500">
          <Building className="h-16 w-16 text-gray-400 mb-4" />
          <p className="font-semibold">No Departments Created</p>
          <p className="text-sm">
            Click "Create New" to add your first department.
          </p>
        </div>
      );
    }

    // Pass handlers to the new list component
    return (
      <DepartmentList
        departments={departments}
        onEdit={(dept) => openModal("editDept", dept)}
        onDelete={(dept) => openModal("deleteDept", dept)}
      />
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Departments {/* --- UPDATED --- */}
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage and organize company departments. {/* --- UPDATED --- */}
            </p>
          </div>
        </div>

        {/* --- Departments Section --- */}
        <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              All Departments
            </h2>
            <Button
              variant="primary"
              className="w-auto"
              onClick={() => openModal("createDept")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
            {renderContent()} {/* --- UPDATED --- Cleaner render call */}
          </div>
        </div>
      </main>

      {/* --- Modals (Unchanged) --- */}
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
    </>
  );
}

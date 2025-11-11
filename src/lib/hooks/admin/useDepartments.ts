// lib/hooks/admin/useDepartments.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import { ADMINS_QUERY_KEY } from "./useAdmins"; // Import key from admin hooks
import {
  Department,
  DepartmentPayload,
} from "@/components/settings/autogirl-affairs/types";

// --- Query Key ---
export const DEPARTMENTS_QUERY_KEY = "departments";

// --- 1. GET All Departments ---
export function useGetDepartments() {
  return useQuery<Department[], Error>({
    queryKey: [DEPARTMENTS_QUERY_KEY],
    queryFn: () => apiClient.get<Department[]>("/admin/departments"),
  });
}

// --- 2. POST Create Department ---
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation<Department, Error, DepartmentPayload>({
    mutationFn: (payload) => apiClient.post("/admin/departments", payload),
    onSuccess: () => {
      toast.success("Department created.");
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create department."),
  });
}

// --- 3. PUT Update Department ---
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation<
    Department,
    Error,
    { id: string; payload: DepartmentPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/departments/${id}`, payload),
    onSuccess: () => {
      toast.success("Department updated.");
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update department."),
  });
}

// --- 4. DELETE Department ---
export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id: string) => apiClient.delete(`/admin/departments/${id}`),
    onSuccess: () => {
      toast.success("Department deleted.");
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete department."),
  });
}

// --- 5. PATCH Assign User to Department ---
export function useAssignDepartment() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { userId: string; departmentId: string }>({
    mutationFn: ({ userId, departmentId }) =>
      apiClient.patch(`/admin/users/${userId}/assign-department`, {
        departmentId,
      }),
    onSuccess: () => {
      toast.success("User assigned to department.");
      // Refetch both admins and departments (as admins list shows dept)
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) => toast.error(error.message || "Failed to assign user."),
  });
}

// --- 6. DELETE Unassign User from Department ---
export function useUnassignDepartment() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { userId: string }>({
    mutationFn: ({ userId }) =>
      apiClient.delete(`/admin/users/${userId}/assign-department`),
    onSuccess: () => {
      toast.success("User unassigned from department.");
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to unassign user."),
  });
}

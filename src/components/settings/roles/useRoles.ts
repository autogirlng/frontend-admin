// lib/hooks/admin/useRoles.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import { Role, RolePayload, Permission } from "./types"; // Adjust path
import {
  ADMINS_QUERY_KEY,
  ADMIN_DETAIL_KEY,
} from "@/lib/hooks/settings/useAdmins";

// --- Query Keys ---
export const ROLES_QUERY_KEY = "roles";
export const PERMISSIONS_QUERY_KEY = "permissions";

// --- 1. Roles CRUD ---
export function useGetRoles() {
  return useQuery<Role[], Error>({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: () => apiClient.get<Role[]>("/admin/roles"),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, RolePayload>({
    mutationFn: (payload) => apiClient.post("/admin/roles", payload),
    onSuccess: (newRole) => {
      toast.success(`Role "${newRole.name}" created.`);
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message || "Failed to create role."),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: string; payload: RolePayload }>({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/roles/${id}`, payload),
    onSuccess: (updatedRole) => {
      toast.success(`Role "${updatedRole.name}" updated.`);
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message || "Failed to update role."),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id: string) => apiClient.delete(`/admin/roles/${id}`),
    onSuccess: () => {
      toast.success("Role deleted.");
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message || "Failed to delete role."),
  });
}

// --- 2. Permissions ---
export function useGetPermissions(searchTerm: string) {
  return useQuery<Permission[], Error>({
    queryKey: [PERMISSIONS_QUERY_KEY, searchTerm],
    queryFn: () =>
      apiClient.get<Permission[]>(
        `/admin/roles/permissions?searchTerm=${searchTerm}`
      ),
  });
}

export function useAssignPermissionsToRole() {
  const queryClient = useQueryClient();
  return useMutation<
    Role,
    Error,
    { roleId: string; permissionNames: string[] }
  >({
    mutationFn: ({ roleId, permissionNames }) =>
      apiClient.post(`/admin/roles/${roleId}/permissions`, { permissionNames }),
    onSuccess: (updatedRole) => {
      toast.success(`Permissions updated for ${updatedRole.name}.`);
      // Update the cache for the single role
      queryClient.setQueryData<Role[]>([ROLES_QUERY_KEY], (oldData = []) =>
        oldData.map((role) => (role.id === updatedRole.id ? updatedRole : role))
      );
    },
    onError: (error) =>
      toast.error(error.message || "Failed to assign permissions."),
  });
}

// --- 3. User Role Assignments ---
export function useAssignRolesToUser() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { userId: string; roleIds: string[] }>({
    mutationFn: ({ userId, roleIds }) =>
      apiClient.post(`/admin/users/${userId}/assign-roles`, { roleIds }),
    onSuccess: (_, { userId }) => {
      toast.success("Roles assigned successfully.");
      // Refetch this user's details and the main admin list
      queryClient.invalidateQueries({
        queryKey: [ADMIN_DETAIL_KEY, userId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) => toast.error(error.message || "Failed to assign roles."),
  });
}

export function useRemoveRolesFromUser() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { userId: string; roleIds: string[] }>({
    mutationFn: ({ userId, roleIds }) =>
      apiClient.patch(`/admin/users/${userId}/remove-roles`, { roleIds }),
    onSuccess: (_, { userId }) => {
      toast.success("Roles removed successfully.");
      // Refetch this user's details and the main admin list
      queryClient.invalidateQueries({
        queryKey: [ADMIN_DETAIL_KEY, userId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [ADMINS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) => toast.error(error.message || "Failed to remove roles."),
  });
}

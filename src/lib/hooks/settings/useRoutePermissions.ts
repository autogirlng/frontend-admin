"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  Department,
  DepartmentPayload,
  RoutePermission,
  RoutePermissionPayload,
  RouteUserOverride,
} from "@/components/settings/route-permissions/types";

export const ROUTES_QUERY_KEY = "adminRoutes";
export const ROUTE_DETAIL_KEY = "routeDetail";
export const ROUTE_OVERRIDES_KEY = "routeUserOverrides";
export const DEPARTMENTS_QUERY_KEY = "departments";

// --- Routes CRUD ---

export function useGetAllRoutes() {
  return useQuery<RoutePermission[], Error>({
    queryKey: [ROUTES_QUERY_KEY],
    queryFn: () => apiClient.get<RoutePermission[]>("/admin/routes"),
  });
}

export function useGetRouteById(id: string | null) {
  return useQuery<RoutePermission, Error>({
    queryKey: [ROUTE_DETAIL_KEY, id],
    queryFn: () => apiClient.get<RoutePermission>(`/admin/routes/${id}`),
    enabled: !!id,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation<RoutePermission, Error, RoutePermissionPayload>({
    mutationFn: (payload) => apiClient.post("/admin/routes", payload),
    onSuccess: (route) => {
      toast.success(`Route "${route.routeName}" created.`);
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
    },
    onError: (err) => toast.error(err.message || "Failed to create route."),
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation<
    RoutePermission,
    Error,
    { id: string; payload: RoutePermissionPayload }
  >({
    mutationFn: ({ id, payload }) => apiClient.put(`/admin/routes/${id}`, payload),
    onSuccess: (route) => {
      toast.success(`Route "${route.routeName}" updated.`);
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROUTE_DETAIL_KEY, route.id] });
    },
    onError: (err) => toast.error(err.message || "Failed to update route."),
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/routes/${id}`),
    onSuccess: () => {
      toast.success("Route deleted.");
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
    },
    onError: (err) => toast.error(err.message || "Failed to delete route."),
  });
}

// --- Route access assignment ---

export function useSetRouteRoles() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { routeId: string; roleIds: string[] }>({
    mutationFn: ({ routeId, roleIds }) =>
      apiClient.post(`/admin/routes/${routeId}/roles`, roleIds),
    onSuccess: (_, { routeId }) => {
      toast.success("Route roles updated.");
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROUTE_DETAIL_KEY, routeId] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to update route roles."),
  });
}

export function useSetRouteDepartments() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { routeId: string; departmentIds: string[] }
  >({
    mutationFn: ({ routeId, departmentIds }) =>
      apiClient.post(`/admin/routes/${routeId}/departments`, departmentIds),
    onSuccess: (_, { routeId }) => {
      toast.success("Route departments updated.");
      queryClient.invalidateQueries({ queryKey: [ROUTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROUTE_DETAIL_KEY, routeId] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to update route departments."),
  });
}

// --- Route User Overrides ---

export function useGetRouteOverrides(routeId: string | null) {
  return useQuery<RouteUserOverride[], Error>({
    queryKey: [ROUTE_OVERRIDES_KEY, routeId],
    queryFn: () =>
      apiClient.get<RouteUserOverride[]>(`/admin/routes/${routeId}/users`),
    enabled: !!routeId,
  });
}

export function useSetRouteUserOverride() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { routeId: string; userId: string; type: "GRANT" | "DENY" }
  >({
    mutationFn: ({ routeId, userId, type }) =>
      apiClient.put(
        `/admin/routes/${routeId}/users/${userId}?type=${type}`,
        {},
      ),
    onSuccess: (_, { routeId, type }) => {
      toast.success(
        `User access ${type === "GRANT" ? "granted" : "denied"} successfully.`,
      );
      queryClient.invalidateQueries({
        queryKey: [ROUTE_OVERRIDES_KEY, routeId],
      });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to set user override."),
  });
}

export function useRemoveRouteUserOverride() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { routeId: string; userId: string }>({
    mutationFn: ({ routeId, userId }) =>
      apiClient.delete(`/admin/routes/${routeId}/users/${userId}`),
    onSuccess: (_, { routeId }) => {
      toast.success("User override removed.");
      queryClient.invalidateQueries({
        queryKey: [ROUTE_OVERRIDES_KEY, routeId],
      });
    },
    onError: (err) => toast.error(err.message || "Failed to remove override."),
  });
}

// --- Departments CRUD ---

export function useGetDepartments() {
  return useQuery<Department[], Error>({
    queryKey: [DEPARTMENTS_QUERY_KEY],
    queryFn: () => apiClient.get<Department[]>("/admin/departments"),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation<Department, Error, DepartmentPayload>({
    mutationFn: (payload) => apiClient.post("/admin/departments", payload),
    onSuccess: (dept) => {
      toast.success(`Department "${dept.name}" created.`);
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to create department."),
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation<
    Department,
    Error,
    { id: string; payload: DepartmentPayload }
  >({
    mutationFn: ({ id, payload }) =>
      apiClient.put(`/admin/departments/${id}`, payload),
    onSuccess: (dept) => {
      toast.success(`Department "${dept.name}" updated.`);
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to update department."),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => apiClient.delete(`/admin/departments/${id}`),
    onSuccess: () => {
      toast.success("Department deleted.");
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to delete department."),
  });
}

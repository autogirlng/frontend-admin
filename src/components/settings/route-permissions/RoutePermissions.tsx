"use client";

import React, { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Users,
  Building2,
  Search,
  X,
  AlertCircle,
  UserCheck,
  UserX,
  Check,
  Route,
  Loader2,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { ActionMenu } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import RouteFormModal from "./RouteFormModal";
import {
  useGetAllRoutes,
  useGetRouteById,
  useDeleteRoute,
  useSetRouteRoles,
  useSetRouteDepartments,
  useGetRouteOverrides,
  useSetRouteUserOverride,
  useRemoveRouteUserOverride,
  useUpdateRoute,
  useGetDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "@/lib/hooks/settings/useRoutePermissions";
import { useGetRoles } from "@/components/settings/roles/useRoles";
import { useGetAdmins } from "@/lib/hooks/settings/useAdmins";
import { RoutePermission, RouteUserOverride, Department, getRouteActive } from "./types";
import { Role } from "@/components/settings/roles/types";
import TextInput from "@/components/generic/ui/TextInput";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActiveTab = "access" | "overrides";

type ModalState =
  | null
  | { type: "createRoute" }
  | { type: "editRoute"; route: RoutePermission }
  | { type: "deleteRoute"; route: RoutePermission }
  | { type: "editRoles"; route: RoutePermission }
  | { type: "editDepts"; route: RoutePermission }
  | { type: "addOverride"; overrideType: "GRANT" | "DENY" }
  | { type: "removeOverride"; override: RouteUserOverride }
  | { type: "createDept" }
  | { type: "editDept"; dept: Department }
  | { type: "deleteDept"; dept: Department };

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RoutePermissions() {
  const [selectedRoute, setSelectedRoute] = useState<RoutePermission | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("access");
  const [modal, setModal] = useState<ModalState>(null);
  const [routeSearch, setRouteSearch] = useState("");

  const {
    data: routes = [],
    isLoading: routesLoading,
    isError: routesError,
  } = useGetAllRoutes();
  const { data: roles = [] } = useGetRoles();
  const { data: departments = [] } = useGetDepartments();
  const { data: routeDetail } = useGetRouteById(selectedRoute?.id ?? null);
  const deleteRoute = useDeleteRoute();

  // Merge list-item data with the per-route detail (which has requiredRoleIds/requiredDepartmentIds)
  const fullRoute: RoutePermission | null = selectedRoute
    ? { ...selectedRoute, ...(routeDetail ?? {}) }
    : null;

  // Keep selectedRoute in sync with list refetches (for name/path/status changes)
  useEffect(() => {
    if (!selectedRoute) return;
    const updated = routes.find((r) => r.id === selectedRoute.id);
    if (updated) setSelectedRoute(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const q = routeSearch.toLowerCase().trim();
    if (!q) return routes;
    return routes.filter(
      (r) =>
        r.routeName.toLowerCase().includes(q) ||
        r.routePath.toLowerCase().includes(q),
    );
  }, [routes, routeSearch]);

  const closeModal = () => setModal(null);

  const handleDeleteRoute = () => {
    if (modal?.type !== "deleteRoute") return;
    deleteRoute.mutate(modal.route.id, {
      onSuccess: () => {
        closeModal();
        if (selectedRoute?.id === modal.route.id) setSelectedRoute(null);
      },
    });
  };

  const getRoleName = (id: string) =>
    roles.find((r) => r.id === id)?.name ?? id;
  const getDeptName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? id;

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Route Permissions
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Control which roles, departments, and users can access each
            dashboard route.
          </p>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Route list */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Routes</h2>
              <Button
                variant="primary"
                className="w-auto"
                onClick={() => setModal({ type: "createRoute" })}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Route
              </Button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search routes..."
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0096FF] bg-gray-50"
              />
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl h-[620px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {routesLoading ? (
                <div className="h-48">
                  <CustomLoader />
                </div>
              ) : routesError ? (
                <div className="flex flex-col items-center gap-2 p-10 text-red-500">
                  <AlertCircle className="h-8 w-8" />
                  <p className="text-sm font-semibold">Failed to load routes.</p>
                </div>
              ) : filteredRoutes.length === 0 ? (
                <div className="flex flex-col items-center gap-2 p-10 text-gray-400">
                  <Route className="h-8 w-8" />
                  <p className="text-sm">No routes found.</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredRoutes.map((route) => {
                    const isSelected = selectedRoute?.id === route.id;
                    return (
                      <div
                        key={route.id}
                        className={clsx(
                          "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#0096FF] text-white"
                            : "hover:bg-gray-50",
                        )}
                        onClick={() => {
                          setSelectedRoute(route);
                          setActiveTab("access");
                        }}
                      >
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">
                              {route.routeName}
                            </span>
                            <span
                              className={clsx(
                                "flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                getRouteActive(route)
                                  ? isSelected
                                    ? "bg-white/20 text-white"
                                    : "bg-green-100 text-green-700"
                                  : isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-100 text-gray-500",
                              )}
                            >
                              {getRouteActive(route) ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p
                            className={clsx(
                              "text-xs font-mono truncate mt-0.5",
                              isSelected ? "text-blue-100" : "text-gray-400",
                            )}
                          >
                            {route.routePath}
                          </p>
                        </div>
                        <ActionMenu
                          actions={[
                            {
                              label: "Edit Route",
                              icon: Edit2,
                              onClick: () => {
                                setSelectedRoute(route);
                                setModal({ type: "editRoute", route });
                              },
                            },
                            {
                              label: "Delete Route",
                              icon: Trash2,
                              onClick: () =>
                                setModal({ type: "deleteRoute", route }),
                              danger: true,
                            },
                          ]}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Route manager */}
          <div className="lg:col-span-2">
            {!selectedRoute ? (
              <div className="flex flex-col h-[680px] items-center justify-center p-10 text-gray-400 bg-gray-50 border-2 border-dashed rounded-xl">
                <Shield className="h-16 w-16 text-gray-300 mb-4" />
                <p className="font-semibold text-gray-600">Select a Route</p>
                <p className="text-sm text-center mt-1">
                  Pick a route from the left panel to manage its access rules
                  and user overrides.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                {/* Route header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedRoute.routeName}
                      </h3>
                      <span
                        className={clsx(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          getRouteActive(fullRoute ?? selectedRoute)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        {getRouteActive(fullRoute ?? selectedRoute) ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-gray-400 mt-0.5">
                      {selectedRoute.routePath}
                    </p>
                    {selectedRoute.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedRoute.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-auto flex-shrink-0"
                    onClick={() =>
                      setModal({ type: "editRoute", route: selectedRoute })
                    }
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-100">
                  <nav className="flex -mb-px px-2">
                    {(
                      [
                        {
                          id: "access" as const,
                          label: "Access Rules",
                          icon: Shield,
                        },
                        {
                          id: "overrides" as const,
                          label: "User Overrides",
                          icon: Users,
                        },
                      ] as const
                    ).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={clsx(
                          "flex items-center gap-2 w-1/2 py-4 px-2 justify-center border-b-2 font-medium text-sm transition-colors",
                          activeTab === id
                            ? "border-[#0096FF] text-[#0096FF]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab content */}
                <div className="p-6 min-h-[460px] max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {activeTab === "access" && (
                    <AccessRulesPanel
                      route={fullRoute ?? selectedRoute}
                      roles={roles}
                      departments={departments}
                      getRoleName={getRoleName}
                      getDeptName={getDeptName}
                      onEditRoles={() =>
                        setModal({ type: "editRoles", route: selectedRoute })
                      }
                      onEditDepts={() =>
                        setModal({ type: "editDepts", route: selectedRoute })
                      }
                    />
                  )}
                  {activeTab === "overrides" && (
                    <UserOverridesPanel
                      route={selectedRoute}
                      onGrant={() =>
                        setModal({
                          type: "addOverride",
                          overrideType: "GRANT",
                        })
                      }
                      onDeny={() =>
                        setModal({ type: "addOverride", overrideType: "DENY" })
                      }
                      onRemove={(override) =>
                        setModal({ type: "removeOverride", override })
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Departments section */}
        <div className="mt-10">
          <DepartmentsSection
            departments={departments}
            onCreate={() => setModal({ type: "createDept" })}
            onEdit={(dept) => setModal({ type: "editDept", dept })}
            onDelete={(dept) => setModal({ type: "deleteDept", dept })}
          />
        </div>
      </main>

      {/* ---- Modals ---- */}

      {(modal?.type === "createRoute" || modal?.type === "editRoute") && (
        <RouteFormModal
          onClose={closeModal}
          initialData={modal.type === "editRoute" ? modal.route : null}
        />
      )}

      {modal?.type === "deleteRoute" && (
        <ActionModal
          title="Delete Route"
          message={
            <>
              Delete route{" "}
              <strong className="text-gray-900">{modal.route.routeName}</strong>
              ? Users relying on this route will lose access immediately.
            </>
          }
          actionLabel="Delete Route"
          onClose={closeModal}
          onConfirm={handleDeleteRoute}
          isLoading={deleteRoute.isPending}
          variant="danger"
        />
      )}

      {modal?.type === "editRoles" && selectedRoute && (
        <SelectItemsModal
          title="Assign Roles"
          subtitle={`Which roles can access "${selectedRoute.routeName}"?`}
          items={roles.map((r) => ({
            id: r.id,
            label: r.name,
            sublabel: r.description,
          }))}
          currentIds={fullRoute?.requiredRoleIds ?? []}
          onClose={closeModal}
          routeId={selectedRoute.id}
          saveType="roles"
        />
      )}

      {modal?.type === "editDepts" && selectedRoute && (
        <SelectItemsModal
          title="Assign Departments"
          subtitle={`Which departments can access "${selectedRoute.routeName}"?`}
          items={departments.map((d) => ({ id: d.id, label: d.name }))}
          currentIds={fullRoute?.requiredDepartmentIds ?? []}
          onClose={closeModal}
          routeId={selectedRoute.id}
          saveType="departments"
        />
      )}

      {modal?.type === "addOverride" && selectedRoute && (
        <AddOverrideModal
          routeId={selectedRoute.id}
          overrideType={modal.overrideType}
          onClose={closeModal}
        />
      )}

      {modal?.type === "removeOverride" && selectedRoute && (
        <RemoveOverrideConfirm
          routeId={selectedRoute.id}
          override={modal.override}
          onClose={closeModal}
        />
      )}

      {modal?.type === "createDept" && (
        <DepartmentFormModal onClose={closeModal} initialData={null} />
      )}

      {modal?.type === "editDept" && (
        <DepartmentFormModal onClose={closeModal} initialData={modal.dept} />
      )}

      {modal?.type === "deleteDept" && (
        <DeleteDepartmentConfirm dept={modal.dept} onClose={closeModal} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Access Rules Panel
// ---------------------------------------------------------------------------

function AccessRulesPanel({
  route,
  roles,
  departments,
  getRoleName,
  getDeptName,
  onEditRoles,
  onEditDepts,
}: {
  route: RoutePermission;
  roles: Role[];
  departments: Department[];
  getRoleName: (id: string) => string;
  getDeptName: (id: string) => string;
  onEditRoles: () => void;
  onEditDepts: () => void;
}) {
  const updateRoute = useUpdateRoute();

  const toggleLogic = () => {
    updateRoute.mutate({
      id: route.id,
      payload: {
        routePath: route.routePath,
        routeName: route.routeName,
        iconName: route.iconName,
        description: route.description,
        isActive: getRouteActive(route),
        requiredRoleIds: route.requiredRoleIds ?? [],
        requiredDepartmentIds: route.requiredDepartmentIds ?? [],
        requiresAnyPermission: !(route.requiresAnyPermission ?? false),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Access logic */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Access Logic
        </p>
        <p className="text-xs text-gray-400 mb-3">
          When both roles and departments are set, must the user satisfy{" "}
          <em>both</em> (AND) or <em>either one</em> (OR)?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => (route.requiresAnyPermission ?? false) && toggleLogic()}
            disabled={updateRoute.isPending}
            className={clsx(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors",
              !(route.requiresAnyPermission ?? false)
                ? "bg-[#0096FF] text-white border-[#0096FF]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
            )}
          >
            Require ALL (AND)
          </button>
          <button
            onClick={() => !(route.requiresAnyPermission ?? false) && toggleLogic()}
            disabled={updateRoute.isPending}
            className={clsx(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors",
              route.requiresAnyPermission ?? false
                ? "bg-[#0096FF] text-white border-[#0096FF]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
            )}
          >
            Require ANY (OR)
          </button>
        </div>
      </div>

      {/* Roles */}
      <div className="border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#0096FF]" />
            <p className="text-sm font-semibold text-gray-800">
              Required Roles
            </p>
            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
              {(route.requiredRoleIds ?? []).length}
            </span>
          </div>
          <button
            onClick={onEditRoles}
            className="text-xs font-medium text-[#0096FF] hover:text-[#007ACC] transition-colors"
          >
            Edit
          </button>
        </div>
        {(route.requiredRoleIds ?? []).length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No roles required — any authenticated user can access this route.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(route.requiredRoleIds ?? []).map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full"
              >
                <Shield className="h-3 w-3" />
                {getRoleName(id)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Departments */}
      <div className="border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-500" />
            <p className="text-sm font-semibold text-gray-800">
              Required Departments
            </p>
            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
              {(route.requiredDepartmentIds ?? []).length}
            </span>
          </div>
          <button
            onClick={onEditDepts}
            className="text-xs font-medium text-[#0096FF] hover:text-[#007ACC] transition-colors"
          >
            Edit
          </button>
        </div>
        {(route.requiredDepartmentIds ?? []).length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No departments required — department membership is not checked.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(route.requiredDepartmentIds ?? []).map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full"
              >
                <Building2 className="h-3 w-3" />
                {getDeptName(id)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// User Overrides Panel
// ---------------------------------------------------------------------------

function UserOverridesPanel({
  route,
  onGrant,
  onDeny,
  onRemove,
}: {
  route: RoutePermission;
  onGrant: () => void;
  onDeny: () => void;
  onRemove: (override: RouteUserOverride) => void;
}) {
  const { data: overrides = [], isLoading } = useGetRouteOverrides(route.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">User Overrides</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Grant or deny specific users access to this route, regardless of
            their role or department.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="primary"
            size="sm"
            className="w-auto"
            onClick={onGrant}
          >
            <UserCheck className="h-3.5 w-3.5 mr-1.5" />
            Grant
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="w-auto"
            onClick={onDeny}
          >
            <UserX className="h-3.5 w-3.5 mr-1.5" />
            Deny
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : overrides.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <Users className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">No user overrides set for this route.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {overrides.map((o) => (
            <div
              key={o.userId}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {o.firstName[0]}
                  {o.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {o.firstName} {o.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{o.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span
                  className={clsx(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    o.type === "GRANT"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700",
                  )}
                >
                  {o.type === "GRANT" ? "Granted" : "Denied"}
                </span>
                <button
                  onClick={() => onRemove(o)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove override"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SelectItemsModal — generic multi-select for roles and departments
// ---------------------------------------------------------------------------

function SelectItemsModal({
  title,
  subtitle,
  items,
  currentIds,
  onClose,
  routeId,
  saveType,
}: {
  title: string;
  subtitle: string;
  items: { id: string; label: string; sublabel?: string }[];
  currentIds: string[];
  onClose: () => void;
  routeId: string;
  saveType: "roles" | "departments";
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentIds ?? []),
  );
  const [search, setSearch] = useState("");
  const setRouteRoles = useSetRouteRoles();
  const setRouteDepts = useSetRouteDepartments();

  const isPending =
    saveType === "roles" ? setRouteRoles.isPending : setRouteDepts.isPending;

  const filtered = items.filter(
    (i) =>
      !search.trim() ||
      i.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const ids = Array.from(selected);
    if (saveType === "roles") {
      setRouteRoles.mutate({ routeId, roleIds: ids }, { onSuccess: onClose });
    } else {
      setRouteDepts.mutate(
        { routeId, departmentIds: ids },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${saveType}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0096FF] bg-gray-50"
            />
          </div>
        </div>

        <div className="px-5 pb-4 max-h-64 overflow-y-auto space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              Nothing found.
            </p>
          ) : (
            filtered.map((item) => {
              const isChecked = selected.has(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer group"
                >
                  <div
                    className={clsx(
                      "flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                      isChecked
                        ? "bg-[#0096FF] border-[#0096FF]"
                        : "border-gray-300 group-hover:border-gray-400",
                    )}
                    onClick={() => toggle(item.id)}
                  >
                    {isChecked && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggle(item.id)}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className="text-xs text-gray-400 truncate">
                        {item.sublabel}
                      </p>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">
            {selected.size} selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-auto px-4"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-auto px-4"
              onClick={handleSave}
              isLoading={isPending}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add Override Modal
// ---------------------------------------------------------------------------

function AddOverrideModal({
  routeId,
  overrideType,
  onClose,
}: {
  routeId: string;
  overrideType: "GRANT" | "DENY";
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const setOverride = useSetRouteUserOverride();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: results, isFetching } = useGetAdmins(0, debouncedSearch);
  const adminList = results?.content ?? [];

  const handleSelect = (user: (typeof adminList)[0]) => {
    setSelectedUserId(user.id);
    setSelectedUserName(`${user.firstName} ${user.lastName} (${user.email})`);
    setSearch("");
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedUserId) return;
    setOverride.mutate(
      { routeId, userId: selectedUserId, type: overrideType },
      { onSuccess: onClose },
    );
  };

  const isGrant = overrideType === "GRANT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "h-9 w-9 rounded-full flex items-center justify-center",
                isGrant ? "bg-green-100" : "bg-red-100",
              )}
            >
              {isGrant ? (
                <UserCheck
                  className={clsx("h-5 w-5", "text-green-600")}
                />
              ) : (
                <UserX className={clsx("h-5 w-5", "text-red-600")} />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {isGrant ? "Grant User Access" : "Deny User Access"}
              </h3>
              <p className="text-xs text-gray-400">
                {isGrant
                  ? "User gets access regardless of role/department."
                  : "User is blocked regardless of role/department."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Selected user display */}
          {selectedUserId && (
            <div
              className={clsx(
                "flex items-center justify-between p-3 rounded-lg border",
                isGrant
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200",
              )}
            >
              <p className="text-sm font-medium text-gray-800 truncate">
                {selectedUserName}
              </p>
              <button
                onClick={() => {
                  setSelectedUserId(null);
                  setSelectedUserName("");
                }}
                className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Search */}
          {!selectedUserId && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Admin User
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type a name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0096FF]"
                />
                {isFetching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>

              {showDropdown && debouncedSearch && adminList.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {adminList.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelect(user)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown &&
                debouncedSearch &&
                !isFetching &&
                adminList.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-4 text-center text-sm text-gray-400">
                    No users found.
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-4"
            onClick={onClose}
            disabled={setOverride.isPending}
          >
            Cancel
          </Button>
          <Button
            variant={isGrant ? "primary" : "danger"}
            size="sm"
            className="w-auto px-4"
            onClick={handleSubmit}
            isLoading={setOverride.isPending}
            disabled={!selectedUserId}
          >
            {isGrant ? "Grant Access" : "Deny Access"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Remove Override Confirm
// ---------------------------------------------------------------------------

function RemoveOverrideConfirm({
  routeId,
  override,
  onClose,
}: {
  routeId: string;
  override: RouteUserOverride;
  onClose: () => void;
}) {
  const removeOverride = useRemoveRouteUserOverride();

  return (
    <ActionModal
      title="Remove Override"
      message={
        <>
          Remove the{" "}
          <strong
            className={
              override.type === "GRANT" ? "text-green-700" : "text-red-700"
            }
          >
            {override.type}
          </strong>{" "}
          override for{" "}
          <strong className="text-gray-900">
            {override.firstName} {override.lastName}
          </strong>
          ? They will fall back to their normal role/department rules.
        </>
      }
      actionLabel="Remove Override"
      onClose={onClose}
      onConfirm={() =>
        removeOverride.mutate(
          { routeId, userId: override.userId },
          { onSuccess: onClose },
        )
      }
      isLoading={removeOverride.isPending}
      variant="danger"
    />
  );
}

// ---------------------------------------------------------------------------
// Departments Section
// ---------------------------------------------------------------------------

function DepartmentsSection({
  departments,
  onCreate,
  onEdit,
  onDelete,
}: {
  departments: Department[];
  onCreate: () => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Departments</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Organize staff into departments to gate route access by team.
          </p>
        </div>
        <Button
          variant="primary"
          className="w-auto"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <div className="flex flex-col items-center py-12 bg-gray-50 border-2 border-dashed rounded-xl text-gray-400">
          <Building2 className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">No departments created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const parent = departments.find(
              (d) => d.id === dept.parentDepartmentId,
            );
            return (
              <div
                key={dept.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {dept.name}
                    </p>
                  </div>
                  {parent && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      ↳ {parent.name}
                    </p>
                  )}
                </div>
                <ActionMenu
                  actions={[
                    {
                      label: "Edit",
                      icon: Edit2,
                      onClick: () => onEdit(dept),
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => onDelete(dept),
                      danger: true,
                    },
                  ]}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Department Form Modal
// ---------------------------------------------------------------------------

function DepartmentFormModal({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData: Department | null;
}) {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name ?? "");
  const [nameError, setNameError] = useState("");

  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const isPending = createDept.isPending || updateDept.isPending;

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError("Department name is required.");
      return;
    }
    const payload = { name: name.trim() };
    if (isEditing) {
      updateDept.mutate(
        { id: initialData.id, payload },
        { onSuccess: onClose },
      );
    } else {
      createDept.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            {isEditing ? "Edit Department" : "Create Department"}
          </h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5">
          <TextInput
            id="deptName"
            label="Department Name"
            placeholder="e.g. Finance, Engineering"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            error={nameError}
          />
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-4"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-auto px-4"
            onClick={handleSubmit}
            isLoading={isPending}
          >
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete Department Confirm
// ---------------------------------------------------------------------------

function DeleteDepartmentConfirm({
  dept,
  onClose,
}: {
  dept: Department;
  onClose: () => void;
}) {
  const deleteDept = useDeleteDepartment();

  return (
    <ActionModal
      title="Delete Department"
      message={
        <>
          Delete department{" "}
          <strong className="text-gray-900">{dept.name}</strong>? This will
          fail if staff members are still assigned to it.
        </>
      }
      actionLabel="Delete Department"
      onClose={onClose}
      onConfirm={() =>
        deleteDept.mutate(dept.id, { onSuccess: onClose })
      }
      isLoading={deleteDept.isPending}
      variant="danger"
    />
  );
}

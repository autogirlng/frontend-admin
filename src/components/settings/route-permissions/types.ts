export interface RoutePermission {
  id: string;
  routePath: string;
  routeName: string;
  iconName?: string;
  description?: string;
  isActive?: boolean;
  active?: boolean;
  requiredRoleIds?: string[];
  requiredDepartmentIds?: string[];
  requiresAnyPermission?: boolean;
}

export interface RoutePermissionPayload {
  routePath: string;
  routeName: string;
  iconName?: string;
  description?: string;
  isActive: boolean;
  requiredRoleIds?: string[];
  requiredDepartmentIds?: string[];
  requiresAnyPermission?: boolean;
}

export interface RouteUserOverride {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  type: "GRANT" | "DENY";
}

export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string | null;
}

export interface DepartmentPayload {
  name: string;
  parentDepartmentId?: string | null;
}

/** Reads the active status regardless of whether the API returns isActive or active */
export const getRouteActive = (r: RoutePermission | null | undefined): boolean =>
  r?.isActive ?? r?.active ?? false;

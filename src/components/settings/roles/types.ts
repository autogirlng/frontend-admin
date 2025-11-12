// app/dashboard/settings/roles/types.ts

// --- Generic Paginated Response ---
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Role Types ---
export interface Role {
  id: string;
  name: string;
  description: string;
  permissionNames: string[];
}

export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
}

export interface RolePayload {
  name: string;
  description: string;
}

// --- Permission Type ---
export interface Permission {
  name: string;
  description: string;
  createdAt: string;
}

// --- Admin User Types ---
// (From your /admin/users/admins endpoint)
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  departmentName?: string;
  active: boolean;
  roles?: { id: string; name: string }[]; // Assuming this will be added
}

// (From your /admin/users/admins/{adminId} endpoint)
export interface AdminUserDetail {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  profilePictureUrl?: string;
  department?: {
    id: string;
    name: string;
  };
  roles?: {
    id: string;
    name: string;
  }[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

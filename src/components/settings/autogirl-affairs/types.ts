// app/dashboard/autogirl/types.ts

// --- Generic Paginated Response ---
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Department Types ---
export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
}

export interface DepartmentPayload {
  name: string;
  parentDepartmentId?: string;
}

// --- Admin User Type ---
// This is from your /admin/users/admins endpoint
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  departmentName?: string;
  active: boolean;
}

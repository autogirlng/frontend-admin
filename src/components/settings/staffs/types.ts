// app/dashboard/settings/staffs/types.ts

// The paginated response structure
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Admin User (for the list) ---
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  active: boolean;
  departmentName?: string; // ✅ ADDED
}

// --- Admin User Detail (for the modal) ---
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

// --- User Types for Promotion Search ---
export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

export interface Host {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

// --- API Payloads & Responses ---
export interface CreateAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  sendCredentialTo: string[];
}

// ✅ --- NEW: Department Types ---
export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
}

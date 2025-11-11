// app/dashboard/settings/staffs/types.ts

// --- Generic Paginated Response ---
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Admin User ---
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  active: boolean;
  departmentName?: string;
}

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

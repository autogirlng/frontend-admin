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
  active: boolean; // Assuming this field exists, as there's an activate/deactivate endpoint
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

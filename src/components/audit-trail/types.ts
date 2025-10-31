// app/dashboard/audit-trail/types.ts

// The paginated response structure
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// For the parsed userAgent JSON
export interface UserAgent {
  OS: string;
  Device: string;
  Browser: string;
}

// A single audit log item
export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  module: string;
  description: string;
  newValue: string | null;
  oldValue: string | null;
  ipAddress: string;
  userAgent: string; // This is the raw JSON string
  createdAt: string;
  createdById: string | null;
  updatedById: string | null;
}

// --- Notification Item ---
// Based on GET /notification/notification-by-user response content
export interface NotificationItem {
  id: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  user: {
    // You might not need all user details, adjust as needed
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  title: string;
  isRead: boolean;
  message: string;
  entityId: string;
  entityName: string;
  actionUrl?: string; // Optional URL to link to
  type: "INFO" | "WARNING" | "ERROR"; // Add other types if applicable
  priority: "LOW" | "MEDIUM" | "HIGH"; // Add other priorities if applicable
  isDeleted: boolean;
}

// --- Update PaginatedResponse if needed ---
// Check if your API consistently uses 'page', 'size', 'totalElements' etc.
// If so, you might want a separate type or adjust the existing one.
// For this example, I'll assume your hook adapts the response if needed.
// Example adjustment (if necessary):
export interface ApiPaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Update Notification Context Type ---
// We had a `Notification` type for WebSocket, let's ensure consistency
// or rename one. I'll assume the WebSocket one can be renamed to `RealtimeNotification`
// if they differ significantly from `NotificationItem`. For now, I'll assume
// `Notification` in the context refers to the `NotificationItem` structure.
// You might need to adjust the WebSocket service and context types accordingly.

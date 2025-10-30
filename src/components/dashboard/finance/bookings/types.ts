// app/dashboard/finance/bookings/types.ts

// The paginated response structure
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// A single booking object from the GET /bookings response
export interface Booking {
  bookingId: string;
  bookingStatus: string; // Will match one of the BookingStatus enum keys
  createdAt: string;
  firstSegmentStarts: string;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  vehicleIdentifier: string;
  totalPrice: number;
  hostName: string;
}

// Enums for filters
export enum BookingStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  CONFIRMED = "CONFIRMED",
  FAILED_AVAILABILITY = "FAILED_AVAILABILITY",
  CANCELLED_BY_USER = "CANCELLED_BY_USER",
  CANCELLED_BY_HOST = "CANCELLED_BY_HOST",
  CANCELLED_BY_ADMIN = "CANCELLED_BY_ADMIN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

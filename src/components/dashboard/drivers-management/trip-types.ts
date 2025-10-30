// app/dashboard/trips/types.ts

// The paginated response structure
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// A single trip object from the API
export interface Trip {
  id: string;
  startDateTime: string;
  endDateTime: string;
  customerName: string;
  customerPhoneNumber: string;
  vehicleIdentifier: string;
  vehicleName: string;
  driverName: string;
  driverPhoneNumber: string;
  bookingTypeName: string;
  bookedHours: number;
  duration: string;
  city: string;
  pickupLocation: string;
  bookingStatus: string;
  tripStatus: string;
  totalPrice: number;
  bookingId: string;
  createdAt: string;
}

// Enums for filters
export enum TripStatus {
  UPCOMING = "UPCOMING",
  IN_PROGRESS = "IN_PROGRESS",
  COMING_TO_AN_END = "COMING_TO_AN_END",
  COMPLETED = "COMPLETED",
  DELAYED = "DELAYED",
  EXTENDED = "EXTENDED",
  CANCELLED = "CANCELLED",
}

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

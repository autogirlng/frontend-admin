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
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  hostName: string | null;
  hostEmail: string | null;
  hostPhoneNumber: string | null;
  driverName: string | null;
  driverPhoneNumber: string | null;
  customerAgentName: string | null;
  operationsAgentName: string | null;
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

// Admin user type (for agents)
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
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

export type TripDetail = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  customerName: string;
  customerPhoneNumber: string;
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  hostName: string | null;
  hostEmail: string | null;
  hostPhoneNumber: string | null;
  driverName: string | null;
  driverPhoneNumber: string | null;
  customerAgentName: string | null;
  operationsAgentName: string | null;
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
};

// --- New Type for Vehicle Details (Selected Fields) ---
export type VehicleDetail = {
  id: string;
  name: string;
  vehicleIdentifier: string;
  licensePlateNumber: string;
  vehicleColorId: string; // We'll just display this, but you could map it
  numberOfSeats: number;
  photos: {
    cloudinaryUrl: string;
    isPrimary: boolean;
  }[];
  features: {
    id: string;
    name: string;
  }[];
};

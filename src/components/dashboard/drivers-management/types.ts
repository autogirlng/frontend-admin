export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Driver {
  id: string;
  driverIdentifier: string;
  fullName: string;
  phoneNumber: string;
  ownerType: string;
  ownerName: string;
  active: boolean;
  assignedVehicleId?: string;
  assignedVehicleIdentifier?: string;
  assignedVehicleName?: string;
}

export interface DriverDetail {
  id: string;
  driverIdentifier: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  ownerType: string;
  ownerName: string;
  assignedVehicleId?: string;
  assignedVehicleIdentifier?: string;
  assignedVehicleName?: string;
  profilePictureUrl?: string;
  active: boolean;
}

export interface DriverPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  driverIdentifier: string;
}

export interface UpdateDriverPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  driverIdentifier: string;
}

export type Shift = "NONE" | "DAY" | "NIGHT" | "ALL_DAY";

export interface DriverSchedule {
  id: string;
  driver: Driver;
  weekStartDate: string;
  mondayShift: Shift;
  tuesdayShift: Shift;
  wednesdayShift: Shift;
  thursdayShift: Shift;
  fridayShift: Shift;
  saturdayShift: Shift;
  sundayShift: Shift;
}

export interface DriverSchedulePayload {
  weekStartDate: string;
  mondayShift: Shift;
  tuesdayShift: Shift;
  wednesdayShift: Shift;
  thursdayShift: Shift;
  fridayShift: Shift;
  saturdayShift: Shift;
  sundayShift: Shift;
}

export interface VehicleSearchResult {
  id: string;
  vehicleIdentifier: string;
  name: string;
  licensePlateNumber?: string;
  ownerName: string;
  status: string;
}

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
  VOID = "VOID",
  ABANDONED = "ABANDONED",
}

export interface DriverTrip {
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
  driverName: string;
  driverPhoneNumber: string;
  customerAgentName: string | null;
  operationsAgentName: string | null;
  bookingTypeName: string;
  bookedHours: number;
  duration: string;
  city: string;
  pickupLocation: string;
  bookingStatus: BookingStatus;
  tripStatus: TripStatus;
  totalPrice: number;
  bookingId: string;
  createdAt: string;
  ongoing: boolean;
}

export interface DriverTripFilters {
  page: number;
  size: number;
  bookingStatus?: string | null;
  tripStatus?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

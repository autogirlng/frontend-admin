// .../drivers-management/types.ts

// --- Paginated Response ---
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Driver Types ---
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
  fullName: string; // This will be split into first/last name
  firstName?: string; // Assuming the detail endpoint might send this
  lastName?: string; // Assuming the detail endpoint might send this
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

// --- Driver Schedule Types ---
export type Shift = "NONE" | "DAY" | "NIGHT" | "ALL_DAY";

export interface DriverSchedule {
  id: string;
  driver: Driver;
  weekStartDate: string; // "YYYY-MM-DD"
  mondayShift: Shift;
  tuesdayShift: Shift;
  wednesdayShift: Shift;
  thursdayShift: Shift;
  fridayShift: Shift;
  saturdayShift: Shift;
  sundayShift: Shift;
}

export interface DriverSchedulePayload {
  weekStartDate: string; // "YYYY-MM-DD"
  mondayShift: Shift;
  tuesdayShift: Shift;
  wednesdayShift: Shift;
  thursdayShift: Shift;
  fridayShift: Shift;
  saturdayShift: Shift;
  sundayShift: Shift;
}

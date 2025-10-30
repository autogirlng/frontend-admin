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
  fullName: string; // ✅ Changed from firstName/lastName
  phoneNumber: string;
  ownerType: string;
  ownerName: string; // ✅ Changed from owner object
  active: boolean; // ✅ Added
}

export interface DriverPayload {
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

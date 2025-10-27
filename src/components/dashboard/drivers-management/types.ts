// --- Driver Types ---
export interface Driver {
  id: string;
  driverIdentifier: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ownerType: string;
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

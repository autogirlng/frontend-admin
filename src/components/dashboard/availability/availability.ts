// lib/types/availability.ts

// --- Existing Types ---
export type AvailabilityStatus = {
  date: string; // "YYYY-MM-DD"
  bookedTypes: string[]; // e.g., ["12 Hours"], empty if available
  unavailabilityReasons: string[]; // ✅ NEW: e.g., ["MAINTENANCE"]
};

export type VehicleAvailability = {
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  availability: AvailabilityStatus[];
  unavailabilitySchedule: any[]; // This field seems to be for raw data, we'll ignore it for the calendar view
};

export type AvailabilityResponse = {
  content: VehicleAvailability[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

// --- Updated ---
export type AvailabilityCalendarProps = {
  vehicles: VehicleAvailability[];
  startDate: Date;
  endDate: Date;
  onCellClick: (vehicleId: string, date: Date) => void; // ✅ For the hourly modal
};

// --- New Types for Daily Schedule ---
export type HourlySlot = {
  hour: number;
  startTime: string;
  endTime: string;
  available: boolean;
  bookingTypeName?: string;
  bookingId?: string;
};

export type DailyScheduleResponse = {
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  date: string;
  hourlySlots: HourlySlot[];
};

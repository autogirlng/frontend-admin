// lib/types/availability.ts

// --- Existing Types ---
export type AvailabilityStatus = {
  date: string;
  bookedTypes: string[];
};

export type VehicleAvailability = {
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  availability: AvailabilityStatus[];
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
  onCellClick: (vehicleId: string, date: Date) => void; // ✅ Added click handler prop
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

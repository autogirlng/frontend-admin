export type AvailabilityStatus = {
  date: string;
  bookedTypes: string[];
  unavailabilityReasons: string[];
  status: string;
  availabilityPercentage: number;
  summary: string;
};

export type UnavailabilitySchedule = {
  id: string;
  vehicleId: string;
  startDateTime: string;
  endDateTime: string;
  reason: string;
  notes: string;
  createdById: string;
};

export type VehicleAvailability = {
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  availability: AvailabilityStatus[];
  unavailabilitySchedule: UnavailabilitySchedule[];
};

export type PaginatedAvailabilityData = {
  content: VehicleAvailability[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type AvailabilityApiResponse = {
  status: string;
  message: string;
  data: PaginatedAvailabilityData;
  timestamp: string;
};

export type AvailabilityCalendarProps = {
  vehicles: VehicleAvailability[];
  startDate: Date;
  endDate: Date;
  onCellClick: (vehicleId: string, date: Date) => void;
};

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

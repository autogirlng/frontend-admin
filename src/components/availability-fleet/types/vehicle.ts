// types/vehicle.ts

export interface DailyAvailability {
  date: string;
  status: "available" | "not-available";
}

export interface HourlyAvailability {
  time: string;
  status: "available" | "not-available";
}

export interface Vehicle {
  id: string;
  listingName: string;
  make: string;
  model: string;
  yearOfRelease: string;
  vehicleType: string;
  location: string;
  availability: DailyAvailability[];
}

export interface VehicleWithHourly extends Omit<Vehicle, "availability"> {
  availability: HourlyAvailability[];
}

export interface VehicleSearchResponse<T = Vehicle> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

export interface SearchFilters {
  startDate: string;
  endDate: string;
  search: string;
  page: number;
  limit: number;
}

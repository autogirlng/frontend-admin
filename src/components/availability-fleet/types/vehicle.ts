export interface Vehicle {
  vehicleId: string;
  vehicleIdentifier: string;
  listingName: string;
  make: string;
  model: string;
  yearOfRelease: string;
  vehicleType: "sedan" | "SUV" | "truck" | "bus";
  location: string;
  availability: {
    date: string;
    status: "available" | "unavailable";
  }[];
}

export interface VehicleSearchResponse {
  data: Vehicle[];
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

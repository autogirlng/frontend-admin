// app/dashboard/top-rated/types.ts

// The paginated response structure
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- From GET /public/featured-vehicles ---
export interface VehiclePhoto {
  cloudinaryUrl: string;
  isPrimary: boolean;
}

export interface PricingOption {
  bookingTypeName: string;
  price: number;
}

export interface FeaturedVehicle {
  id: string;
  vehicleIdentifier: string;
  name: string;
  photos: VehiclePhoto[];
  city: string;
  allPricingOptions: PricingOption[];
  vehicleTypeName: string;
  numberOfSeats: number;
}

// --- From GET /vehicles?status=APPROVED ---
export interface VehicleSearchResult {
  id: string;
  vehicleIdentifier: string;
  name: string;
  licensePlateNumber?: string;
  ownerName: string;
  status: string;
}

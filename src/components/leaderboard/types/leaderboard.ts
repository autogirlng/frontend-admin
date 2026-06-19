export enum LeaderboardBookingStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  CONFIRMED = "CONFIRMED",
  CANCELLED_BY_ADMIN = "CANCELLED_BY_ADMIN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  VOID = "VOID",
  ABANDONED = "ABANDONED",
}

export enum OwnerType {
  AUTOGIRL = "AUTOGIRL",
  HOST = "HOST",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export interface LeaderboardFilters {
  bookingStatuses?: string;
  ownerType?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  radiusInKm?: number;
  page: number;
  size: number;
}

export interface LeaderboardVehicle {
  vehicleDetails: {
    id: string;
    slug: string;
    vehicleIdentifier: string;
    name: string;
    photos: { cloudinaryUrl: string; isPrimary: boolean }[];
    city: string;
    featured: boolean;
  };
  bookingCount: number;
  totalAmount: number;
}

export interface LeaderboardResponse {
  content: LeaderboardVehicle[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface VehicleAnalyticsResponse {
  vehicleDetails: LeaderboardVehicle["vehicleDetails"];
  timeSeriesData: {
    date: string;
    bookingCount: number;
    totalRevenue: number;
  }[];
  statusData: {
    category: string;
    count: number;
  }[];
}

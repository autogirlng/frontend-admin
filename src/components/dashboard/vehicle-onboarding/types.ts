export enum VehicleStatus {
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_MAINTENANCE = "IN_MAINTENANCE",
  UNAVAILABLE = "UNAVAILABLE",
  COMPANY_USE = "COMPANY_USE",
  BOOKED = "BOOKED",
  IN_TRIP = "IN_TRIP",
}

export type AvailabilityStatus =
  | VehicleStatus.UNAVAILABLE
  | VehicleStatus.IN_MAINTENANCE
  | VehicleStatus.COMPANY_USE;

export interface Vehicle {
  id: string;
  vehicleIdentifier: string;
  name: string;
  licensePlateNumber?: string;
  ownerName: string;
  status: VehicleStatus;
  operationalStatus: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface BookingType {
  id: string;
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}

export interface DiscountDuration {
  id: string;
  name: string;
  minDays: number;
  maxDays: number;
}

export type PlatformFeeType = "HOST_FEE" | "AUTOGIRL_FEE";

export interface VehiclePrice {
  bookingTypeId: string;
  bookingTypeName: string;
  price: number;
  platformFeeType: PlatformFeeType;
}

export interface VehicleDiscount {
  discountDurationId: string;
  percentage: number;
}

export interface ApproveVehiclePayload {
  status: VehicleStatus.APPROVED;
  pricing: VehiclePrice[];
  discounts: VehicleDiscount[];
  extraHourlyRate: number;
}

export interface VehicleFull extends Vehicle {
  supportedBookingTypes: BookingType[];
  pricing: VehiclePrice[];
  discounts: VehicleDiscount[];
  extraHourlyRate: number;
}

export interface BulkCreateVehiclePayload {
  existingVehicleId: string;
  count: number;
  licensePlateNumbers?: string[];
}

export interface BulkCreateVehicleResponse {
  successfulCreations: number;
  createdVehicleIds: string[];
}

export type UnavailabilityReason =
  | "MAINTENANCE"
  | "COMPANY_USE"
  | "UNAVAILABLE";

export interface CreateUnavailabilityPayload {
  startDateTime: string; // ISO 8601 string (e.g., "2025-11-12T12:21:00")
  endDateTime: string; // ISO 8601 string
  reason: UnavailabilityReason;
  notes?: string;
}

export interface UnavailabilityPeriod {
  id: string;
  vehicleId: string;
  startDateTime: string; // ISO 8601 string
  endDateTime: string; // ISO 8601 string
  reason: UnavailabilityReason;
  notes: string;
}

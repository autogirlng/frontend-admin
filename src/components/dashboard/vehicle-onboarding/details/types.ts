// app/dashboard/vehicles/types.ts

// --- Generic Paginated Response ---
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// --- Vehicle Detail Types (for GET /vehicles/{vehicleId}) ---
export interface VehiclePhoto {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
}

export interface VehicleDocument {
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
}

export interface VehicleFeature {
  id: string;
  name: string;
}

export interface BookingTypeSummary {
  id: string;
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}

export interface VehiclePricing {
  bookingTypeId: string;
  price: number;
  platformFeeType: string;
}

export interface VehicleDiscount {
  discountDurationId: string;
  percentage: number;
}

export interface VehicleDetail {
  id: string;
  vehicleIdentifier: string;
  ownerId: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: number;
  hasInsurance: boolean;
  hasTracker: boolean;
  status: string;
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: number;
  description: string;
  maxTripDurationUnit: string;
  maxTripDurationValue: number;
  advanceNoticeUnit: string;
  advanceNoticeValue: number;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  extraHourlyRate: number;
  outskirtFee: number;
  extremeFee: number;
  isVehicleUpgraded: boolean;
  photos: VehiclePhoto[];
  documents: VehicleDocument[];
  features: VehicleFeature[];
  supportedBookingTypes: BookingTypeSummary[];
  pricing: VehiclePricing[];
  discounts: VehicleDiscount[];
  outOfBoundsAreaIds: string[];
}

// --- Vehicle Bookings Types (for GET /bookings/{vehicleId}/bookings) ---
export interface VehicleBookingSegment {
  segmentId: string;
  bookingId: string;
  vehicleUuid: string;
  vehicleId: string;
  vehicleName: string;
  createdAt: string;
  customerName: string;
  bookingType: string;
  city: string;
  duration: string;
  bookingStatus: string;
  price: number;
}

export enum BookingStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  CONFIRMED = "CONFIRMED",
  FAILED_AVAILABILITY = "FAILED_AVAILABILITY",
  CANCELLED_BY_USER = "CANCELLED_BY_USER",
  CANCELLED_BY_HOST = "CANCELLED_BY_HOST",
  CANCELLED_BY_ADMIN = "CANCELLED_BY_ADMIN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export interface BookingSegment {
  segmentId: string;
  bookingId: string;
  vehicleId: string;
  vehicleName: string;
  createdAt: string;
  invoiceNumber: string;
  customerName: string;
  bookingType: string;
  city: string;
  duration: string;
  bookingStatus: BookingStatus;
  price: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Create Bookings

// --- Vehicle Search Result Item ---
export interface VehicleSearchResult {
  id: string;
  vehicleIdentifier: string;
  name: string;
  photos: {
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    isPrimary: boolean;
  }[];
  city: string;
  allPricingOptions: {
    bookingTypeId: string;
    bookingTypeName: string;
    price: number;
    platformFeeType: string;
  }[];
  extraHourlyRate: number;
  vehicleTypeId: string;
  vehicleTypeName: string;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  numberOfSeats: number;
  hostName?: string;
  hostPhoneNumber?: string;
}

export interface AreaOfUseItem {
  areaOfUseLatitude: number;
  areaOfUseLongitude: number;
  areaOfUseName: string;
}

// --- Booking Calculation ---
export interface BookingSegmentPayload {
  bookingTypeId: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  pickupLocationString: string;
  dropoffLocationString: string;
  areaOfUse?: AreaOfUseItem[];
}

export interface CalculateBookingPayload {
  vehicleId: string;
  segments: BookingSegmentPayload[];
}

export interface CalculateBookingResponse {
  calculationId: string;
  basePrice: number;
  discountAmount: number;
  geofenceSurcharge: number;
  platformFeeAmount: number;
  finalPrice: number;
  appliedGeofenceNames: string[];
}

// --- Booking Creation ---
export type BookingChannel =
  | "WEBSITE"
  | "WHATSAPP"
  | "INSTAGRAM"
  | "TELEGRAM"
  | "ZOHO_WHATSAPP"
  | "TWITTER";

export interface CreateBookingPayload {
  calculationId: string;
  primaryPhoneNumber: string;
  guestFullName: string;
  guestEmail: string;
  extraDetails?: string;
  purposeOfRide?: string;
  channel: BookingChannel;
  paymentMethod: "OFFLINE";
  discountAmount?: number;
}

export interface CreateBookingResponse {
  bookingId: string;
  vehicleId: string;
  calculationId: string;
  userId: string; // Can be null if guest booking
  status: BookingStatus;
  totalPrice: number;
  bookedAt: string; // ISO Date string
  primaryPhoneNumber: string;
  segments: {
    startDate: string;
    startTime: string;
    bookingTypeId: string;
    pickupLatitude: number;
    dropoffLatitude: number;
    pickupLongitude: number;
    dropoffLongitude: number;
    pickupLocationString: string;
    dropoffLocationString: string;
  }[];
  bookingForOthers: boolean;
}

export interface CompanyBankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  default: boolean;
}

export interface VehicleSearchFilters {
  latitude?: number;
  longitude?: number;
  radiusInKm?: number;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  minSeats?: number;
  hostName?: string;
  vehicleName?: string;
  vehicleIdentifier?: string;
  city?: string;
  vehicleTypeId?: string;
  vehicleMakeId?: string;
  vehicleModelId?: string;
  maxPrice?: number;
  page: number;
  size?: number;
  pickupLocationString?: string;
  dropoffLocationString?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Booking {
  bookingId: string;
  invoiceNumber?: string;
  bookingStatus: string;
  paymentMethod: string;
  createdAt: string;
  firstSegmentStarts: string | null;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  vehicleIdentifier: string;
  totalPrice: number;
  hostName: string;
}

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

export interface BulkConfirmPayload {
  bookingIds: string[];
}

export interface BulkConfirmFailure {
  bookingId: string;
  reason: string;
}

export interface BulkConfirmResponse {
  successfulConfirmations: number;
  failedConfirmations: number;
  successfulBookingIds: string[];
  failures: BulkConfirmFailure[];
}

export interface CalculationResponse {
  calculationId: string;
  requestedSegments: {
    bookingTypeId: string;
    startDate: string;
    startTime: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLatitude: number;
    dropoffLongitude: number;
    pickupLocationString: string;
    dropoffLocationString: string;
    areaOfUse: {
      areaOfUseLatitude: number;
      areaOfUseLongitude: number;
      areaOfUseName: string;
    }[];
  }[];
}

export interface UpdateBookingPayload {
  segments: {
    bookingTypeId: string;
    startDate: string;
    startTime: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLatitude: number;
    dropoffLongitude: number;
    pickupLocationString: string;
    dropoffLocationString: string;
    areaOfUse: {
      areaOfUseLatitude: number;
      areaOfUseLongitude: number;
      areaOfUseName: string;
    }[];
  }[];
  couponCode?: string;
  discountAmount?: number;
}

export interface UpdateBookingResponse {
  status: string;
  message: string;
  data: {
    bookingId: string;
    totalPrice: number;
    status: string;
  };
  timestamp: string;
}

export interface VehiclePricingOption {
  bookingTypeId: string;
  bookingTypeName: string;
  price: number;
  platformFeeType: string;
}

export interface Vehicle {
  id: string;
  name: string;
  allPricingOptions: VehiclePricingOption[];
}

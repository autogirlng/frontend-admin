export type CouponType = "FIXED_AMOUNT" | "PERCENTAGE";

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountAmount: number;
  couponType?: CouponType;
  usageLimit: number | null;
  usageCount: number;
  specificUserId: string | null;
  specificUserName: string | null;
  startDate: string | null;
  expiryDate: string | null;
  active: boolean;
}

export interface CreateCouponPayload {
  code: string;
  description: string;
  discountAmount: number;
  couponType: CouponType;
  usageLimit?: number;
  specificUserId?: string;
  startDate?: string;
  expiryDate?: string;
}

export interface BookingSegment {
  areaOfUse: {
    areaOfUseName: string;
    areaOfUseLatitude: number;
    areaOfUseLongitude: number;
  }[];
  startDate: string;
  startTime: string;
  bookingTypeId: string;
  pickupLatitude: number;
  dropoffLatitude: number;
  pickupLongitude: number;
  dropoffLongitude: number;
  pickupLocationString: string;
  dropoffLocationString: string;
}

export interface BookingContent {
  bookingId: string;
  invoiceNumber: string;
  vehicleId: string;
  calculationId: string;
  status: string;
  totalPrice: number;
  bookedAt: string;
  primaryPhoneNumber: string;
  guestFullName?: string;
  guestEmail?: string;
  extraDetails: string;
  purposeOfRide: string;
  bookingRef: string;
  segments: BookingSegment[];
  bookingForOthers: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userType: string;
    active: boolean;
  };
}

export interface BookingCouponResponse {
  status: string;
  message: string;
  data: PaginatedResponse<BookingContent>;
  timestamp: string;
}
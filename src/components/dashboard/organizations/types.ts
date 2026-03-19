/**
 * Generic Response Wrappers
 */
export interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: {
    content: T[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface BaseResponse<T> {
  status: string;
  message: string;
  errorCode?: string | null;
  data: T;
  timestamp: string;
}

/**
 * 1. GET /v1/admin/organizations
 */
export interface Organization {
  organizationId: string;
  name: string;
  rcNumber: string;
  industry: string;
  kycStatus: "NOT_SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; // Expanded based on usual flows
  creatorEmail: string;
  createdAt: string;
  active: boolean;
}

/**
 * 2. GET /v1/admin/organizations/{orgId}
 */
export interface OrganizationDetail {
  id: string;
  name: string;
  rcNumber: string;
  industry: string;
  createdAt: string;
  totalStaffCount: number;
  totalBookingsDone: number;
  walletBalance: number;
  totalAmountFunded: number;
  totalAmountSpent: number;
  virtualAccountNumber: string;
  bankName: string;
  accountName: string;
  kycDetails: {
    status: string;
  };
  admins: OrganizationAdmin[];
  active: boolean;
}

export interface OrganizationAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

/**
 * 3. GET /v1/admin/organizations/{orgId}/bookings
 */
export interface Booking {
  bookingId: string;
  invoiceNumber: string;
  calculationId: string;
  userId: string;
  status: string;
  totalPrice: number;
  bookedAt: string;
  primaryPhoneNumber: string;
  user: BookingUser;
  extraDetails: string;
  purposeOfRide: string;
  bookingRef: string;
  segments: BookingSegment[];
  bookingForOthers: boolean;
  vehicleId?: string; // Optional as seen in sample
}

export interface BookingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  departmentName: string;
  referredById: string;
  active: boolean;
}

export interface BookingSegment {
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

/**
 * 4. GET /v1/admin/organizations/{orgId}/kyc-history
 */
export interface KycHistory {
  kycId: string;
  status: string;
  cacNumber: string;
  officeAddress: string;
  servicesRendered: string;
  submittedAt: string;
  reviewRemarks: string;
  reviewedByEmail: string;
  reviewedAt: string;
}

/**
 * Alias: some components import Booking as OrganizationBooking
 */
export type OrganizationBooking = Booking;

/**
 * 5. PATCH /v1/admin/organizations/{orgId}/kyc-review
 */
export interface KycReviewPayload {
  status: string;
  remarks: string;
}

/**
 * 6. GET /v1/admin/organizations/{orgId}/members
 */
export interface OrganizationMember {
  memberId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  amountSpent: number;
  joinedAt: string;
  active: boolean;
}

/**
 * 7. GET /v1/admin/organizations/{orgId}/transactions
 */
export interface OrganizationTransaction {
  transactionId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  transactionType: "DEBIT" | "CREDIT";
  reference: string;
  description: string;
  staffName: string;
  createdAt: string;
}

/**
 * Unwrapped paginated data shape (what apiClient.get() returns after stripping the outer envelope).
 */
export interface PaginatedData<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * GET /v1/admin/organizations/stats
 */
export interface CorporateStats {
  totalOrganizations: number;
  activeOrganizations: number;
  inactiveOrganizations: number;
  newOrganizationsThisMonth: number;
  churnRatePercentage: number;
  totalCorporateStaff: number;
  totalCorporateBookings: number;
  averageBookingsPerOrganization: number;
  totalGlobalWalletBalance: number;
  totalLifetimeFunded: number;
  totalLifetimeSpent: number;
}
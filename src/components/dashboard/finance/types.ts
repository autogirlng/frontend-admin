// app/dashboard/finance/payments/types.ts

// The paginated response structure
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// A single payment object (for list and detail)
export interface Payment {
  id: string;
  bookingId: string;
  paymentStatus: string; // PENDING, SUCCESSFUL, FAILED, ABANDONED
  paymentProvider: string;
  transactionReference: string;
  totalPayable: number;
  amountPaid?: number; // Optional, as it's not on PENDING
  createdAt: string;
  paidAt?: string; // Optional, as it's not on PENDING
  vehicleName: string;
  vehicleIdentifier: string;
  vehicleId: string;
  userId?: string; // Optional
  paymentRef: string;
  invoiceNumber: string;
  bookingRef: string;
  userEmail: string;
  userPhone: string;
  userName: string;
}


// Enums for filters
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  ABANDONED = "ABANDONED",
  FAILED = "FAILED",
}

export type OfflinePaymentApprovalResponse = {
  bookingId: string;
  invoiceNumber: string;
  vehicleId: string;
  calculationId: string;
  userId: string;
  status: string; // e.g. "CONFIRMED"
  totalPrice: number;
  bookedAt: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  guestFullName: string;
  guestEmail: string;
  isBookingForOthers: boolean;
  recipientFullName?: string;
  recipientEmail?: string;
  recipientPhoneNumber?: string;
  recipientSecondaryPhoneNumber?: string;
  extraDetails?: string;
  purposeOfRide?: string;
  bookingRef: string;
  segments: Array<{
    segmentId: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: string;
    distanceKm: number;
    price: number;
  }>;
  // ... add more fields as needed
};
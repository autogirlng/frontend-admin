export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  paymentStatus: string;
  paymentProvider: string;
  transactionReference: string;
  totalPayable: number;
  amountPaid?: number;
  createdAt: string;
  paidAt?: string;
  vehicleName: string;
  vehicleIdentifier: string;
  vehicleId: string;
  userId?: string;
  paymentRef: string;
  invoiceNumber: string;
  bookingRef: string;
  userEmail: string;
  userPhone: string;
  userName: string;
  paymentImage?: string | null;
  publicId?: string | null;
  bookingCategory: "SERVICE_PRICING" | "NORMAL";
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  ABANDONED = "ABANDONED",
  FAILED = "FAILED",
}

export enum PaymentProvider {
  MONNIFY = "MONNIFY",
  PAYSTACK = "PAYSTACK",
  OFFLINE = "OFFLINE",
  MANUAL = "MANUAL",
}

export enum PaymentMethod {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export type OfflinePaymentApprovalResponse = {
  bookingId: string;
  invoiceNumber: string;
  vehicleId: string;
  calculationId: string;
  userId: string;
  status: string;
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
};

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

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Host {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  totalVehicles: number;
  totalBookings: number;
  active: boolean;
}

export interface HostDetail {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  totalVehicles: number;
  totalBookings: number;
  referralWalletBalance: number;
  totalBookingEarnings: number;
  totalReferrals: number;
  hasBankDetails: boolean;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  active: boolean;
  profilePictureUrl?: string; // ✅ Assuming this might exist
}

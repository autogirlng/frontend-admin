// From GET /admin/users/customers
export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  totalBookings: number;
  active: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CustomerDetail {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  totalBookings: number;
  referralWalletBalance: number;
  totalReferrals: number;
  active: boolean;
  profilePictureUrl?: string; // Add profile pic, just in case
}

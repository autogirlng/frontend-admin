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

// From GET /admin/bookings/booking/customer
export interface BookingCustomer {
  customerName: string;
  email: string;
  totalBookingMade: number;
  phoneNumber: string;
  totalBookingCostMade?: number;
}

export interface BookingCustomerPaginatedResponse {
  content: BookingCustomer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

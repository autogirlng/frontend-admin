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

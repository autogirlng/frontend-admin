export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  active: boolean;
  departmentName?: string;
}

export interface AdminUserDetail {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN";
  profilePictureUrl?: string;
  department?: {
    id: string;
    name: string;
  };
  roles?: {
    id: string;
    name: string;
  }[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

export interface Host {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

export interface CreateAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  sendCredentialTo: string[];
}

export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
}

export interface OfflineBooking {
  bookingId: string;
  invoiceNumber: string;
  bookingStatus: string;
  paymentMethod: string;
  createdAt: string;
  firstSegmentStarts: string;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  vehicleIdentifier: string;
  totalPrice: number;
  hostName: string;
}

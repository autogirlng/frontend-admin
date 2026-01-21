export interface DriverApplication {
  id: string;
  fullName: string;
  email: string;
  primaryPhoneNumber: string;
  alternativePhoneNumber?: string;
  yearsOfExperience: number;
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface DriverApplicationFilters {
  searchTerm?: string;
  yearsOfExperience?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

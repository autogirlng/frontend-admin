export enum ReviewStatus {
  // SUCCESSFUL = "SUCCESSFUL",
  // FAILED = "FAILED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface Reviewer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "HOST" | "USER" | string; // Union type allows for expansion
  active: boolean;
}

export interface Moderator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: "ADMIN" | string; // Union type allows for expansion
  active: boolean;
}

export interface RatingReview {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  rating: number;
  review: string;
  entityId: string;
  entityType: "Vehicle" | string; 
  isAnonymous: boolean;
  source: "WEB" | "API" | "MOBILE";
  status: "PENDING" | "APPROVED" | "REJECTED"; // Matches your status filter logic
  isModerated: boolean;
  reviewedBy: Reviewer;
  moderatedBy: Moderator;
  moderatedReason: string ;
}

// Matches the "data" object in your JSON
export interface PaginatedData<T> {
  content: T[];
  page: number;          // API returns 'page', not 'currentPage'
  size: number;          // API returns 'size', not 'pageSize'
  totalElements: number; // API returns 'totalElements', not 'totalItems'
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Matches the root JSON object
export interface ApiResponse<T> {
  status: string;
  message: string;
  timestamp: string;
  data: PaginatedData<T>;
}
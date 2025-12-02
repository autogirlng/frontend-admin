export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountAmount: number;
  usageLimit: number | null;
  usageCount: number;
  specificUserId: string | null;
  specificUserName: string | null;
  startDate: string | null;
  expiryDate: string | null;
  active: boolean;
}

export interface CreateCouponPayload {
  code: string;
  description: string;
  discountAmount: number;
  usageLimit?: number;
  specificUserId?: string;
  startDate?: string;
  expiryDate?: string;
}

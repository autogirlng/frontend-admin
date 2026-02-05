export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ConsolidatedInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: "DRAFT" | "PAID" | "CONFIRMED";
  generatedAt: string;
  customerName: string;
  bookingCount: number;
  bookings?: any[];
  invoiceNumbers: string[]

}



export interface CreateConsolidatedPayload {
  bookingInvoiceNumbers: string[];
}

export interface ConfirmConsolidatedInvoicePayload extends ConsolidatedInvoice {
  publicId: string,
  proofOfPayment: string
}

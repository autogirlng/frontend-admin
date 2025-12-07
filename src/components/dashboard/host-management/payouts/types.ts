export interface PayoutBooking {
  bookingId: string;
  invoiceNumber: string;
  vehicleName: string;
  bookingDate: string;
  basePrice: number;
  geofenceSurcharge: number;
  appliedGeofenceCount: number;
  adminDeduction: number;
  toPayToHost: number;
  hostPaymentStatus: "PENDING" | "PAID";
}

export interface PayoutData {
  totalAmountToPay: number;
  totalPaidToHost: number;
  totalAmountHostHaveMade: number;
  bookings: {
    content: PayoutBooking[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

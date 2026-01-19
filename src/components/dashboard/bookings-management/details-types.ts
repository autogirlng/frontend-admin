export interface Booker {
  fullName: string;
  email: string;
  customerPhone: string;
  userId: string;
}

export interface VehicleSummary {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
}

export interface BookingSegment {
  segmentId: string;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupLatitude: number;
  pickupLongitude: number;
  bookingTypeName: string;
  bookingStatus: string;
  bookingTotalPrice: number;
  vehicle: VehicleSummary;
  booker: Booker;
}

export interface BookingDetail {
  bookingId: string;
  invoiceNumber: string;
  bookingStatus: string;
  paymentMethod: string;
  channel: string;
  bookedAt: string;
  paidAt?: string;

  originalPrice: number;
  discountAmount: number;
  totalPrice: number;
  couponCode?: string;

  purposeOfRide?: string;
  extraDetails?: string;

  calculationId: string;
  booker: Booker;
  vehicle: VehicleSummary;
  segments: BookingSegment[];
  discounted: boolean;
}

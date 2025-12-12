export interface BookingForCalculation {
  bookingId: string;
  invoiceNumber: string;
  bookingStatus: string;
  paymentMethod: string;
  channel: string;
  bookedAt: string;
  purposeOfRide?: string;
  extraDetails?: string;
  totalPrice: number;

  calculationId: string;

  booker: {
    userId: string;
    fullName: string;
    email: string;
    customerPhone: string;
  };
  vehicle: {
    id: string;
    vehicleId: string;
    vehicleName: string;
    licensePlate: string;
  };
  bookingRef?: string;
  segments: any[];
}

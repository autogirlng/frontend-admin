// app/dashboard/bookings/types.ts

// Booker details from the API response
export interface Booker {
  fullName: string;
  email: string;
}

// Vehicle summary from the API response
export interface VehicleSummary {
  id: string;
  vehicleId: string; // This is the identifier like "AG/TYT/..."
  vehicleName: string;
  licensePlate: string;
}

// A single segment of a booking
export interface BookingSegment {
  segmentId: string;
  startDateTime: string; // ✅ ADDED
  endDateTime: string; // ✅ ADDED
  duration: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupLatitude: number; // ✅ ADDED
  pickupLongitude: number; // ✅ ADDED
  bookingTypeName: string;
  bookingStatus: string; // ✅ ADDED
  // Other fields are omitted for brevity as they are duplicates
}

// The main structure for the detailed booking response
export interface BookingDetail {
  bookingId: string;
  bookingStatus: string;
  paymentMethod: string;
  channel: string;
  bookedAt: string;
  totalPrice: number;
  calculationId: string;
  booker: Booker;
  vehicle: VehicleSummary;
  segments: BookingSegment[];
}
